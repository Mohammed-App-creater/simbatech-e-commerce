"""Convert a DC template (x-dc markup + text/x-dc logic) into a Next.js client JSX component."""
import re, json, sys, os
from html.parser import HTMLParser

VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
SVG_TAGS = {'lineargradient':'linearGradient','radialgradient':'radialGradient','clippath':'clipPath',
            'textpath':'textPath','foreignobject':'foreignObject','fegaussianblur':'feGaussianBlur'}
ATTR_MAP = {'class':'className','for':'htmlFor','tabindex':'tabIndex','readonly':'readOnly','maxlength':'maxLength',
            'minlength':'minLength','autocomplete':'autoComplete','inputmode':'inputMode','autofocus':'autoFocus',
            'spellcheck':'spellCheck','enterkeyhint':'enterKeyHint','novalidate':'noValidate','colspan':'colSpan',
            'rowspan':'rowSpan','datetime':'dateTime','crossorigin':'crossOrigin','srcset':'srcSet'}
BOOL = {'checked','disabled','selected','required','readonly','multiple','hidden','open','autofocus','novalidate'}
ROUTES = {'HomeMarket':'/','Products':'/shop','Detail':'/product','Cart':'/cart','Checkout':'/checkout',
          'Confirmation':'/order-confirmed','Account':'/account','SignIn':'/signin'}
BIND = re.compile(r'\{\{\s*(.*?)\s*\}\}')


def route_str(s):
    return re.sub(r'([A-Za-z]+)\.dc\.html', lambda m: ROUTES.get(m.group(1), '/'), s)


def slug(s):
    s = re.sub(r'^[\d.\s]+', '', s.strip())
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')


def fluidize(raw):
    """The design is drawn on a 1440px canvas with 64px side gutters; make those gutters a CSS variable."""
    def shorthand(m):
        vals = m.group(2).split()
        if len(vals) in (2, 3) and vals[1] == '64px':
            vals[1] = 'var(--gutter)'
        elif len(vals) == 4 and vals[1] == '64px' and vals[3] == '64px':
            vals[1] = vals[3] = 'var(--gutter)'
        return m.group(1) + ': ' + ' '.join(vals)
    raw = re.sub(r'\b(padding|margin):\s*([^;]+)', shorthand, raw)
    raw = re.sub(r'\b(left|right):\s*64px', r'\1: var(--gutter)', raw)
    raw = raw.replace('width: 1312px', 'right: var(--gutter)')  # mega menu spans the gutters
    return raw


def px(raw, prop):
    m = re.search(r'(?:^|;)\s*' + prop + r':\s*(-?\d+(?:\.\d+)?)px', raw)
    return float(m.group(1)) if m else None


def has(raw, prop):
    return re.search(r'(?:^|;)\s*' + prop + r':', raw) is not None


def contains(n, pred):
    """True if any descendant (text nodes included; blank text ignored) satisfies pred."""
    for c in n.children:
        if isinstance(c, str):
            if c.strip() and pred(c):
                return True
        elif pred(c) or contains(c, pred):
            return True
    return False


def abs_kind(n):
    """Classify an absolutely positioned element so the responsive stylesheet can re-flow it on small screens."""
    if isinstance(n, str):
        return None
    raw = dict(n.attrs).get('style') or ''
    if not re.search(r'position:\s*absolute', raw):
        return None
    kids = [c for c in n.children if not (isinstance(c, str) and not c.strip())]
    if not kids:
        return 'deco'
    if contains(n, lambda c: c.tag == 'dc-import') and not contains(n, lambda c: isinstance(c, str)):
        return 'art'
    w = px(raw, 'width')
    if (w and w >= 200) or (has(raw, 'top') and has(raw, 'bottom')) or (has(raw, 'left') and has(raw, 'right')):
        return 'text'
    return 'misc'


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.children = tag, attrs, parent, []


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root', [], None)
        self.cur = self.root
        self.scripts = []
        self._in_script = None
        self._comment = None

    def handle_comment(self, data):
        # The design labels each section with a comment; carry it onto the next element as data-sec.
        self._comment = data if 0 < len(data.strip()) < 40 else None

    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self._in_script = dict(attrs)
            self._buf = ''
            return
        if self._comment and not tag.startswith('sc-'):
            attrs = list(attrs) + [('data-sec', slug(self._comment))]
            self._comment = None
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        if tag == 'script':
            self.scripts.append((self._in_script, self._buf))
            self._in_script = None
            return
        if tag in VOID:
            return
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        if self._in_script is not None:
            self._buf += data
            return
        self.cur.children.append(data)


def find(n, tag):
    if isinstance(n, str):
        return None
    if n.tag == tag:
        return n
    for c in n.children:
        r = find(c, tag)
        if r:
            return r
    return None


class Conv:
    def __init__(self, images):
        self.images = images
        self.scope = []  # loop variables
        self.depth = 0

    def expr(self, path):
        head = re.split(r'[.\[]', path)[0]
        return path if head in self.scope else 'vals.' + path

    def value(self, raw):
        """Return a JSX attribute value / JS expression for a raw string that may contain bindings."""
        parts = BIND.split(raw)
        if len(parts) == 1:
            return json.dumps(raw), False
        if len(parts) == 3 and parts[0] == '' and parts[2] == '':
            return self.expr(parts[1]), True
        out = '`'
        for i, p in enumerate(parts):
            if i % 2:
                out += '${' + self.expr(p) + '}'
            else:
                out += p.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        return out + '`', True

    def style(self, raw):
        decls, buf, depth, q = [], '', 0, None
        for ch in raw:
            if q:
                buf += ch
                if ch == q:
                    q = None
                continue
            if ch in '"\'':
                q = ch
            elif ch == '(':
                depth += 1
            elif ch == ')':
                depth -= 1
            if ch == ';' and depth == 0:
                decls.append(buf); buf = ''
            else:
                buf += ch
        decls.append(buf)
        items = []
        for d in decls:
            if ':' not in d or not d.strip():
                continue
            k, v = d.split(':', 1)
            k, v = k.strip(), v.strip()
            if k.startswith('--'):
                key = json.dumps(k)
            else:
                if k.startswith('-webkit-'):
                    k = 'Webkit-' + k[8:]
                elif k.startswith('-moz-'):
                    k = 'Moz-' + k[5:]
                key = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            items.append(f'{key}: {self.value(v)[0]}')
        return '{{ ' + ', '.join(items) + ' }}'

    def is_flex(self, n):
        for k, v in n.attrs:
            if k == 'style' and v and re.search(r'display:\s*(inline-)?(flex|grid)', v):
                return True
        return False

    def ind(self):
        return '  ' * self.depth

    def children(self, n, flex_parent):
        out = []
        kids = n.children
        for c in kids:
            if isinstance(c, str):
                t = re.sub(r'\s+', ' ', c)
                if flex_parent:
                    t = t.strip()
                    if not t:
                        continue
                elif t == ' ':
                    out.append(self.ind() + '{" "}')
                    continue
                if t == '':
                    continue
                out.append(self.ind() + self.text(t))
            else:
                r = self.node(c, flex_parent)
                if r:
                    out.append(r)
        return out

    def text(self, t):
        parts = BIND.split(t)
        s = ''
        for i, p in enumerate(parts):
            if i % 2:
                s += '{' + self.expr(p) + '}'
            elif p:
                if re.search(r'[{}<>&"\'`]', p) or p[0] == ' ' or p[-1] == ' ':
                    s += '{' + json.dumps(p, ensure_ascii=False) + '}'
                else:
                    s += p
        return s

    def hooks(self, n, raw):
        """data-* attributes the responsive stylesheet keys on; they change nothing at desktop width."""
        out = []
        m = re.search(r'grid-template-columns:\s*repeat\((\d+),', raw)
        if re.search(r'display:\s*(inline-)?grid', raw):
            if m:
                cols = m.group(1)
            else:  # explicit track list (table-like rows): name it by track count
                t = re.search(r'grid-template-columns:\s*([^;]+)', raw)
                cols = 't' + str(len(t.group(1).split())) if t else 'auto'
            out.append(f'data-cols="{cols}"')
        m = re.search(r'grid-column:\s*(?:\d+\s*/\s*)?span\s+(\d+)', raw)
        if m:
            out.append(f'data-span="{m.group(1)}"')
        m = re.search(r'grid-row:\s*span\s+(\d+)', raw)
        if m:
            out.append(f'data-rowspan="{m.group(1)}"')
        m = re.search(r'grid-template-rows:\s*repeat\((\d+),\s*\d+px\)', raw)
        if m:
            out.append(f'data-rows="{m.group(1)}"')
        kind = abs_kind(n)
        if kind:
            out.append(f'data-abs="{kind}"')
        if any(abs_kind(c) == 'text' for c in n.children):
            out.append('data-banner')
        w = px(raw, 'width')
        if w and w >= 300 and n.tag not in ('svg', 'img') and not getattr(n, 'is_root', False):
            out.append('data-w')
        # Page-level side-by-side layout (fixed-width sidebar/gallery next to a fluid column)
        if n.tag in ('section', 'main') and re.search(r'display:\s*flex', raw) and not re.search(r'flex-direction:\s*column', raw):
            kids = [c for c in n.children if not isinstance(c, str)]
            if any((px(dict(c.attrs).get('style') or '', 'width') or 0) >= 200 for c in kids):
                out.append('data-row')
        return out

    def attrs(self, n):
        a = dict(n.attrs)
        has_change = 'sc-camel-on-change' in a
        out = []
        for k, v in n.attrs:
            if k.startswith('hint-'):
                continue
            if k == 'style':
                v = fluidize(v or '')
                if getattr(n, 'is_root', False):
                    v = v.replace('width: 1440px', 'width: 100%')
                    v = re.sub(r'(?<![-\w])height:\s*\d+px', 'min-height: 100vh', v)
                out.append('style=' + self.style(v))
                out.extend(self.hooks(n, v))
                continue
            if k.startswith('sc-camel-'):
                name = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k[len('sc-camel-'):])
                val, dyn = self.value(v)
                out.append(f'{name}={{{val}}}' if dyn or name.startswith('on') else f'{name}={val}')
                continue
            if n.tag == 'img' and k == 'src' and v in self.images:
                out.append(f'src="{self.images[v]}"')
                continue
            if k == 'href':
                v = route_str(v)
            name = ATTR_MAP.get(k)
            if name is None:
                if k.startswith('aria-') or k.startswith('data-'):
                    name = k
                elif ':' in k:
                    name = re.sub(r':([a-z])', lambda m: m.group(1).upper(), k)
                else:
                    name = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            if n.tag in ('input', 'select', 'sc-raw-select') and not has_change:
                if k == 'value':
                    name = 'defaultValue'
                if k == 'checked':
                    name = 'defaultChecked'
            if n.tag == 'option' and k == 'selected':
                continue  # handled on the select
            if k in BOOL and (v is None or v == '' or v == k):
                out.append(name)
                continue
            if v is None:
                v = ''
            val, dyn = self.value(v)
            out.append(f'{name}={{{val}}}' if dyn else f'{name}={val}')
        if n.tag in ('select', 'sc-raw-select') and 'value' not in a:
            for c in n.children:
                if not isinstance(c, str) and c.tag == 'option' and 'selected' in dict(c.attrs):
                    out.append('defaultValue=' + json.dumps(dict(c.attrs).get('value', '')))
        if n.tag == 'form' and 'sc-camel-on-submit' not in a:
            out.append('onSubmit={preventSubmit}')
        # text bindings directly inside -> allow time-based values to differ between server and client
        if any(isinstance(c, str) and BIND.search(c) for c in n.children):
            out.append('suppressHydrationWarning')
        return out

    def node(self, n, flex_parent=False):
        tag = n.tag
        a = dict(n.attrs)
        if tag == 'sc-for':
            lst = self.value(a['list'])[0]
            var = a['as']
            idx = f'i{len(self.scope)}'
            self.scope.append(var)
            self.depth += 1
            body = self.children(n, flex_parent)
            self.depth -= 1
            self.scope.pop()
            i = self.ind()
            return (f'{i}{{({lst} || []).map(({var}, {idx}) => (\n{i}  <Fragment key={{{idx}}}>\n'
                    + '\n'.join('  ' + b for b in body) + f'\n{i}  </Fragment>\n{i}))}}')
        if tag == 'sc-if':
            cond = self.value(a['value'])[0]
            self.depth += 1
            body = self.children(n, flex_parent)
            self.depth -= 1
            i = self.ind()
            return f'{i}{{{cond} ? (\n{i}  <>\n' + '\n'.join('  ' + b for b in body) + f'\n{i}  </>\n{i}) : null}}'
        if tag == 'dc-import':
            kind = self.value(a.get('kind', 'camera'))
            return f'{self.ind()}<Render kind={{{kind[0]}}} />'
        if tag == 'helmet':
            return None
        if tag == 'footer':
            # Every page shares one footer component (see src/components/SiteFooter.jsx).
            first = next((c for c in n.children if not isinstance(c, str)), None)
            compact = first is not None and first.tag == 'span'
            self.footer = True
            return f'{self.ind()}<SiteFooter{" compact" if compact else ""} />'
        jtag = SVG_TAGS.get(tag, tag)
        if tag == 'sc-raw-select':
            jtag = 'select'
        if tag == 'a' and a.get('href') and (a['href'].endswith('.dc.html') or BIND.search(a['href'])):
            jtag = 'Link'
        attrs = self.attrs(n)
        head = f'{self.ind()}<{jtag}' + (' ' + ' '.join(attrs) if attrs else '')
        if tag in VOID or not n.children:
            return head + ' />'
        self.depth += 1
        in_svg = tag == 'svg' or (flex_parent == 'svg' and tag != 'text')
        body = self.children(n, 'svg' if in_svg else self.is_flex(n))
        self.depth -= 1
        if not body:
            return head + ' />'
        return head + '>\n' + '\n'.join(body) + f'\n{self.ind()}</{jtag}>'


def convert(path, name, images, is_render=False):
    src = open(path, encoding='utf-8').read()
    p = P()
    p.feed(src)
    xdc = find(p.root, 'x-dc')
    helmet = find(xdc, 'helmet')
    css = ''
    if helmet:
        for c in helmet.children:
            if not isinstance(c, str) and c.tag == 'style':
                t = ''.join(x for x in c.children if isinstance(x, str))
                if '@font-face' in t:
                    continue  # fonts are loaded globally
                css += t.strip() + '\n'
    logic = ''
    for attrs, body in p.scripts:
        if attrs.get('type') == 'text/x-dc':
            logic = body
    logic = route_str(logic).replace('extends DCLogic', 'extends React.Component').strip()
    roots = [c for c in xdc.children if not isinstance(c, str) and c.tag != 'helmet']
    assert len(roots) == 1, (path, [r.tag for r in roots])
    cv = Conv(images)
    cv.depth = 3
    cv.footer = False
    roots[0].is_root = not is_render
    jsx = cv.node(roots[0])
    uses_link = '<Link' in jsx
    imports = ["'use client';", '', "import React, { Fragment } from 'react';"]
    if uses_link:
        imports.append("import Link from 'next/link';")
    if not is_render:
        imports.append("import Render from '@/components/Render';")
    if cv.footer:
        imports.append("import SiteFooter from '@/components/SiteFooter';")
    out = '\n'.join(imports) + '\n\n'
    out += '/* eslint-disable */\n// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.\n\n'
    out += logic + '\n\n'
    if '<form' in jsx:
        out += 'function preventSubmit(e) { e.preventDefault(); }\n\n'
    if css and not is_render:
        out += 'const CSS = ' + json.dumps(css) + ';\n\n'
    out += f'export default class {name} extends Component {{\n  render() {{\n    const vals = this.renderVals();\n    return (\n'
    if css and not is_render:
        out += '      <>\n        <style dangerouslySetInnerHTML={{ __html: CSS }} />\n' + '\n'.join('  ' + l for l in jsx.split('\n')) + '\n      </>\n'
    else:
        out += '\n'.join(l[2:] if l.startswith('  ') else l for l in jsx.split('\n')) + '\n'
    out += '    );\n  }\n}\n'
    return out


if __name__ == '__main__':
    tpl, name, dest, images = sys.argv[1], sys.argv[2], sys.argv[3], json.loads(sys.argv[4])
    is_render = len(sys.argv) > 5 and sys.argv[5] == 'render'
    open(dest, 'w', encoding='utf-8').write(convert(tpl, name, images, is_render))
    print('wrote', dest)

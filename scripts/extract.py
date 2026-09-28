import re,json,base64,gzip,sys,os
src=open(sys.argv[1],encoding='utf-8').read()
out=sys.argv[2]
def block(t):
    m=re.search(r'<script type="__bundler/'+t+r'">(.*?)</script>',src,re.S)
    return m.group(1) if m else None
man=json.loads(block('manifest'))
tpl=json.loads(block('template'))
po=json.loads(block('page_order') or '[]')
ext=block('ext_resources')
ext_map={'text/html':'html','text/javascript':'js','application/javascript':'js','text/css':'css','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','image/webp':'webp','font/woff2':'woff2','font/woff':'woff','font/ttf':'ttf','text/jsx':'jsx','text/babel':'jsx'}
for u,e in man.items():
    b=base64.b64decode(e['data'])
    if e.get('compressed'): b=gzip.decompress(b)
    ex=ext_map.get(e['mime'],'bin')
    open(os.path.join(out,u+'.'+ex),'wb').write(b)
    print(u,e['mime'],len(b))
open(os.path.join(out,'template.html'),'w',encoding='utf-8').write(tpl if isinstance(tpl,str) else json.dumps(tpl))
print('page_order',po)
print('ext',(ext or '')[:500])

/*
 * Shown immediately while a page's data loads from the API (every route: this is the root segment's
 * loading boundary). A neutral outline of the page — header, a wide block, a product grid — so the
 * click gets instant feedback instead of the old page freezing until the new one pops in.
 */
const CSS = `
.pl{min-height:100vh;background:#FFFFFF;font-family:'Geist',system-ui,sans-serif}
.pl-bar{height:36px;background:#0D4F8B}
.pl-head{display:flex;align-items:center;gap:24px;padding:20px var(--gutter,48px);border-bottom:1px solid #EFEDE8}
.pl-main{padding:40px var(--gutter,48px);display:flex;flex-direction:column;gap:32px}
.pl-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
.pl-b{background:linear-gradient(90deg,#F1F0EC 0%,#F8F7F4 40%,#F1F0EC 80%);background-size:200% 100%;
  animation:pl-shimmer 1.3s ease-in-out infinite;border-radius:12px}
@keyframes pl-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
@media (max-width:900px){.pl-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pl-hide{display:none}}
@media (max-width:600px){.pl-head,.pl-main{padding-left:16px;padding-right:16px}}
@media (prefers-reduced-motion:reduce){.pl-b{animation:none}}
`;

export default function Loading() {
  return (
    <div className="pl" role="status" aria-live="polite">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Loading…</span>
      <div className="pl-bar" />
      <div className="pl-head">
        <div className="pl-b" style={{ width: 140, height: 36 }} />
        <div className="pl-b" style={{ flex: 1, height: 48, borderRadius: 999 }} />
        <div className="pl-b pl-hide" style={{ width: 160, height: 36 }} />
      </div>
      <div className="pl-main">
        <div className="pl-b" style={{ height: 280, borderRadius: 24 }} />
        <div className="pl-b" style={{ width: 240, height: 28 }} />
        <div className="pl-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="pl-b" style={{ aspectRatio: "1 / 1", borderRadius: 20 }} />
              <div className="pl-b" style={{ width: "80%", height: 16 }} />
              <div className="pl-b" style={{ width: "45%", height: 16 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

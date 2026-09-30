/* Shown inside the admin frame while a page's data loads: an outline of a heading, tiles and a table. */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <span className="sr-only">Loading…</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="adm-skel" style={{ width: 120, height: 14 }} />
        <div className="adm-skel" style={{ width: "min(420px, 80%)", height: 44 }} />
      </div>
      <div className="adm-tiles">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="adm-skel" style={{ height: 136, borderRadius: 24 }} />
        ))}
      </div>
      <div className="adm-skel" style={{ height: 360, borderRadius: 28 }} />
    </div>
  );
}

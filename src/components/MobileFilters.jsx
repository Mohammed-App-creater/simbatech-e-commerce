"use client";

import { useEffect, useState } from "react";
import "./mobile-filters.css";

/*
 * Wraps the shop's filter sidebar. On desktop every wrapper here is `display: contents`, so the
 * sidebar renders exactly where the design puts it. On phones the sidebar moves into a bottom
 * sheet opened by a "Filters" button, so products are visible without scrolling past every filter.
 */
export default function MobileFilters({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("mf-lock");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("mf-lock");
    };
  }, [open]);

  return (
    <div className="mf" data-open={open ? "" : undefined}>
      <button type="button" className="mf-toggle" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mf-sheet">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
        Filters
      </button>
      <div className="mf-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="mf-sheet" id="mf-sheet" role="dialog" aria-modal={open} aria-label="Filters">
        <div className="mf-head">
          <span className="mf-grip" aria-hidden="true" />
          <strong>Filters</strong>
          <button type="button" className="mf-close" onClick={() => setOpen(false)} aria-label="Close filters">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="mf-body">{children}</div>
        <div className="mf-foot">
          <button type="button" className="mf-apply" onClick={() => setOpen(false)}>
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Render from "@/components/Render";
import { DEPTS } from "@/lib/menu";

/*
 * The header's "All categories" button and its mega menu, for every page except home (HomeScreen has the
 * same menu built into its own state). Markup and inline styles are HomeScreen's, including id="mega" and
 * data-sec="mega-menu", so responsive.css turns it into the tablet dropdown / phone full-screen sheet.
 * The panel is portalled into <body> so it sits at the same page coordinates whatever screen renders it.
 */

const deptHref = (name) => "/shop?dept=" + encodeURIComponent(name);

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const [deptIdx, setDeptIdx] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const btn = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const dept = DEPTS[deptIdx];
  const href = deptHref(dept.shop);

  return (
    <>
      <button
        ref={btn}
        type="button"
        className="ghost"
        onClick={() => {
          setPageHeight(document.documentElement.scrollHeight);
          setOpen((o) => !o);
        }}
        aria-expanded={open ? "true" : "false"}
        aria-controls="mega"
        style={{
          height: "52px",
          boxSizing: "border-box",
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: `1px solid ${open ? "#1679BE" : "#E6E4DE"}`,
          borderRadius: "16px",
          background: open ? "#EAF3FA" : "#FFFFFF",
          font: "inherit",
          fontSize: "14px",
          fontWeight: "600",
          color: "#111318",
          cursor: "pointer",
          flexShrink: "0",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </svg>
        All categories
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open
        ? createPortal(
            <>
              <div
                onClick={close}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  top: "132px",
                  height: Math.max(pageHeight - 132, 0) + "px",
                  background: "rgba(10,20,35,0.35)",
                  zIndex: "20",
                }}
                data-abs="deco"
                data-sec="mega-menu"
              />
              <div
                id="mega"
                role="dialog"
                aria-label="All categories"
                style={{
                  position: "absolute",
                  left: "var(--gutter)",
                  top: "140px",
                  right: "var(--gutter)",
                  height: "470px",
                  boxSizing: "border-box",
                  background: "#FFFFFF",
                  borderRadius: "24px",
                  boxShadow: "0 30px 80px -20px rgba(10,20,35,0.45)",
                  zIndex: "21",
                  display: "flex",
                  overflow: "hidden",
                  fontFamily: "'Geist', system-ui, sans-serif",
                  color: "#111318",
                }}
                data-abs="misc"
              >
                <ul
                  style={{
                    margin: "0",
                    width: "280px",
                    flexShrink: "0",
                    boxSizing: "border-box",
                    padding: "16px",
                    listStyle: "none",
                    background: "#F6F8FB",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {DEPTS.map((d, i) => {
                    const on = i === deptIdx;
                    return (
                      <li key={d.name}>
                        <button
                          type="button"
                          onClick={() => setDeptIdx(i)}
                          onMouseEnter={() => setDeptIdx(i)}
                          aria-current={on ? "true" : "false"}
                          style={{
                            width: "100%",
                            height: "50px",
                            padding: "0 14px",
                            border: "none",
                            borderRadius: "12px",
                            background: on ? "#FFFFFF" : "transparent",
                            color: on ? "#0D4F8B" : "#111318",
                            font: "inherit",
                            fontSize: "15px",
                            fontWeight: "600",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: on ? "0 2px 8px rgba(13,79,139,0.12)" : "none",
                          }}
                        >
                          {d.name}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div style={{ flexGrow: "1", padding: "32px 36px", display: "flex", flexDirection: "column", gap: "26px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
                      <h3
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "30px",
                          fontWeight: "700",
                          letterSpacing: "-0.035em",
                        }}
                      >
                        {dept.name}
                      </h3>
                      <Link href={href} onClick={close} style={{ fontSize: "14px", fontWeight: "600", color: "#1679BE" }}>
                        Shop all
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close menu"
                      style={{
                        width: "44px",
                        height: "44px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#F3F2EE",
                        color: "#111318",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "28px" }} data-cols="3">
                    {dept.groups.map((grp) => (
                      <div key={grp.title} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#5E6470",
                          }}
                        >
                          {grp.title}
                        </span>
                        {grp.links.map((l) => (
                          <Fragment key={l.label}>
                            <Link href={href} onClick={close} style={{ fontSize: "15px", fontWeight: "500", color: "#111318" }}>
                              {l.label}
                            </Link>
                          </Fragment>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href={href}
                  onClick={close}
                  style={{
                    width: "300px",
                    flexShrink: "0",
                    margin: "16px",
                    position: "relative",
                    borderRadius: "20px",
                    background: dept.promoBg,
                    overflow: "hidden",
                    color: "#111318",
                  }}
                  data-banner
                  data-w
                >
                  <div
                    style={{ position: "absolute", left: "24px", top: "24px", right: "24px", display: "flex", flexDirection: "column", gap: "6px" }}
                    data-abs="text"
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: dept.promoFg,
                      }}
                    >
                      {dept.promoEyebrow}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "26px",
                        lineHeight: "1.02",
                        fontWeight: "700",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {dept.promoTitle}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "10px",
                      marginLeft: "-100px",
                      width: "200px",
                      height: "200px",
                    }}
                    data-abs="art"
                  >
                    <Render kind={dept.kind} />
                  </div>
                </Link>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}

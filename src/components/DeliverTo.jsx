"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { api } from "@/lib/client/api";
import { useStore } from "@/components/StoreProvider";
import { storeVals } from "@/lib/client/store";
import { FREE_DELIVERY_THRESHOLD, formatETB } from "@/lib/pricing";

/*
 * The utility bar's "Deliver to …" button and its panel. Signed-in customers pick one of their saved
 * addresses (it becomes the default, so checkout preselects it); anyone can pick their sub-city, which is
 * remembered in this browser, shown on the button and prefilled as the area of a new address at checkout.
 * The panel is portalled into <body>: mobile.css restyles every button inside the utility bar.
 */

export const SUB_CITIES = [
  "Addis Ketema",
  "Akaky Kaliti",
  "Arada",
  "Bole",
  "Gulele",
  "Kirkos",
  "Kolfe Keranio",
  "Lemi Kura",
  "Lideta",
  "Nifas Silk-Lafto",
  "Yeka",
];

const AREA_KEY = "simbatech.deliverArea";
const AREA_EVENT = "deliver-area";

/** The sub-city the visitor picked ("" if none). Browser only: call from effects / event handlers. */
export function readDeliverArea() {
  try {
    return window.localStorage.getItem(AREA_KEY) || "";
  } catch {
    return "";
  }
}
function saveDeliverArea(area) {
  try {
    window.localStorage.setItem(AREA_KEY, area);
  } catch {}
  window.dispatchEvent(new Event(AREA_EVENT));
}

function cutoffLabel(hour) {
  const h = hour % 12 || 12;
  return h + (hour < 12 ? "am" : "pm");
}

export default function DeliverTo() {
  const store = storeVals({ store: useStore() });
  const [area, setArea] = useState("");
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [addrs, setAddrs] = useState(null); // null = not loaded, [] = none / signed out
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const btn = useRef(null);
  const panel = useRef(null);

  // the saved sub-city (after hydration, and when another instance / tab changes it)
  useEffect(() => {
    const sync = () => setArea(readDeliverArea());
    sync();
    window.addEventListener(AREA_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AREA_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e) => {
      if (!panel.current?.contains(e.target) && !btn.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  function toggle() {
    if (open) return setOpen(false);
    const r = btn.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX });
    setError("");
    setOpen(true);
    // saved addresses (401 = signed out)
    api("GET", "/api/addresses")
      .then((res) => {
        setSignedIn(true);
        setAddrs(res.addresses || []);
      })
      .catch(() => {
        setSignedIn(false);
        setAddrs([]);
      });
  }

  function pickArea(a) {
    saveDeliverArea(a);
    setOpen(false);
  }

  function pickAddress(a) {
    if (busy) return;
    setBusy(a.id);
    setError("");
    const done = () => {
      if (a.area) saveDeliverArea(a.area);
      setBusy("");
      setOpen(false);
    };
    if (a.isDefault) return done();
    api("PATCH", "/api/addresses/" + a.id, { isDefault: true })
      .then((res) => {
        setAddrs(res.addresses || addrs);
        done();
      })
      .catch((err) => {
        setBusy("");
        setError(err.message || "Couldn't update your address. Try again.");
      });
  }

  const place = area || store.city;

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={toggle}
        aria-expanded={open ? "true" : "false"}
        aria-haspopup="dialog"
        aria-controls="deliver-to"
        style={{
          height: "28px",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "8px",
          background: open ? "rgba(255,255,255,0.12)" : "transparent",
          color: "#FFFFFF",
          font: "inherit",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8FD19A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
        Deliver to
        <strong suppressHydrationWarning>{place}</strong>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open
        ? createPortal(
            <div
              ref={panel}
              id="deliver-to"
              role="dialog"
              aria-label="Choose where to deliver"
              style={{
                position: "absolute",
                top: pos.top + "px",
                left: `clamp(16px, ${pos.left}px, calc(100vw - 16px - min(380px, 100vw - 32px)))`,
                width: "min(380px, calc(100vw - 32px))",
                boxSizing: "border-box",
                padding: "20px",
                background: "#FFFFFF",
                color: "#111318",
                borderRadius: "20px",
                boxShadow: "0 24px 60px -18px rgba(10,20,35,0.4)",
                border: "1px solid #EFEDE8",
                zIndex: "50",
                fontFamily: "'Geist', system-ui, sans-serif",
                fontSize: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.03em" }}>
                  Where should we deliver?
                </span>
                <span style={{ fontSize: "13px", color: "#5E6470", lineHeight: "1.45" }}>
                  We deliver across {store.city}. Order before {cutoffLabel(store.sameDayCutoffHour)} for same-day delivery; free on
                  purchases over {formatETB(FREE_DELIVERY_THRESHOLD)}.
                </span>
              </div>

              {signedIn && addrs && addrs.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#5E6470" }}>
                    Your addresses
                  </span>
                  {addrs.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => pickAddress(a)}
                      aria-pressed={a.isDefault ? "true" : "false"}
                      disabled={!!busy}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        border: `1px solid ${a.isDefault ? "#0D4F8B" : "#EFEDE8"}`,
                        borderRadius: "14px",
                        background: a.isDefault ? "#EAF3FA" : "#FFFFFF",
                        font: "inherit",
                        textAlign: "left",
                        cursor: busy ? "wait" : "pointer",
                        color: "#111318",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "16px",
                          height: "16px",
                          flexShrink: "0",
                          borderRadius: "999px",
                          border: `2px solid ${a.isDefault ? "#0D4F8B" : "#B4B8BF"}`,
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {a.isDefault ? <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#0D4F8B" }} /> : null}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                        <span style={{ fontWeight: "700" }}>{busy === a.id ? "Saving…" : a.label}</span>
                        <span style={{ fontSize: "13px", color: "#5E6470", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {[a.line1, a.area, a.city].filter(Boolean).join(", ")}
                        </span>
                      </span>
                    </button>
                  ))}
                  {error ? (
                    <span role="alert" style={{ fontSize: "12px", color: "#B02418" }}>
                      {error}
                    </span>
                  ) : null}
                  <Link href="/account?tab=addresses" onClick={() => setOpen(false)} style={{ fontSize: "13px", fontWeight: "600", color: "#1679BE" }}>
                    Manage addresses
                  </Link>
                </div>
              ) : null}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#5E6470" }}>
                  {signedIn && addrs && addrs.length ? "Or choose your area" : "Choose your area"}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {SUB_CITIES.map((a) => {
                    const on = a === area;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => pickArea(a)}
                        aria-pressed={on ? "true" : "false"}
                        style={{
                          height: "32px",
                          padding: "0 12px",
                          border: `1px solid ${on ? "#0D4F8B" : "#E6E4DE"}`,
                          borderRadius: "999px",
                          background: on ? "#0D4F8B" : "#FFFFFF",
                          color: on ? "#FFFFFF" : "#111318",
                          font: "inherit",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>

              {addrs && !signedIn ? (
                <span style={{ fontSize: "13px", color: "#5E6470" }}>
                  <Link href="/signin" onClick={() => setOpen(false)} style={{ fontWeight: "600", color: "#1679BE" }}>
                    Sign in
                  </Link>{" "}
                  to use your saved addresses.
                </span>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

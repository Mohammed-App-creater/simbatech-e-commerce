"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Render from "@/components/Render";
import { formatETB } from "@/lib/pricing";

/*
 * Building blocks shared by the admin screens (src/screens/admin): formatting, status labels,
 * and the small pieces of the design (page heading, pills, tabs, product thumbnail, fields).
 * Styles are in admin.css.
 */

// ── Formatting. Addis Ababa is UTC+3 all year, so the server and the browser print the same text. ──
const TZ_OFFSET = 3 * 3600000;
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MOL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WDL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const local = (iso) => new Date(Date.parse(iso) + TZ_OFFSET); // read with getUTC*
const two = (n) => (n < 10 ? "0" : "") + n;

export const money = formatETB;
export const plural = (n, word) => n + " " + word + (n === 1 ? "" : "s");
export function dShort(iso) {
  const d = local(iso);
  return d.getUTCDate() + " " + MO[d.getUTCMonth()];
}
export function dLong(iso) {
  const d = local(iso);
  return d.getUTCDate() + " " + MO[d.getUTCMonth()] + " " + d.getUTCFullYear();
}
export function stamp(iso) {
  const d = local(iso);
  return dShort(iso) + ", " + two(d.getUTCHours()) + ":" + two(d.getUTCMinutes());
}
export function dayLabel(iso) {
  const d = local(iso);
  return WDL[d.getUTCDay()] + " " + d.getUTCDate() + " " + MOL[d.getUTCMonth()];
}
export function initials(name) {
  return (name || "")
    .split(/\s+/)
    .map((w) => w[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Status labels (the API's values → what staff read) ──
export const ORDER_STATUS = {
  PLACED: { label: "To pack", tone: "amber" },
  PACKED: { label: "Packed", tone: "amber" },
  OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "blue" },
  DELIVERED: { label: "Delivered", tone: "green" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};
export const PAY_METHOD = { telebirr: "Telebirr", card: "Card", cod: "Pay on delivery" };
export const PAY_STATUS = {
  paid: { label: "Paid", tone: "green" },
  pending: { label: "Payment pending", tone: "amber" },
  failed: { label: "Payment failed", tone: "red" },
  refunded: { label: "Refunded", tone: "blue" },
};
export const RENTAL_STATUS = {
  scheduled: { label: "Scheduled", tone: "amber" },
  active: { label: "With customer", tone: "blue" },
  returned: { label: "Returned", tone: "green" },
};
export const REVIEW_STATUS = {
  pending: { label: "Waiting for approval", tone: "amber" },
  approved: { label: "Approved", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
};

export function payLabel(payment) {
  if (payment.status === "pending" && payment.method === "cod") return "Pay on delivery";
  return PAY_STATUS[payment.status].label + " · " + PAY_METHOD[payment.method];
}

// ── Pieces of the design ──

export function Icon({ d, size = 19, width = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {[].concat(d).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export const ARROW = "M5 12h14M13 6l6 6-6 6";

/** Eyebrow + big heading (with the design's green serif accent) + the page's main actions. */
export function PageHead({ eyebrow, title, accent, sub, children }) {
  return (
    <div className="adm-pagehead">
      <div>
        <span className="adm-eyebrow">{eyebrow}</span>
        <h1 className="adm-h1">
          {title}
          {accent ? <em> {accent}</em> : null}
        </h1>
        {sub ? <p className="adm-sub">{sub}</p> : null}
      </div>
      {children ? <div className="adm-actions">{children}</div> : null}
    </div>
  );
}

export function Pill({ tone, children }) {
  return (
    <span className="adm-pill" data-tone={tone}>
      {children}
    </span>
  );
}

/** Filter tabs. Each one is a link, so the filter lives in the URL and the server sends the rows. */
export function Tabs({ label, items }) {
  return (
    <nav className="adm-tabs" aria-label={label}>
      {items.map((t) => (
        <Link key={t.href} href={t.href} aria-current={t.on ? "true" : undefined}>
          {t.label}
          {t.count === undefined ? null : <b>{t.count}</b>}
        </Link>
      ))}
    </nav>
  );
}

/** A product's illustration on its background colour, as the storefront draws it. */
export function Thumb({ kind, bg, size = 48, title }) {
  return (
    <span className="adm-thumb" title={title} style={{ width: size + "px", height: size + "px", borderRadius: Math.round(size / 4) + "px", background: bg }}>
      <span style={{ display: "block", zoom: String((size - 4) / 200), width: "200px", height: "200px" }}>
        <Render kind={kind} />
      </span>
    </span>
  );
}

const STAR = "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z";
export function Stars({ rating }) {
  return (
    <span className="adm-stars" role="img" aria-label={"Rated " + rating + " out of 5"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= rating ? "#F0AE00" : "#E6E4DE"} aria-hidden="true">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="adm-empty">
      <strong>{title}</strong>
      {children}
    </div>
  );
}

/** Label + control + hint + the API's error for this field. */
export function Field({ label, hint, error, wide, children }) {
  return (
    <label className="adm-field" data-wide={wide ? "" : undefined}>
      {label}
      {children}
      {error ? (
        <span role="alert" className="adm-error">
          {error}
        </span>
      ) : hint ? (
        <small>{hint}</small>
      ) : null}
    </label>
  );
}

/** "Showing the latest N of M" under a list the API cut short. */
export function MoreNote({ shown, total, what }) {
  if (total <= shown) return null;
  return (
    <div className="adm-more-note">
      Showing the latest {shown} of {total} {what}. Search to find older ones.
    </div>
  );
}

/*
 * Runs one admin action at a time: `run(key, fn)` calls the API, then re-fetches the page's data
 * from the server (the screens render straight from their props). `busyKey` names the control
 * that is working until the fresh data has arrived; `error` holds the API's message for `errorKey`.
 */
export function useAction() {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const [state, setState] = useState({ key: null, running: false, error: null });

  async function run(key, fn, { refresh = true } = {}) {
    if (state.running) return undefined;
    setState({ key, running: true, error: null });
    try {
      const out = await fn();
      setState({ key, running: false, error: null });
      if (refresh) startTransition(() => router.refresh());
      return out === undefined ? true : out;
    } catch (err) {
      setState({ key, running: false, error: { message: (err && err.message) || "Something went wrong. Please try again.", field: (err && err.field) || null } });
      return undefined;
    }
  }

  const busy = state.running || refreshing;
  return {
    run,
    busy,
    busyKey: busy ? state.key : null,
    error: state.error,
    errorKey: state.error ? state.key : null,
    clearError: () => setState((s) => (s.error ? { ...s, error: null } : s)),
  };
}

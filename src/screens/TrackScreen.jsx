"use client";

import { Fragment, useEffect, useState } from "react";
import Render from "@/components/Render";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { trackOrder, formatETB } from "@/lib/client/store";
import PhoneInput from "@/components/PhoneInput";
import { isCompletePhone } from "@/lib/phone";

/*
 * /track — public order lookup: order number + the phone used on the order → the same tracking
 * timeline the confirmation page shows (Placed / Packed / Out for delivery / Delivered), the items
 * and the totals. `initial.number` / `initial.phone` prefill the form from the URL.
 */

const TZ = "Africa/Addis_Ababa"; // fixed zone so server and client render the same text
const TRACK = [
  { status: "PLACED", label: "Placed" },
  { status: "PACKED", label: "Packed" },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { status: "DELIVERED", label: "Delivered" },
];
const HEADINGS = [
  "Your purchases are being packed",
  "Your order is packed and ready to go",
  "Your order is out for delivery",
  "Your order has been delivered",
];
const METHOD = { telebirr: "TELEBIRR", card: "CARD", cod: "PAY ON DELIVERY" };

function parts(iso, opts) {
  const out = {};
  new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: TZ }, opts)).formatToParts(new Date(iso)).forEach((p) => {
    out[p.type] = p.value;
  });
  return out;
}
const ampm = (p) => (p.dayPeriod || "").toLowerCase().replace(/[\s.]/g, "");
// "Tue 6 Oct 2026"
function fmtDate(iso) {
  if (!iso) return "";
  const p = parts(iso, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  return p.weekday + " " + p.day + " " + p.month + " " + p.year;
}
// "Tue 6 Oct"
function fmtDay(iso) {
  if (!iso) return "";
  const p = parts(iso, { weekday: "short", day: "numeric", month: "short" });
  return p.weekday + " " + p.day + " " + p.month;
}
// "10:42am"
function fmtTime(iso) {
  const p = parts(iso, { hour: "numeric", minute: "2-digit", hour12: true });
  return p.hour + ":" + p.minute + ampm(p);
}
const fmtStamp = (iso) => fmtDay(iso) + ", " + fmtTime(iso);
const dayWord = (n) => n + (n === 1 ? " day" : " days");

const FIELD = {
  height: "52px",
  boxSizing: "border-box",
  padding: "0 16px",
  border: "1.5px solid #E6E4DE",
  borderRadius: "14px",
  background: "#FFFFFF",
  font: "inherit",
  fontSize: "15px",
  color: "#111318",
};
const CARD = { border: "1px solid #EFEDE8", borderRadius: "28px", padding: "28px", display: "flex", flexDirection: "column", gap: "24px" };
const H2 = { margin: "0", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.035em" };
const ROW = { display: "flex", justifyContent: "space-between" };
const DT = { color: "#3A3F4A" };
const DD = { margin: "0", fontWeight: "600" };

// The timeline steps, computed exactly like the confirmation page does.
function trackSteps(o) {
  const cancelled = o.status === "CANCELLED";
  const step = o.step || 0;
  const current = cancelled ? -1 : step + 1;
  const eventAt = {};
  (o.events || []).forEach((e) => {
    eventAt[e.status] = e.at;
  });
  const slotShort = o.deliveryDate ? fmtDay(o.deliveryDate) + (o.deliveryWindow ? ", " + o.deliveryWindow : "") : "";
  return TRACK.map((t, i) => {
    const done = !cancelled && i <= step;
    const cur = i === current;
    const time = eventAt[t.status]
      ? fmtStamp(eventAt[t.status])
      : i === 1
        ? "Expected soon"
        : i === 2
          ? slotShort || "To be scheduled"
          : o.deliveryDate
            ? fmtDay(o.deliveryDate)
            : "To be scheduled";
    return {
      label: t.label,
      time,
      done,
      notDone: !done,
      notLast: i < TRACK.length - 1,
      aria: cur ? "step" : "false",
      state: done ? "Done" : cur ? "In progress" : cancelled ? "Cancelled" : "Pending",
      stateFg: done ? "#2F7A3C" : cur ? "#0D4F8B" : "#5E6470",
      ring: done ? "#2F7A3C" : cur ? "#1679BE" : "#D5D3CC",
      bg: done ? "#2F7A3C" : "#FFFFFF",
      fg: "#FFFFFF",
      dotBg: cur ? "#1679BE" : "#D5D3CC",
      glow: cur ? "0 0 0 6px rgba(22,121,190,0.15)" : "none",
      labelFg: done || cur ? "#111318" : "#5E6470",
      lineBg: done && i < step ? "#2F7A3C" : "#EFEDE8",
    };
  });
}

function Timeline({ order: o }) {
  const cancelled = o.status === "CANCELLED";
  const track = trackSteps(o);
  const events = o.events || [];
  const lastEvent = events[events.length - 1];
  const pickup = o.fulfilment === "pickup" || !o.address;
  const slot = o.deliveryDate ? fmtDate(o.deliveryDate) + (o.deliveryWindow ? " · " + o.deliveryWindow : "") : "To be scheduled";
  return (
    <>
      <section aria-labelledby="h-track" style={CARD} data-sec="tracking-timeline">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
              Live tracking
            </span>
            <h2 id="h-track" style={H2}>
              {cancelled ? "This order was cancelled" : HEADINGS[Math.min(o.step || 0, 3)]}
            </h2>
          </div>
          <span
            style={{
              height: "32px",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "999px",
              background: "#EAF3FA",
              color: "#0D4F8B",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#1679BE",
                boxShadow: "0 0 0 4px rgba(22,121,190,0.2)",
              }}
            />
            {lastEvent ? "Updated " + fmtTime(lastEvent.at) : "Placed " + fmtDay(o.createdAt)}
          </span>
        </div>
        <ol
          style={{ margin: "0", padding: "0", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
          data-cols="4"
        >
          {track.map((t, i0) => (
            <Fragment key={i0}>
              <li aria-current={t.aria} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      flexShrink: "0",
                      boxSizing: "border-box",
                      borderRadius: "999px",
                      border: `2px solid ${t.ring}`,
                      background: t.bg,
                      color: t.fg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: t.glow,
                    }}
                  >
                    {t.done ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    ) : null}
                    {t.notDone ? <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: t.dotBg }} /> : null}
                  </span>
                  {t.notLast ? (
                    <span
                      aria-hidden="true"
                      style={{ flexGrow: "1", height: "3px", margin: "0 10px", borderRadius: "999px", background: t.lineBg }}
                    />
                  ) : null}
                </div>
                <span style={{ display: "flex", flexDirection: "column", gap: "3px", paddingRight: "16px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: t.labelFg }}>{t.label}</span>
                  <span style={{ fontSize: "13px", color: "#5E6470" }}>{t.time}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: t.stateFg }}>{t.state}</span>
                </span>
              </li>
            </Fragment>
          ))}
        </ol>
      </section>
      <section aria-labelledby="h-dlv" style={{ ...CARD, gap: "18px" }} data-sec="delivery-card">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "#EAF3FA",
              color: "#0D4F8B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
              <circle cx="7" cy="17.5" r="1.8" />
              <circle cx="17" cy="17.5" r="1.8" />
            </svg>
          </span>
          <h2 id="h-dlv" style={{ ...H2, fontSize: "22px", letterSpacing: "-0.03em" }}>
            {pickup ? "Store pick-up" : "Delivery"}
          </h2>
        </div>
        <dl style={{ margin: "0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
          <div style={ROW}>
            <dt style={DT}>Order number</dt>
            <dd style={{ ...DD, fontWeight: "700" }}>{o.number}</dd>
          </div>
          <div style={ROW}>
            <dt style={DT}>Placed</dt>
            <dd style={DD}>{fmtDate(o.createdAt)}</dd>
          </div>
          <div style={ROW}>
            <dt style={DT}>{pickup ? "Ready for pick-up" : "Delivery slot"}</dt>
            <dd style={DD}>{slot}</dd>
          </div>
          {!pickup ? (
            <div style={ROW}>
              <dt style={DT}>Address</dt>
              <dd style={{ ...DD, textAlign: "right" }}>
                {o.address.line1}
                {o.address.area ? ", " + o.address.area : ""}
                {o.address.city ? ", " + o.address.city : ""}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>
    </>
  );
}

function Summary({ order: o }) {
  const lines = (o.items || []).map((l) => {
    const rent = l.mode === "rent";
    const price = l.lineTotal + (rent ? l.extraCharge || 0 : 0);
    return {
      name: l.name + (l.variant ? " · " + l.variant : ""),
      kind: l.kind,
      bg: l.bg,
      qty: l.qty,
      meta: rent ? "Rental · " + dayWord(l.rentDays || 0) : "Purchase · Qty " + l.qty,
      priceFmt: formatETB(price),
      badgeBg: rent ? "#2F7A3C" : "#0D4F8B",
      metaFg: rent ? "#2F7A3C" : "#5E6470",
    };
  });
  const rentItems = (o.items || []).filter((i) => i.mode === "rent");
  const t = o.totals || {};
  const pay = o.payment || {};
  return (
    <aside
      aria-labelledby="h-sum"
      style={{
        ...CARD,
        gap: "18px",
        background: "#FFFFFF",
        boxShadow: "0 24px 60px -32px rgba(13,79,139,0.35)",
      }}
      data-sec="order-summary"
    >
      <h2 id="h-sum" style={H2}>
        Order summary
      </h2>
      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
        {lines.map((l, i0) => (
          <Fragment key={i0}>
            <li style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span
                style={{
                  position: "relative",
                  width: "60px",
                  height: "60px",
                  flexShrink: "0",
                  borderRadius: "16px",
                  background: l.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ zoom: "0.27", width: "200px", height: "200px" }}>
                  <Render kind={l.kind} />
                </div>
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    minWidth: "20px",
                    height: "20px",
                    padding: "0 5px",
                    boxSizing: "border-box",
                    borderRadius: "999px",
                    background: l.badgeBg,
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-abs="misc"
                >
                  {l.qty}
                </span>
              </span>
              <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>{l.name}</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: l.metaFg }}>{l.meta}</span>
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700" }}>{l.priceFmt}</span>
            </li>
          </Fragment>
        ))}
      </ul>
      <dl
        style={{
          margin: "0",
          paddingTop: "16px",
          borderTop: "1px solid #EFEDE8",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontSize: "15px",
        }}
      >
        {t.purchases > 0 ? (
          <div style={ROW}>
            <dt style={DT}>Purchases</dt>
            <dd style={DD}>{formatETB(t.purchases)}</dd>
          </div>
        ) : null}
        {t.discount > 0 ? (
          <div style={ROW}>
            <dt style={DT}>Discount</dt>
            <dd style={{ ...DD, color: "#2F7A3C" }}>{"−" + formatETB(t.discount)}</dd>
          </div>
        ) : null}
        {rentItems.length > 0 ? (
          <div style={ROW}>
            <dt style={DT}>
              {rentItems.length === 1 ? "Rental · " + dayWord(rentItems[0].rentDays || 0) : "Rentals · " + rentItems.length + " items"}
            </dt>
            <dd style={DD}>{formatETB(t.rentals || 0)}</dd>
          </div>
        ) : null}
        <div style={ROW}>
          <dt style={DT}>Delivery</dt>
          {t.deliveryFee > 0 ? <dd style={DD}>{formatETB(t.deliveryFee)}</dd> : <dd style={{ ...DD, color: "#2F7A3C" }}>Free</dd>}
        </div>
        {t.deposit > 0 ? (
          <div style={ROW}>
            <dt style={DT}>Refundable deposit</dt>
            <dd style={DD}>{formatETB(t.deposit)}</dd>
          </div>
        ) : null}
        <div style={ROW}>
          <dt style={DT}>{pay.status === "paid" ? "Paid with" : "Payment"}</dt>
          <dd style={{ ...DD, fontWeight: "700", color: "#1F9D55" }}>
            {(METHOD[pay.method] || String(pay.method || "").toUpperCase()) +
              (pay.status === "paid" || !pay.status ? "" : " · " + pay.status)}
          </dd>
        </div>
      </dl>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "16px",
          borderTop: "1px solid #EFEDE8",
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700" }}>Total</span>
          {t.deposit > 0 ? (
            <span style={{ fontSize: "12px", color: "#5E6470" }}>{"+ " + formatETB(t.deposit) + " refundable deposit"}</span>
          ) : null}
        </span>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.035em" }}>
          {formatETB(t.total || 0)}
        </span>
      </div>
    </aside>
  );
}

export default function TrackScreen({ initial }) {
  const init = initial || {};
  const [number, setNumber] = useState(init.number || "");
  const [phone, setPhone] = useState(init.phone || "");
  // /track?number=…&phone=… looks the order up straight away (the page starts in the busy state)
  const auto = !!(init.number && init.phone);
  const [busy, setBusy] = useState(auto);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!auto) return undefined;
    let stale = false;
    trackOrder(init.number.trim(), init.phone.trim())
      .then(
        (o) => {
          if (!stale) setOrder(o);
        },
        (err) => {
          if (!stale) setError((err && err.message) || "Something went wrong. Please try again.");
        },
      )
      .then(() => {
        if (!stale) setBusy(false);
      });
    return () => {
      stale = true;
    };
  }, [auto, init.number, init.phone]);

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    const n = number.trim();
    const p = phone.trim();
    if (!n || !p) {
      setError("Enter your order number and the phone number used on the order.");
      return;
    }
    if (!isCompletePhone(p)) {
      setError("Enter the 9 digits after +251, starting with 9 or 7 (e.g. 911 234 567).");
      return;
    }
    setBusy(true);
    setError("");
    try {
      setOrder(await trackOrder(n, p));
    } catch (err) {
      setOrder(null);
      setError((err && err.message) || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        color: "#111318",
        overflow: "hidden",
      }}
    >
      <SiteHeader initial={initial} />
      <section style={{ padding: "48px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }} data-sec="track-form">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
            Customer care
          </span>
          <h1
            style={{
              margin: "0",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "44px",
              lineHeight: "1",
              fontWeight: "700",
              letterSpacing: "-0.04em",
            }}
          >
            Track your order
          </h1>
          <span style={{ fontSize: "17px", lineHeight: "1.5", color: "#5E6470" }}>
            Enter your order number and the phone number you used at checkout. No sign-in needed.
          </span>
        </div>
        <form
          onSubmit={onSubmit}
          style={{
            maxWidth: "860px",
            boxSizing: "border-box",
            border: "1px solid #EFEDE8",
            borderRadius: "28px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            background: "#FFFFFF",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }} data-cols="2">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="tr-number" style={{ fontSize: "14px", fontWeight: "600" }}>
                Order number
              </label>
              <input
                id="tr-number"
                type="text"
                placeholder="ST-123456"
                autoComplete="off"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value);
                  setError("");
                }}
                style={{ ...FIELD, textTransform: "uppercase" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="tr-phone" style={{ fontSize: "14px", fontWeight: "600" }}>
                Phone number
              </label>
              <PhoneInput
                id="tr-phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                radius={14}
                height={52}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              type="submit"
              className="btn-y"
              disabled={busy}
              style={{
                height: "54px",
                padding: "0 28px",
                border: "none",
                borderRadius: "14px",
                background: "#2F7A3C",
                color: "#FFFFFF",
                font: "inherit",
                fontSize: "16px",
                fontWeight: "700",
                cursor: busy ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {busy ? "Looking up…" : "Track order"}
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            {error ? (
              <span role="alert" style={{ fontSize: "13px", fontWeight: "600", color: "#C42A1C" }}>
                {error}
              </span>
            ) : (
              <span style={{ fontSize: "13px", color: "#5E6470" }}>Your order number is in your confirmation SMS and email.</span>
            )}
          </div>
        </form>
      </section>
      {order ? (
        <section
          style={{
            padding: "24px var(--gutter) 0",
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
          data-cols="12"
          data-sec="track-result"
        >
          <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: "20px" }} data-span="8">
            <Timeline order={order} />
          </div>
          <div style={{ gridColumn: "span 4" }} data-span="4">
            <Summary order={order} />
          </div>
        </section>
      ) : null}
      <SiteFooter />
    </div>
  );
}

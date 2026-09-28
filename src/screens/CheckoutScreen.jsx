"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

// Sample cart (same as /cart): purchases ETB 104,500, camera rental ETB 6,900 (3 days).
var PURCHASES = 104500;
var RENTALS = 6900;
// PLACEHOLDER: sample delivery fees. Same-day costs extra; other days are free because purchases are over the sample ETB 100,000 threshold.
var SAME_DAY_FEE = 450;
var LINES = [
  { name: "Lumen Z6 Camera", kind: "camera", bg: "#E0F1FF", qty: 1, meta: "Rental · 3 Oct – 6 Oct", price: 6900, rent: true },
  { name: "Linen 3-Seater Sofa", kind: "sofa", bg: "#F3EEE6", qty: 1, meta: "Purchase · Qty 1", price: 84900 },
  { name: "Street Runner Sneakers", kind: "sneaker", bg: "#FFE4EF", qty: 2, meta: "Purchase · Qty 2 × ETB 9,800", price: 19600 },
];
var ADDRS = [
  { id: "home", label: "Home", line1: "[ADDRESS LINE], [AREA]", line2: "[CITY] · [PHONE]" },
  { id: "work", label: "Work", line1: "[ADDRESS LINE], [AREA]", line2: "[CITY] · Reception, [HOURS]" },
];
// Today is Mon 28 Sep 2026 in this mock.
var DAYS = [
  { id: "today", label: "Today", sub: "Mon 28 Sep" },
  { id: "tomorrow", label: "Tomorrow", sub: "Tue 29 Sep" },
  { id: "date", label: "Pick a date", sub: "" },
];
var DATES = [
  { id: "d30", dow: "Wed", day: "30 Sep" },
  { id: "d1", dow: "Thu", day: "1 Oct" },
  { id: "d2", dow: "Fri", day: "2 Oct" },
  { id: "d3", dow: "Sat", day: "3 Oct" },
  { id: "d5", dow: "Mon", day: "5 Oct" },
];
var WINDOWS = [
  { id: "w1", label: "9am – 12pm" },
  { id: "w2", label: "12pm – 3pm" },
  { id: "w3", label: "3pm – 6pm" },
  { id: "w4", label: "6pm – 8pm" },
];
var PAYS = [
  { id: "mpesa", title: "Telebirr", sub: "Pay instantly from your phone", chip: "TELEBIRR", chipFg: "#1F9D55", chipStyle: "normal" },
  { id: "card", title: "Debit or credit card", sub: "Visa or Mastercard", chip: "VISA", chipFg: "#1A1F71", chipStyle: "italic" },
  {
    id: "cod",
    title: "Pay on delivery",
    sub: "Telebirr or card at your door",
    chip: "ON DELIVERY",
    chipFg: "#3A3F4A",
    chipStyle: "normal",
  },
];
var BLUE = "#0D4F8B",
  GREEN = "#2F7A3C",
  GREY = "#B4B8BF";
function fmt(n) {
  return (
    "ETB " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
function digits(v, max) {
  return String(v || "")
    .replace(/\D/g, "")
    .slice(0, max);
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      addr: "home",
      newLine: "",
      newArea: "",
      newCity: "",
      day: "tomorrow",
      date: "d1",
      win: "w2",
      pay: "mpesa",
      mpesa: "",
      cardNo: "",
      cardExp: "",
      cardCvc: "",
      billingSame: true,
      billAddr: "",
      terms: false,
      termsError: "",
    };
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var set = function (k, fn) {
      return function (e) {
        var o = {};
        o[k] = fn ? fn(e.target.value) : e.target.value;
        self.setState(o);
      };
    };

    // Completion
    var contactDone = !!(s.name && s.name.trim().length > 1 && digits(s.phone, 15).length >= 9 && /.+@.+\..+/.test(s.email || ""));
    var isNew = s.addr === "new";
    var addrDone = !isNew || !!(s.newLine && s.newLine.trim() && s.newCity && s.newCity.trim());
    var isToday = s.day === "today";
    var slotDone = !!s.win && !(isToday && s.win === "w1");
    var payValid =
      s.pay === "cod" ||
      (s.pay === "mpesa" && digits(s.mpesa, 15).length >= 9) ||
      (s.pay === "card" && digits(s.cardNo, 19).length >= 15 && digits(s.cardExp, 4).length === 4 && digits(s.cardCvc, 4).length >= 3);
    var billingOk = s.billingSame || !!(s.billAddr && s.billAddr.trim());
    var detailsDone = contactDone;
    var deliveryDone = addrDone && slotDone;
    var paymentDone = payValid && billingOk && !!s.terms;

    var flags = [detailsDone, deliveryDone, paymentDone];
    var current = flags.indexOf(false);
    var steps = ["Details", "Delivery", "Payment"].map(function (label, i) {
      var done = flags[i];
      var isCur = i === current;
      return {
        n: i + 1,
        label: label,
        done: done,
        notDone: !done,
        notFirst: i > 0,
        aria: isCur ? "step" : "false",
        status: done ? "Complete" : isCur ? "In progress" : "Up next",
        ring: done ? GREEN : isCur ? BLUE : "#D5D3CC",
        bg: done ? GREEN : isCur ? BLUE : "#FFFFFF",
        fg: done || isCur ? "#FFFFFF" : "#5E6470",
        labelFg: done || isCur ? "#111318" : "#5E6470",
        lineBg: flags[i - 1] ? GREEN : "#D5D3CC",
      };
    });

    var badge = function (ok) {
      return ok ? GREEN : BLUE;
    };
    var statusFg = function (ok) {
      return ok ? GREEN : "#5E6470";
    };

    var addresses = ADDRS.map(function (a) {
      var on = s.addr === a.id;
      return Object.assign({}, a, {
        aria: on ? "true" : "false",
        border: on ? BLUE : "#EFEDE8",
        bg: on ? "#EAF3FA" : "#FFFFFF",
        ring: on ? BLUE : GREY,
        dot: on ? BLUE : "transparent",
        pick: function () {
          self.setState({ addr: a.id });
        },
      });
    });

    var days = DAYS.map(function (d) {
      var on = s.day === d.id;
      return Object.assign({}, d, {
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? BLUE : "#3A3F4A",
        subFg: "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        pick: function () {
          var o = { day: d.id };
          if (d.id === "today" && self.state.win === "w1") o.win = "w2";
          self.setState(o);
        },
      });
    });
    var dates = DATES.map(function (d) {
      var on = s.date === d.id;
      return Object.assign({}, d, {
        aria: on ? "true" : "false",
        border: on ? BLUE : "#EFEDE8",
        bg: on ? "#EAF3FA" : "#FFFFFF",
        pick: function () {
          self.setState({ date: d.id });
        },
      });
    });
    var windows = WINDOWS.map(function (w) {
      var full = isToday && w.id === "w1";
      var on = s.win === w.id && !full;
      return Object.assign({}, w, {
        aria: on ? "true" : "false",
        ariaDis: full ? "true" : "false",
        border: on ? BLUE : "#EFEDE8",
        bg: full ? "#F6F5F1" : on ? "#EAF3FA" : "#FFFFFF",
        fg: full ? "#5E6470" : "#111318",
        cursor: full ? "not-allowed" : "pointer",
        note: full ? "Unavailable" : isToday ? "Same-day " + fmt(SAME_DAY_FEE) : "Free",
        noteFg: full ? "#5E6470" : isToday ? "#B4431C" : GREEN,
        pick: function () {
          if (!full) self.setState({ win: w.id });
        },
      });
    });
    var dayLabel =
      s.day === "date"
        ? (function () {
            var d =
              DATES.filter(function (x) {
                return x.id === s.date;
              })[0] || DATES[0];
            return d.dow + " " + d.day;
          })()
        : (
            DAYS.filter(function (x) {
              return x.id === s.day;
            })[0] || DAYS[1]
          ).sub;
    var winLabel = (
      WINDOWS.filter(function (x) {
        return x.id === s.win;
      })[0] || WINDOWS[1]
    ).label;
    var fee = isToday ? SAME_DAY_FEE : 0;
    var total = PURCHASES + RENTALS + fee;

    var payOpts = PAYS.map(function (p) {
      var on = s.pay === p.id;
      return Object.assign({}, p, {
        aria: on ? "true" : "false",
        border: on ? BLUE : "#EFEDE8",
        bg: on ? "#EAF3FA" : "#FFFFFF",
        ring: on ? BLUE : GREY,
        dot: on ? BLUE : "transparent",
        pick: function () {
          self.setState({ pay: p.id });
        },
      });
    });

    var lines = LINES.map(function (l) {
      return Object.assign({}, l, { priceFmt: fmt(l.price), badgeBg: l.rent ? GREEN : BLUE, metaFg: l.rent ? GREEN : "#5E6470" });
    });

    var terms = !!s.terms;
    return {
      steps: steps,
      name: s.name || "",
      phone: s.phone || "",
      email: s.email || "",
      onName: set("name"),
      onPhone: set("phone"),
      onEmail: set("email"),
      contactBadgeBg: badge(contactDone),
      contactStatus: contactDone ? "Complete" : "Required",
      contactStatusFg: statusFg(contactDone),
      addresses: addresses,
      isNew: isNew,
      newAria: isNew ? "true" : "false",
      newBorder: isNew ? BLUE : "#D5D3CC",
      newBg: isNew ? "#EAF3FA" : "#FFFFFF",
      pickNew: function () {
        self.setState({ addr: "new" });
      },
      newLine: s.newLine || "",
      newArea: s.newArea || "",
      newCity: s.newCity || "",
      onNewLine: set("newLine"),
      onNewArea: set("newArea"),
      onNewCity: set("newCity"),
      addrBadgeBg: badge(addrDone),
      addrStatus: addrDone ? (isNew ? "New address" : "Saved address") : "Add street and city",
      addrStatusFg: statusFg(addrDone),
      days: days,
      dates: dates,
      windows: windows,
      isPickDate: s.day === "date",
      slotBadgeBg: badge(slotDone),
      slotStatus: slotDone ? dayLabel + ", " + winLabel : "Choose a window",
      slotStatusFg: statusFg(slotDone),
      slotNote: isToday
        ? "Same-day delivery for orders placed before [TIME]. A " + fmt(SAME_DAY_FEE) + " fee applies."
        : "Free delivery: your purchases are over the ETB 100,000 free-delivery threshold.",
      slotShort: dayLabel + " · " + winLabel,
      feeFmt: fee ? fmt(fee) : "Free",
      feeColor: fee ? "#111318" : GREEN,
      payOpts: payOpts,
      payMpesa: s.pay === "mpesa",
      payCard: s.pay === "card",
      payCod: s.pay === "cod",
      mpesa: s.mpesa || "",
      onMpesa: set("mpesa"),
      cardNo: s.cardNo || "",
      cardExp: s.cardExp || "",
      cardCvc: s.cardCvc || "",
      onCardNo: set("cardNo", function (v) {
        return digits(v, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
      }),
      onExp: set("cardExp", function (v) {
        var d = digits(v, 4);
        return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
      }),
      onCvc: set("cardCvc", function (v) {
        return digits(v, 4);
      }),
      payBadgeBg: badge(payValid),
      payStatus: payValid ? "Ready" : "Required",
      payStatusFg: statusFg(payValid),
      billingSame: !!s.billingSame,
      billingDiff: !s.billingSame,
      toggleBilling: function () {
        self.setState({ billingSame: !self.state.billingSame });
      },
      billAddr: s.billAddr || "",
      onBill: set("billAddr"),
      terms: terms,
      toggleTerms: function () {
        self.setState({ terms: !self.state.terms, termsError: "" });
      },
      termsError: s.termsError || "",
      termsFg: s.termsError ? "#C42A1C" : "#111318",
      lines: lines,
      totalFmt: fmt(total),
      placeDisabled: terms ? "false" : "true",
      placeClass: terms ? "btn-y" : "btn-off",
      placeBg: terms ? GREEN : "#D5D8DD",
      placeFg: terms ? "#FFFFFF" : "#3A3F4A",
      placeCursor: terms ? "pointer" : "not-allowed",
      placeHint: terms ? "You will not be charged until you confirm on your phone or card." : "Tick the terms box to place your order.",
      placeHintFg: terms ? "#5E6470" : "#3A3F4A",
      placeOrder: function (e) {
        if (!self.state.terms) {
          if (e && e.preventDefault) e.preventDefault();
          self.setState({ termsError: "Please accept the terms to place your order." });
        }
      },
    };
  }
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-off:hover{background:#C9CDD3;color:#3A3F4A}\n.ghost:hover{background:#F1F0EC}\n.opt:hover{border-color:#1679BE}\ninput[type=checkbox]{accent-color:#2F7A3C;width:20px;height:20px;margin:0;cursor:pointer}\ninput:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid #1679BE;outline-offset:2px}\n";

export default class CheckoutScreen extends Component {
  render() {
    const vals = this.renderVals();
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "#F6F5F1",
            color: "#111318",
            overflow: "hidden",
          }}
        >
          <header
            style={{
              height: "92px",
              flexShrink: "0",
              boxSizing: "border-box",
              padding: "0 var(--gutter)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              background: "#FFFFFF",
              borderBottom: "1px solid #EFEDE8",
            }}
            data-sec="minimal-header"
          >
            <Link
              href="/"
              aria-label="Simbatech home"
              style={{ display: "flex", alignItems: "center", flexShrink: "0", width: "300px" }}
              data-w
            >
              <img src="/images/logo.png" alt="Simbatech" style={{ height: "54px", width: "auto", display: "block" }} />
            </Link>
            <ol
              aria-label="Checkout progress"
              style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", alignItems: "center", gap: "14px" }}
            >
              {(vals.steps || []).map((st, i0) => (
                <Fragment key={i0}>
                  <li aria-current={st.aria} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {st.notFirst ? (
                      <>
                        <span aria-hidden="true" style={{ width: "48px", height: "2px", borderRadius: "999px", background: st.lineBg }} />
                      </>
                    ) : null}
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          boxSizing: "border-box",
                          borderRadius: "999px",
                          border: `2px solid ${st.ring}`,
                          background: st.bg,
                          color: st.fg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        {st.done ? (
                          <>
                            <svg
                              width="16"
                              height="16"
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
                          </>
                        ) : null}
                        {st.notDone ? <>{st.n}</> : null}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: st.labelFg }} suppressHydrationWarning>
                          {st.label}
                        </span>
                        <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                          {st.status}
                        </span>
                      </span>
                    </span>
                  </li>
                </Fragment>
              ))}
            </ol>
            <div
              style={{ width: "300px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px", flexShrink: "0" }}
              data-w
            >
              <span
                style={{
                  height: "36px",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "999px",
                  background: "#E4F2E6",
                  color: "#2F7A3C",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Secure checkout
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25", fontSize: "12px", color: "#5E6470" }}>
                Need help?
                <a href="#" style={{ fontSize: "14px", fontWeight: "700", color: "#0D4F8B" }}>
                  [PHONE]
                </a>
              </span>
            </div>
          </header>
          <main style={{ padding: "40px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Almost there
                </span>
                <h1
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "48px",
                    lineHeight: "1",
                    fontWeight: "700",
                    letterSpacing: "-0.045em",
                  }}
                >
                  Checkout
                </h1>
              </div>
              <Link
                href="/cart"
                style={{
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#0D4F8B",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Back to cart
              </Link>
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "24px", alignItems: "start" }}
              data-cols="12"
            >
              <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: "20px" }} data-span="8">
                <section
                  aria-labelledby="h-contact"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EFEDE8",
                    borderRadius: "28px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                  data-sec="contact"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "999px",
                          background: vals.contactBadgeBg,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        1
                      </span>
                      <h2
                        id="h-contact"
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "24px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        Contact
                      </h2>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: vals.contactStatusFg }} suppressHydrationWarning>
                      {vals.contactStatus}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px" }} data-cols="3">
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label htmlFor="f-name" style={{ fontSize: "14px", fontWeight: "600" }}>
                        Full name
                      </label>
                      <input
                        id="f-name"
                        type="text"
                        autoComplete="name"
                        value={vals.name}
                        onChange={vals.onName}
                        placeholder="First and last name"
                        style={{
                          height: "52px",
                          boxSizing: "border-box",
                          padding: "0 16px",
                          border: "1.5px solid #E6E4DE",
                          borderRadius: "12px",
                          background: "#FFFFFF",
                          font: "inherit",
                          fontSize: "15px",
                          color: "#111318",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label htmlFor="f-phone" style={{ fontSize: "14px", fontWeight: "600" }}>
                        Phone
                      </label>
                      <input
                        id="f-phone"
                        type="tel"
                        autoComplete="tel"
                        value={vals.phone}
                        onChange={vals.onPhone}
                        placeholder="09XX XXX XXX"
                        style={{
                          height: "52px",
                          boxSizing: "border-box",
                          padding: "0 16px",
                          border: "1.5px solid #E6E4DE",
                          borderRadius: "12px",
                          background: "#FFFFFF",
                          font: "inherit",
                          fontSize: "15px",
                          color: "#111318",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label htmlFor="f-email" style={{ fontSize: "14px", fontWeight: "600" }}>
                        Email
                      </label>
                      <input
                        id="f-email"
                        type="email"
                        autoComplete="email"
                        value={vals.email}
                        onChange={vals.onEmail}
                        placeholder="you@example.com"
                        style={{
                          height: "52px",
                          boxSizing: "border-box",
                          padding: "0 16px",
                          border: "1.5px solid #E6E4DE",
                          borderRadius: "12px",
                          background: "#FFFFFF",
                          font: "inherit",
                          fontSize: "15px",
                          color: "#111318",
                        }}
                      />
                    </div>
                  </div>
                </section>
                <section
                  aria-labelledby="h-addr"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EFEDE8",
                    borderRadius: "28px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                  data-sec="delivery-address"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "999px",
                          background: vals.addrBadgeBg,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        2
                      </span>
                      <h2
                        id="h-addr"
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "24px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        Delivery address
                      </h2>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: vals.addrStatusFg }} suppressHydrationWarning>
                      {vals.addrStatus}
                    </span>
                  </div>
                  <div
                    role="radiogroup"
                    aria-labelledby="h-addr"
                    style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" }}
                    data-cols="3"
                  >
                    {(vals.addresses || []).map((a, i0) => (
                      <Fragment key={i0}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={a.aria}
                          onClick={a.pick}
                          className="opt"
                          style={{
                            boxSizing: "border-box",
                            minHeight: "124px",
                            padding: "18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            textAlign: "left",
                            border: `2px solid ${a.border}`,
                            borderRadius: "20px",
                            background: a.bg,
                            color: "#111318",
                            font: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <span
                              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "700" }}
                              suppressHydrationWarning
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0D4F8B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                                <circle cx="12" cy="9.5" r="2.5" />
                              </svg>
                              {a.label}
                            </span>
                            <span
                              style={{
                                width: "20px",
                                height: "20px",
                                boxSizing: "border-box",
                                borderRadius: "999px",
                                border: `2px solid ${a.ring}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: a.dot }} />
                            </span>
                          </span>
                          <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#3A3F4A" }} suppressHydrationWarning>
                            {a.line1}
                          </span>
                          <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                            {a.line2}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={vals.newAria}
                      onClick={vals.pickNew}
                      className="opt"
                      style={{
                        boxSizing: "border-box",
                        minHeight: "124px",
                        padding: "18px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        border: `2px dashed ${vals.newBorder}`,
                        borderRadius: "20px",
                        background: vals.newBg,
                        color: "#0D4F8B",
                        font: "inherit",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "999px",
                          background: "#EAF3FA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                      Add new address
                    </button>
                  </div>
                  {vals.isNew ? (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                          gap: "16px",
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F6F5F1",
                        }}
                        data-cols="3"
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label htmlFor="n-line" style={{ fontSize: "14px", fontWeight: "600" }}>
                            Street, building, house no.
                          </label>
                          <input
                            id="n-line"
                            type="text"
                            autoComplete="address-line1"
                            value={vals.newLine}
                            onChange={vals.onNewLine}
                            placeholder="e.g. [BUILDING], [STREET]"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label htmlFor="n-area" style={{ fontSize: "14px", fontWeight: "600" }}>
                            Area or estate
                          </label>
                          <input
                            id="n-area"
                            type="text"
                            autoComplete="address-level3"
                            value={vals.newArea}
                            onChange={vals.onNewArea}
                            placeholder="[AREA]"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label htmlFor="n-city" style={{ fontSize: "14px", fontWeight: "600" }}>
                            Town or city
                          </label>
                          <input
                            id="n-city"
                            type="text"
                            autoComplete="address-level2"
                            value={vals.newCity}
                            onChange={vals.onNewCity}
                            placeholder="[CITY]"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </section>
                <section
                  aria-labelledby="h-slot"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EFEDE8",
                    borderRadius: "28px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                  data-sec="delivery-slot"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "999px",
                          background: vals.slotBadgeBg,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        3
                      </span>
                      <h2
                        id="h-slot"
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "24px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {"Delivery slot "}
                        <span
                          style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: "15px",
                            fontWeight: "500",
                            letterSpacing: "0",
                            color: "#5E6470",
                          }}
                        >
                          for your purchases
                        </span>
                      </h2>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: vals.slotStatusFg }} suppressHydrationWarning>
                      {vals.slotStatus}
                    </span>
                  </div>
                  <div
                    role="radiogroup"
                    aria-label="Delivery day"
                    style={{
                      display: "flex",
                      gap: "6px",
                      padding: "4px",
                      background: "#F3F2EE",
                      borderRadius: "14px",
                      alignSelf: "flex-start",
                    }}
                  >
                    {(vals.days || []).map((d, i0) => (
                      <Fragment key={i0}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={d.aria}
                          onClick={d.pick}
                          style={{
                            height: "44px",
                            padding: "0 20px",
                            border: "none",
                            borderRadius: "11px",
                            background: d.bg,
                            color: d.fg,
                            font: "inherit",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: d.shadow,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                          suppressHydrationWarning
                        >
                          {d.label}
                          <span style={{ fontSize: "12px", fontWeight: "500", color: d.subFg }} suppressHydrationWarning>
                            {d.sub}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {vals.isPickDate ? (
                    <>
                      <div
                        role="radiogroup"
                        aria-label="Choose a date"
                        style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px" }}
                        data-cols="5"
                      >
                        {(vals.dates || []).map((dt, i0) => (
                          <Fragment key={i0}>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={dt.aria}
                              onClick={dt.pick}
                              className="opt"
                              style={{
                                height: "68px",
                                border: `2px solid ${dt.border}`,
                                borderRadius: "16px",
                                background: dt.bg,
                                color: "#111318",
                                font: "inherit",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "2px",
                              }}
                            >
                              <span style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }} suppressHydrationWarning>
                                {dt.dow}
                              </span>
                              <span style={{ fontSize: "17px", fontWeight: "700" }} suppressHydrationWarning>
                                {dt.day}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  <div
                    role="radiogroup"
                    aria-label="Time window"
                    style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}
                    data-cols="4"
                  >
                    {(vals.windows || []).map((w, i0) => (
                      <Fragment key={i0}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={w.aria}
                          aria-disabled={w.ariaDis}
                          onClick={w.pick}
                          className="opt"
                          style={{
                            height: "72px",
                            border: `2px solid ${w.border}`,
                            borderRadius: "16px",
                            background: w.bg,
                            color: w.fg,
                            font: "inherit",
                            cursor: w.cursor,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "3px",
                          }}
                        >
                          <span style={{ fontSize: "15px", fontWeight: "700" }} suppressHydrationWarning>
                            {w.label}
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: w.noteFg }} suppressHydrationWarning>
                            {w.note}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <p style={{ margin: "0", fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                    {vals.slotNote}
                  </p>
                </section>
                <section
                  aria-labelledby="h-rent"
                  style={{ background: "#FFFFFF", border: "1px solid #EFEDE8", borderRadius: "28px", overflow: "hidden" }}
                  data-sec="rental-schedule"
                >
                  {" "}
                  <div
                    style={{
                      padding: "18px 28px",
                      background: "#E4F2E6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "999px",
                          background: "#2F7A3C",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        4
                      </span>
                      <h2
                        id="h-rent"
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "24px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                          color: "#1F5E33",
                        }}
                      >
                        Rental schedule
                      </h2>
                    </div>
                    <Link
                      href="/product"
                      style={{
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1F5E33",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      Change dates
                    </Link>
                  </div>{" "}
                  <div style={{ padding: "24px 28px", display: "flex", gap: "24px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "104px",
                        height: "104px",
                        flexShrink: "0",
                        borderRadius: "22px",
                        background: "#E0F1FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ zoom: "0.48", width: "200px", height: "200px" }}>
                        <Render kind={"camera"} />
                      </div>
                    </div>
                    <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "17px", fontWeight: "700" }}>Lumen Z6 Camera</span>
                        <span style={{ fontSize: "15px", fontWeight: "700" }}>
                          {"ETB 6,900 "}
                          <span style={{ fontWeight: "500", color: "#5E6470" }}>· 3 days</span>
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }} data-cols="2">
                        <div
                          style={{
                            padding: "14px 16px",
                            borderRadius: "16px",
                            background: "#F6F5F1",
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: "36px",
                              height: "36px",
                              flexShrink: "0",
                              borderRadius: "10px",
                              background: "#E4F2E6",
                              color: "#2F7A3C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                              <circle cx="7" cy="17.5" r="1.8" />
                              <circle cx="17" cy="17.5" r="1.8" />
                            </svg>
                          </span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>We deliver it</span>
                            <span style={{ fontSize: "15px", fontWeight: "700" }}>Sat 3 Oct 2026</span>
                            <span style={{ fontSize: "13px", color: "#3A3F4A" }}>9am – 12pm</span>
                          </span>
                        </div>
                        <div
                          style={{
                            padding: "14px 16px",
                            borderRadius: "16px",
                            background: "#F6F5F1",
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: "36px",
                              height: "36px",
                              flexShrink: "0",
                              borderRadius: "10px",
                              background: "#E4F2E6",
                              color: "#2F7A3C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                              <path d="M3 3v5h5" />
                            </svg>
                          </span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>We collect it</span>
                            <span style={{ fontSize: "15px", fontWeight: "700" }}>Tue 6 Oct 2026</span>
                            <span style={{ fontSize: "13px", color: "#3A3F4A" }}>3pm – 6pm</span>
                          </span>
                        </div>
                      </div>
                      <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "#3A3F4A" }}>
                        No need to bring it back — we collect it from the same address. Your ETB [X] deposit is refunded after the camera is
                        checked, within [N] days.
                      </p>
                    </div>
                  </div>{" "}
                </section>
                <section
                  aria-labelledby="h-pay"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EFEDE8",
                    borderRadius: "28px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                  data-sec="payment"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "999px",
                          background: vals.payBadgeBg,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        5
                      </span>
                      <h2
                        id="h-pay"
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "24px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        Payment method
                      </h2>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: vals.payStatusFg }} suppressHydrationWarning>
                      {vals.payStatus}
                    </span>
                  </div>
                  <div role="radiogroup" aria-labelledby="h-pay" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(vals.payOpts || []).map((po, i0) => (
                      <Fragment key={i0}>
                        <div style={{ border: `2px solid ${po.border}`, borderRadius: "20px", background: po.bg, overflow: "hidden" }}>
                          {" "}
                          <button
                            type="button"
                            role="radio"
                            aria-checked={po.aria}
                            onClick={po.pick}
                            style={{
                              width: "100%",
                              minHeight: "72px",
                              boxSizing: "border-box",
                              padding: "14px 18px",
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                              border: "none",
                              background: "transparent",
                              color: "#111318",
                              font: "inherit",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              style={{
                                width: "22px",
                                height: "22px",
                                flexShrink: "0",
                                boxSizing: "border-box",
                                borderRadius: "999px",
                                border: `2px solid ${po.ring}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: po.dot }} />
                            </span>
                            <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ fontSize: "16px", fontWeight: "700" }} suppressHydrationWarning>
                                {po.title}
                              </span>
                              <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                {po.sub}
                              </span>
                            </span>
                            <span
                              style={{
                                height: "30px",
                                padding: "0 12px",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "8px",
                                border: "1px solid #EFEDE8",
                                background: "#FFFFFF",
                                color: po.chipFg,
                                fontSize: "12px",
                                fontWeight: "800",
                                fontStyle: po.chipStyle,
                              }}
                              suppressHydrationWarning
                            >
                              {po.chip}
                            </span>
                          </button>{" "}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {vals.payMpesa ? (
                    <>
                      <div
                        style={{
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F6F5F1",
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: "16px",
                          alignItems: "end",
                        }}
                        data-cols="2"
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label htmlFor="p-mpesa" style={{ fontSize: "14px", fontWeight: "600" }}>
                            Telebirr phone number
                          </label>
                          <input
                            id="p-mpesa"
                            type="tel"
                            autoComplete="tel"
                            value={vals.mpesa}
                            onChange={vals.onMpesa}
                            placeholder="09XX XXX XXX"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            minHeight: "52px",
                            boxSizing: "border-box",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            background: "#E4F2E6",
                            color: "#1F5E33",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "13px",
                            lineHeight: "1.4",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            style={{ flexShrink: "0" }}
                          >
                            <rect x="6" y="2" width="12" height="20" rx="3" />
                            <path d="M11 18h2" />
                          </svg>
                          <span>
                            <strong>{"You'll get a prompt on your phone."}</strong>
                            {" Enter your Telebirr PIN to pay."}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {vals.payCard ? (
                    <>
                      <div
                        style={{
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F6F5F1",
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: "16px",
                        }}
                        data-cols="4"
                      >
                        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "8px" }} data-span="2">
                          <label htmlFor="p-card" style={{ fontSize: "14px", fontWeight: "600" }}>
                            Card number
                          </label>
                          <input
                            id="p-card"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={vals.cardNo}
                            onChange={vals.onCardNo}
                            placeholder="1234 5678 9012 3456"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label htmlFor="p-exp" style={{ fontSize: "14px", fontWeight: "600" }}>
                            Expiry
                          </label>
                          <input
                            id="p-exp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={vals.cardExp}
                            onChange={vals.onExp}
                            placeholder="MM / YY"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label htmlFor="p-cvc" style={{ fontSize: "14px", fontWeight: "600" }}>
                            CVC
                          </label>
                          <input
                            id="p-cvc"
                            type="password"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={vals.cardCvc}
                            onChange={vals.onCvc}
                            placeholder="123"
                            style={{
                              height: "52px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1.5px solid #E6E4DE",
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            gridColumn: "span 4",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "13px",
                            color: "#5E6470",
                          }}
                          data-span="4"
                        >
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
                            <rect x="4" y="10" width="16" height="11" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                          </svg>
                          Card details are encrypted and handled by our payment provider, [PROVIDER].
                        </span>
                      </div>
                    </>
                  ) : null}
                  {vals.payCod ? (
                    <>
                      <div
                        style={{
                          padding: "16px 20px",
                          borderRadius: "20px",
                          background: "#F6F5F1",
                          fontSize: "14px",
                          lineHeight: "1.5",
                          color: "#3A3F4A",
                        }}
                      >
                        Pay by Telebirr or card when your purchases arrive. The rental and its ETB [X] deposit are paid when the camera is
                        delivered. [PAY ON DELIVERY TERMS]
                      </div>
                    </>
                  ) : null}
                </section>
                <section
                  aria-label="Billing and terms"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #EFEDE8",
                    borderRadius: "28px",
                    padding: "16px 28px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  data-sec="billing-terms"
                >
                  <label
                    style={{ minHeight: "52px", display: "flex", alignItems: "center", gap: "14px", fontSize: "15px", cursor: "pointer" }}
                  >
                    <input type="checkbox" checked={vals.billingSame} onChange={vals.toggleBilling} />
                    Billing address is the same as delivery
                  </label>
                  {vals.billingDiff ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "4px 0 12px 34px" }}>
                        <label htmlFor="b-addr" style={{ fontSize: "14px", fontWeight: "600" }}>
                          Billing address
                        </label>
                        <input
                          id="b-addr"
                          type="text"
                          autoComplete="billing street-address"
                          value={vals.billAddr}
                          onChange={vals.onBill}
                          placeholder="[ADDRESS], [CITY]"
                          style={{
                            height: "52px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1.5px solid #E6E4DE",
                            borderRadius: "12px",
                            background: "#FFFFFF",
                            font: "inherit",
                            fontSize: "15px",
                            color: "#111318",
                          }}
                        />
                      </div>
                    </>
                  ) : null}
                  <div style={{ height: "1px", background: "#EFEDE8" }} />
                  <label
                    id="terms-label"
                    style={{
                      minHeight: "60px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      fontSize: "15px",
                      lineHeight: "1.45",
                      cursor: "pointer",
                      color: vals.termsFg,
                    }}
                  >
                    <input type="checkbox" checked={vals.terms} onChange={vals.toggleTerms} aria-describedby="terms-err" />
                    <span>
                      {"I agree to the "}
                      <a href="#" style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline" }}>
                        Terms of sale
                      </a>
                      {" and "}
                      <a href="#" style={{ fontWeight: "600", color: "#2F7A3C", textDecoration: "underline" }}>
                        Rental terms
                      </a>
                      , and will have the camera ready for collection on Tue 6 Oct 2026.
                    </span>
                  </label>
                  <span
                    id="terms-err"
                    role="alert"
                    style={{ fontSize: "13px", fontWeight: "600", color: "#C42A1C", paddingLeft: "34px" }}
                    suppressHydrationWarning
                  >
                    {vals.termsError}
                  </span>
                </section>
              </div>
              <aside
                aria-label="Order summary"
                style={{
                  gridColumn: "span 4",
                  position: "sticky",
                  top: "24px",
                  background: "#FFFFFF",
                  border: "1px solid #EFEDE8",
                  borderRadius: "28px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  boxShadow: "0 24px 60px -32px rgba(13,79,139,0.35)",
                }}
                data-span="4"
                data-sec="summary"
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <h2
                    style={{
                      margin: "0",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "26px",
                      fontWeight: "700",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    Your order
                  </h2>
                  <Link
                    href="/cart"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0D4F8B",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Edit cart
                  </Link>
                </div>
                <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {(vals.lines || []).map((l, i0) => (
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
                            suppressHydrationWarning
                          >
                            {l.qty}
                          </span>
                        </span>
                        <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                          <span style={{ fontSize: "14px", fontWeight: "700" }} suppressHydrationWarning>
                            {l.name}
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: l.metaFg }} suppressHydrationWarning>
                            {l.meta}
                          </span>
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "700" }} suppressHydrationWarning>
                          {l.priceFmt}
                        </span>
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
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }}>Purchases</dt>
                    <dd style={{ margin: "0", fontWeight: "600" }}>ETB 104,500</dd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }}>Rentals · 3 days</dt>
                    <dd style={{ margin: "0", fontWeight: "600" }}>ETB 6,900</dd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                    <dt style={{ display: "flex", flexDirection: "column", color: "#3A3F4A" }}>
                      Delivery
                      <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                        {vals.slotShort}
                      </span>
                    </dt>
                    <dd style={{ margin: "0", fontWeight: "600", color: vals.feeColor }} suppressHydrationWarning>
                      {vals.feeFmt}
                    </dd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }}>Refundable deposit</dt>
                    <dd style={{ margin: "0", fontWeight: "600" }}>ETB [X]</dd>
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
                    <span style={{ fontSize: "12px", color: "#5E6470" }}>+ ETB [X] refundable deposit</span>
                  </span>
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "32px",
                      fontWeight: "700",
                      letterSpacing: "-0.035em",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.totalFmt}
                  </span>
                </div>
                <Link
                  href="/order-confirmed"
                  onClick={vals.placeOrder}
                  aria-disabled={vals.placeDisabled}
                  className={vals.placeClass}
                  style={{
                    minHeight: "60px",
                    boxSizing: "border-box",
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    borderRadius: "14px",
                    background: vals.placeBg,
                    color: vals.placeFg,
                    fontSize: "17px",
                    fontWeight: "700",
                    cursor: vals.placeCursor,
                  }}
                  suppressHydrationWarning
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  {"Place order · "}
                  {vals.totalFmt}
                </Link>
                <span style={{ textAlign: "center", fontSize: "13px", color: vals.placeHintFg }} suppressHydrationWarning>
                  {vals.placeHint}
                </span>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  <span
                    style={{
                      height: "30px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "8px",
                      border: "1px solid #EFEDE8",
                      background: "#FFFFFF",
                      color: "#1F9D55",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  >
                    TELEBIRR
                  </span>
                  <span
                    style={{
                      height: "30px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "8px",
                      border: "1px solid #EFEDE8",
                      background: "#FFFFFF",
                      color: "#1A1F71",
                      fontSize: "12px",
                      fontWeight: "800",
                      fontStyle: "italic",
                    }}
                  >
                    VISA
                  </span>
                  <span
                    role="img"
                    aria-label="Mastercard"
                    style={{
                      height: "30px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "8px",
                      border: "1px solid #EFEDE8",
                      background: "#FFFFFF",
                    }}
                  >
                    <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: "#EB001B" }} />
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        marginLeft: "-6px",
                        borderRadius: "999px",
                        background: "#F79E1B",
                        opacity: "0.9",
                      }}
                    />
                  </span>
                </div>
              </aside>
            </div>
          </main>
          <SiteFooter compact />
        </div>
      </>
    );
  }
}

"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";
import { shopState, connectShop, api } from "@/lib/client/store";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var DAY = 86400000;
var TZ = "Africa/Addis_Ababa"; // fixed zone so server and client render the same text
var TRACK = [
  { status: "PLACED", label: "Placed" },
  { status: "PACKED", label: "Packed" },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { status: "DELIVERED", label: "Delivered" },
];
var HEADINGS = [
  "Your purchases are being packed",
  "Your order is packed and ready to go",
  "Your order is out for delivery",
  "Your order has been delivered",
];
var METHOD = { telebirr: "TELEBIRR", card: "CARD", cod: "PAY ON DELIVERY" };
function fmt(n) {
  return (
    "ETB " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
function parts(iso, opts) {
  var out = {};
  new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: TZ }, opts)).formatToParts(new Date(iso)).forEach(function (p) {
    out[p.type] = p.value;
  });
  return out;
}
function ampm(p) {
  return (p.dayPeriod || "").toLowerCase().replace(/[\s.]/g, "");
}
// "Tue 6 Oct 2026"
function fmtDate(iso) {
  if (!iso) return "";
  var p = parts(iso, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  return p.weekday + " " + p.day + " " + p.month + " " + p.year;
}
// "Tue 6 Oct"
function fmtDay(iso) {
  if (!iso) return "";
  var p = parts(iso, { weekday: "short", day: "numeric", month: "short" });
  return p.weekday + " " + p.day + " " + p.month;
}
// "10:42am"
function fmtTime(iso) {
  var p = parts(iso, { hour: "numeric", minute: "2-digit", hour12: true });
  return p.hour + ":" + p.minute + ampm(p);
}
// "Tue 29 Sep, 10:42am"
function fmtStamp(iso) {
  return fmtDay(iso) + ", " + fmtTime(iso);
}
function firstName(n) {
  return (n || "").trim().split(/\s+/)[0] || "there";
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    var order = (props.initial && props.initial.order) || null;
    this.state = { order: order, copied: false, extra: {}, rates: {}, busy: null, error: null };
  }
  componentDidMount() {
    var self = this;
    this.unsubShop = connectShop(this);
    // Day rates for the "Extra days ETB X each" line (order items don't carry the product's rate).
    var order = this.state.order;
    if (
      order &&
      order.items.some(function (i) {
        return i.mode === "rent";
      })
    ) {
      api("GET", "/api/products?mode=rent")
        .then(function (res) {
          var rates = {};
          (res.items || []).forEach(function (p) {
            if (p.rent) rates[p.name] = p.rent;
          });
          self.setState({ rates: rates });
        })
        .catch(function () {});
    }
  }
  componentWillUnmount() {
    clearTimeout(this.copyT);
    this.unsubShop && this.unsubShop();
  }
  extendItem(item) {
    var self = this;
    if (this.state.busy) return;
    this.setState({ busy: item.id, error: null });
    api("POST", "/api/rentals/" + item.id + "/extend", { days: 1 })
      .then(function (res) {
        var charge = (res && res.charge) || 0;
        var o = self.state.order;
        var items = o.items.map(function (i) {
          if (i.id !== item.id) return i;
          return Object.assign({}, i, {
            rentEnd: i.rentEnd ? new Date(new Date(i.rentEnd).getTime() + DAY).toISOString() : i.rentEnd,
            rentDays: (i.rentDays || 0) + 1,
            extendedDays: (i.extendedDays || 0) + 1,
            extraCharge: (i.extraCharge || 0) + charge,
          });
        });
        var totals = Object.assign({}, o.totals, { rentals: o.totals.rentals + charge, total: o.totals.total + charge });
        var prev = self.state.extra[item.id] || { days: 0, charge: 0 };
        var extra = Object.assign({}, self.state.extra);
        extra[item.id] = { days: prev.days + 1, charge: prev.charge + charge };
        self.setState({ order: Object.assign({}, o, { items: items, totals: totals }), extra: extra, busy: null });
      })
      .catch(function (err) {
        self.setState({
          busy: null,
          error: { id: item.id, message: (err && err.message) || "Couldn't extend the rental. Please try again." },
        });
      });
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var shop = shopState(this.props.initial);
    var signedIn = !!shop.user;
    var o = s.order;
    var cancelled = o.status === "CANCELLED";
    var step = o.step || 0;
    var current = cancelled ? -1 : step + 1; // the step after the last one reached is "in progress"
    var eventAt = {};
    (o.events || []).forEach(function (e) {
      eventAt[e.status] = e.at;
    });
    var slotShort = o.deliveryDate ? fmtDay(o.deliveryDate) + (o.deliveryWindow ? ", " + o.deliveryWindow : "") : "";

    var track = TRACK.map(function (t, i) {
      var done = !cancelled && i <= step;
      var cur = i === current;
      var time = eventAt[t.status]
        ? fmtStamp(eventAt[t.status])
        : i === 1
          ? "Expected [TIME]"
          : i === 2
            ? slotShort || "To be scheduled"
            : o.deliveryDate
              ? fmtDay(o.deliveryDate)
              : "To be scheduled";
      return {
        label: t.label,
        time: time,
        done: done,
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
    var lastEvent = (o.events || [])[(o.events || []).length - 1];

    var rentItems = o.items.filter(function (i) {
      return i.mode === "rent";
    });
    var buyItems = o.items.filter(function (i) {
      return i.mode !== "rent";
    });
    var dayWord = function (n) {
      return n + (n === 1 ? " day" : " days");
    };

    var lines = o.items.map(function (l) {
      var rent = l.mode === "rent";
      var price = l.lineTotal + (rent ? l.extraCharge || 0 : 0);
      return {
        name: l.name,
        kind: l.kind,
        bg: l.bg,
        qty: l.qty,
        meta: rent ? "Rental · " + dayWord(l.rentDays || 0) : "Purchase · Qty " + l.qty,
        price: price,
        rent: rent,
        priceFmt: fmt(price),
        badgeBg: rent ? "#2F7A3C" : "#0D4F8B",
        metaFg: rent ? "#2F7A3C" : "#5E6470",
      };
    });

    var rentals = rentItems.map(function (i) {
      var price = i.lineTotal + (i.extraCharge || 0);
      var rate = s.rates[i.name] || (i.extendedDays ? Math.round((i.extraCharge || 0) / i.extendedDays) : 0);
      var err = s.error && s.error.id === i.id ? s.error.message : "";
      return {
        name: i.name,
        kind: i.kind,
        bg: i.bg,
        rentLine: dayWord(i.rentDays || 0) + " · " + fmt(price) + (i.deposit ? " · " + fmt(i.deposit) + " deposit" : ""),
        startLabel: o.fulfilment === "pickup" ? "Collected" : "Delivered",
        startDate: fmtDate(i.rentStart),
        returnDate: fmtDate(i.rentEnd),
        badge: i.rentalStatus === "returned" ? "Returned" : "We'll collect it",
        rateText: err ? err : rate ? "Extra days " + fmt(rate) + " each" : "Extra days at the daily rate",
        canExtend: signedIn && i.rentalStatus !== "returned" && !cancelled,
        extendLabel: s.busy === i.id ? "Extending…" : "Extend rental",
        busy: s.busy === i.id,
        extend: function () {
          self.extendItem(i);
        },
      };
    });

    var extraDays = 0;
    var extraCharge = 0;
    Object.keys(s.extra || {}).forEach(function (k) {
      extraDays += s.extra[k].days;
      extraCharge += s.extra[k].charge;
    });
    var payPhone = o.payment.phone || o.contact.phone;
    var itemNames = (buyItems.length ? buyItems : o.items)
      .map(function (i) {
        return i.name + (i.qty > 1 ? " ×" + i.qty : "");
      })
      .join(", ");
    var pickup = o.fulfilment === "pickup" || !o.address;

    return {
      firstName: firstName(o.contact.name),
      orderNo: o.number,
      email: o.contact.email,
      trackHref: signedIn ? "/account" : "#h-track",
      trackHeading: cancelled ? "This order was cancelled" : HEADINGS[Math.min(step, 3)],
      updated: lastEvent ? "Updated " + fmtTime(lastEvent.at) : "Updated [TIME]",
      track: track,
      lines: lines,
      slot: o.deliveryDate ? fmtDate(o.deliveryDate) + (o.deliveryWindow ? " · " + o.deliveryWindow : "") : "To be scheduled",
      isPickup: pickup,
      hasAddress: !pickup,
      addrLine: o.address ? o.address.line1 + ", " + o.address.area : "",
      addrCity: o.address ? o.address.city : "",
      itemNames: itemNames,
      contactNote: pickup
        ? "We'll call " + o.contact.phone + " when your order is ready to pick up."
        : "Our driver calls " + ((o.address && o.address.phone) || o.contact.phone) + " about 30 minutes before arriving.",
      hasRentals: rentals.length > 0,
      rentals: rentals,
      hasPurchases: o.totals.purchases > 0,
      purchasesFmt: fmt(o.totals.purchases),
      hasDiscount: o.totals.discount > 0,
      discountFmt: "−" + fmt(o.totals.discount),
      rentSumLabel: rentItems.length === 1 ? "Rental · " + dayWord(rentItems[0].rentDays || 0) : "Rentals · " + rentItems.length + " items",
      rentPriceFmt: fmt(o.totals.rentals),
      deliveryFree: o.totals.deliveryFee === 0,
      deliveryPaid: o.totals.deliveryFee > 0,
      deliveryFmt: fmt(o.totals.deliveryFee),
      hasDeposit: o.totals.deposit > 0,
      depositFmt: fmt(o.totals.deposit),
      depositNote: "+ " + fmt(o.totals.deposit) + " refundable deposit",
      payLabel: o.payment.status === "paid" ? "Paid with" : "Payment",
      payMethod:
        (METHOD[o.payment.method] || String(o.payment.method).toUpperCase()) +
        (o.payment.status === "paid" ? "" : " · " + o.payment.status),
      totalFmt: fmt(o.totals.total),
      extended: extraDays > 0,
      extraWord: dayWord(extraDays),
      extraFmt: fmt(extraCharge),
      extendedMid:
        o.payment.method === "telebirr"
          ? " added. We'll send an Telebirr prompt for "
          : o.payment.method === "card"
            ? " added. We'll charge your card "
            : " added. You'll pay the extra ",
      extendedTail: o.payment.method === "telebirr" ? " to " + payPhone + "." : o.payment.method === "card" ? "." : " when we collect it.",
      copyLabel: s.copied ? "Copied" : "Copy",
      copyOrder: function () {
        try {
          if (navigator.clipboard) navigator.clipboard.writeText(o.number);
        } catch (e) {}
        self.setState({ copied: true });
        clearTimeout(self.copyT);
        self.copyT = setTimeout(function () {
          self.setState({ copied: false });
        }, 1800);
      },
    };
  }
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.btn-o:hover{background:#EAF3FA;color:#0D4F8B}\n.ghost:hover{background:#F1F0EC}\ninput:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid #1679BE;outline-offset:2px}\n";

export default class ConfirmedScreen extends Component {
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
            background: "#FFFFFF",
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
              aria-label="Checkout progress, all steps complete"
              style={{
                margin: "0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  }}
                >
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
                </span>
                Details
              </li>
              <li aria-hidden="true" style={{ width: "48px", height: "2px", borderRadius: "999px", background: "#2F7A3C" }} />
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  }}
                >
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
                </span>
                Delivery
              </li>
              <li aria-hidden="true" style={{ width: "48px", height: "2px", borderRadius: "999px", background: "#2F7A3C" }} />
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  }}
                >
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
                </span>
                Payment
              </li>
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
          <section style={{ padding: "40px var(--gutter) 0" }} data-sec="success-block">
            {" "}
            <div
              style={{
                position: "relative",
                height: "360px",
                boxSizing: "border-box",
                borderRadius: "32px",
                background: "#E4F2E6",
                overflow: "hidden",
              }}
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  right: "90px",
                  top: "-60px",
                  width: "440px",
                  height: "440px",
                  borderRadius: "999px",
                  background: "#CFE8D3",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{ position: "absolute", right: "220px", bottom: "20px", zoom: "1.2", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"sofa"} />
              </div>{" "}
              <div
                style={{ position: "absolute", right: "60px", top: "30px", zoom: "1.05", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"camera"} />
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  right: "70px",
                  bottom: "0px",
                  zoom: "0.75",
                  width: "200px",
                  height: "200px",
                  transform: "rotate(-8deg)",
                }}
                data-abs="art"
              >
                <Render kind={"sneaker"} />
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  left: "56px",
                  top: "48px",
                  width: "700px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
                data-abs="text"
                data-w
              >
                <span
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "999px",
                    background: "#2F7A3C",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 0 10px rgba(47,122,60,0.15)",
                  }}
                >
                  <svg
                    width="36"
                    height="36"
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
                </span>
                <h1
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "52px",
                    lineHeight: "1",
                    fontWeight: "700",
                    letterSpacing: "-0.045em",
                    color: "#111318",
                  }}
                >
                  {"Thank you, " + vals.firstName + "! "}
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontWeight: "400",
                      letterSpacing: "-0.02em",
                      color: "#2F7A3C",
                    }}
                  >
                    Your order is confirmed.
                  </span>
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "15px", color: "#1F3B26" }}>
                  <span
                    style={{
                      height: "36px",
                      padding: "0 6px 0 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "10px",
                      background: "#FFFFFF",
                      fontWeight: "600",
                    }}
                  >
                    Order no.
                    <strong style={{ fontVariantNumeric: "tabular-nums" }}>{vals.orderNo}</strong>
                    <button
                      type="button"
                      onClick={vals.copyOrder}
                      aria-label="Copy order number"
                      style={{
                        height: "28px",
                        padding: "0 10px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#F3F2EE",
                        color: "#111318",
                        font: "inherit",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.copyLabel}
                    </button>
                  </span>
                  <span>
                    {"We sent a confirmation to "}
                    <strong>{vals.email}</strong>
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
                  <Link
                    href={vals.trackHref}
                    className="btn-t"
                    style={{
                      height: "52px",
                      padding: "0 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "14px",
                      background: "#0D4F8B",
                      color: "#FFFFFF",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  >
                    <svg
                      width="17"
                      height="17"
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
                    Track order
                  </Link>
                  <Link
                    href="/shop"
                    className="btn-o"
                    style={{
                      height: "52px",
                      boxSizing: "border-box",
                      padding: "0 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      border: "1.5px solid #0D4F8B",
                      borderRadius: "14px",
                      background: "#FFFFFF",
                      color: "#0D4F8B",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    Continue shopping
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
                  </Link>
                </div>
              </div>{" "}
            </div>{" "}
          </section>
          <section
            style={{
              padding: "24px var(--gutter) 0",
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: "24px",
              alignItems: "start",
            }}
            data-cols="12"
          >
            <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: "20px" }} data-span="8">
              <section
                aria-labelledby="h-track"
                style={{
                  border: "1px solid #EFEDE8",
                  borderRadius: "28px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
                data-sec="tracking-timeline"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span
                      style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                    >
                      Live tracking
                    </span>
                    <h2
                      id="h-track"
                      style={{
                        margin: "0",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "26px",
                        fontWeight: "700",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {vals.trackHeading}
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
                    {vals.updated}
                  </span>
                </div>
                <ol
                  style={{
                    margin: "0",
                    padding: "0",
                    listStyle: "none",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  }}
                  data-cols="4"
                >
                  {(vals.track || []).map((t, i0) => (
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
                              <>
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
                              </>
                            ) : null}
                            {t.notDone ? (
                              <>
                                <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: t.dotBg }} />
                              </>
                            ) : null}
                          </span>
                          {t.notLast ? (
                            <>
                              <span
                                aria-hidden="true"
                                style={{ flexGrow: "1", height: "3px", margin: "0 10px", borderRadius: "999px", background: t.lineBg }}
                              />
                            </>
                          ) : null}
                        </div>
                        <span style={{ display: "flex", flexDirection: "column", gap: "3px", paddingRight: "16px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700", color: t.labelFg }} suppressHydrationWarning>
                            {t.label}
                          </span>
                          <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                            {t.time}
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: t.stateFg }} suppressHydrationWarning>
                            {t.state}
                          </span>
                        </span>
                      </li>
                    </Fragment>
                  ))}
                </ol>
              </section>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "20px" }} data-cols="2">
                <section
                  aria-labelledby="h-dlv"
                  style={{
                    border: "1px solid #EFEDE8",
                    borderRadius: "28px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                  data-sec="delivery-card"
                >
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
                    <h2
                      id="h-dlv"
                      style={{
                        margin: "0",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "22px",
                        fontWeight: "700",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Delivery
                    </h2>
                  </div>
                  <dl style={{ margin: "0", display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <dt style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>Slot</dt>
                      <dd style={{ margin: "0", fontWeight: "700" }}>{vals.slot}</dd>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <dt style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>Address</dt>
                      <dd style={{ margin: "0", lineHeight: "1.45" }}>
                        {vals.hasAddress ? (
                          <>
                            {vals.addrLine}
                            <br />
                            {vals.addrCity}
                          </>
                        ) : (
                          "Pick up in store"
                        )}
                      </dd>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <dt style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>Items</dt>
                      <dd style={{ margin: "0" }}>{vals.itemNames}</dd>
                    </div>
                  </dl>
                  <p
                    style={{
                      margin: "0",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: "#F6F5F1",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      color: "#3A3F4A",
                    }}
                  >
                    {vals.contactNote}
                  </p>
                </section>
                {vals.hasRentals ? (
                  <>
                    <section
                      aria-labelledby="h-rental"
                      style={{
                        border: "1px solid #CFE8D3",
                        borderRadius: "28px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                        background: "#FFFFFF",
                      }}
                      data-sec="rental-card"
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "14px",
                              background: "#E4F2E6",
                              color: "#2F7A3C",
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
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <rect x="3" y="5" width="18" height="16" rx="2" />
                              <path d="M3 10h18M8 3v4M16 3v4" />
                            </svg>
                          </span>
                          <h2
                            id="h-rental"
                            style={{
                              margin: "0",
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "22px",
                              fontWeight: "700",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            Your rental
                          </h2>
                        </div>
                        <span
                          style={{
                            height: "26px",
                            padding: "0 10px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            background: "#E4F2E6",
                            color: "#2F7A3C",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {vals.rentals.length === 1 ? vals.rentals[0].badge : "We'll collect it"}
                        </span>
                      </div>
                      {vals.rentals.map((r, ri) => (
                        <Fragment key={ri}>
                          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <span
                              style={{
                                width: "64px",
                                height: "64px",
                                flexShrink: "0",
                                borderRadius: "16px",
                                background: r.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div style={{ zoom: "0.29", width: "200px", height: "200px" }}>
                                <Render kind={r.kind} />
                              </div>
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ fontSize: "16px", fontWeight: "700" }}>{r.name}</span>
                              <span
                                aria-live="polite"
                                style={{ fontSize: "14px", fontWeight: "600", color: "#2F7A3C" }}
                                suppressHydrationWarning
                              >
                                {r.rentLine}
                              </span>
                            </span>
                          </div>
                          <dl
                            style={{
                              margin: "0",
                              display: "grid",
                              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                              gap: "12px",
                              fontSize: "15px",
                            }}
                            data-cols="2"
                          >
                            <div
                              style={{
                                padding: "12px 14px",
                                borderRadius: "14px",
                                background: "#F6F5F1",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                              }}
                            >
                              <dt style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>{r.startLabel}</dt>
                              <dd style={{ margin: "0", fontWeight: "700" }}>{r.startDate}</dd>
                            </div>
                            <div
                              style={{
                                padding: "12px 14px",
                                borderRadius: "14px",
                                background: "#E4F2E6",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                              }}
                            >
                              <dt style={{ fontSize: "12px", fontWeight: "600", color: "#1F5E33" }}>Return date</dt>
                              <dd aria-live="polite" style={{ margin: "0", fontWeight: "700", color: "#1F5E33" }} suppressHydrationWarning>
                                {r.returnDate}
                              </dd>
                            </div>
                          </dl>
                          {r.canExtend ? (
                            <>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                <span style={{ fontSize: "13px", lineHeight: "1.4", color: "#5E6470" }} suppressHydrationWarning>
                                  {r.rateText}
                                </span>
                                <button
                                  type="button"
                                  onClick={r.extend}
                                  disabled={r.busy}
                                  className="btn-y"
                                  style={{
                                    height: "44px",
                                    padding: "0 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    border: "none",
                                    borderRadius: "12px",
                                    background: "#2F7A3C",
                                    color: "#FFFFFF",
                                    font: "inherit",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                  >
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                  {r.extendLabel}
                                </button>
                              </div>
                            </>
                          ) : null}
                        </Fragment>
                      ))}
                    </section>
                  </>
                ) : null}
              </div>
            </div>
            <aside
              aria-labelledby="h-sum"
              style={{
                gridColumn: "span 4",
                border: "1px solid #EFEDE8",
                borderRadius: "28px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                background: "#FFFFFF",
                boxShadow: "0 24px 60px -32px rgba(13,79,139,0.35)",
              }}
              data-span="4"
              data-sec="order-summary"
            >
              <h2
                id="h-sum"
                style={{
                  margin: "0",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "26px",
                  fontWeight: "700",
                  letterSpacing: "-0.035em",
                }}
              >
                Order summary
              </h2>
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
                {vals.hasPurchases ? (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }}>Purchases</dt>
                    <dd style={{ margin: "0", fontWeight: "600" }}>{vals.purchasesFmt}</dd>
                  </div>
                ) : null}
                {vals.hasDiscount ? (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }}>Discount</dt>
                    <dd style={{ margin: "0", fontWeight: "600", color: "#2F7A3C" }}>{vals.discountFmt}</dd>
                  </div>
                ) : null}
                {vals.hasRentals ? (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }} suppressHydrationWarning>
                      {vals.rentSumLabel}
                    </dt>
                    <dd style={{ margin: "0", fontWeight: "600" }} suppressHydrationWarning>
                      {vals.rentPriceFmt}
                    </dd>
                  </div>
                ) : null}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "#3A3F4A" }}>Delivery</dt>
                  {vals.deliveryFree ? <dd style={{ margin: "0", fontWeight: "600", color: "#2F7A3C" }}>Free</dd> : null}
                  {vals.deliveryPaid ? <dd style={{ margin: "0", fontWeight: "600" }}>{vals.deliveryFmt}</dd> : null}
                </div>
                {vals.hasDeposit ? (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "#3A3F4A" }}>Refundable deposit</dt>
                    <dd style={{ margin: "0", fontWeight: "600" }}>{vals.depositFmt}</dd>
                  </div>
                ) : null}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "#3A3F4A" }}>{vals.payLabel}</dt>
                  <dd style={{ margin: "0", fontWeight: "700", color: "#1F9D55" }}>{vals.payMethod}</dd>
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
                  {vals.hasDeposit ? <span style={{ fontSize: "12px", color: "#5E6470" }}>{vals.depositNote}</span> : null}
                </span>
                <span
                  aria-live="polite"
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
              {vals.extended ? (
                <>
                  <p
                    style={{
                      margin: "0",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: "#E4F2E6",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      color: "#1F5E33",
                    }}
                    suppressHydrationWarning
                  >
                    {"Extension of "}
                    {vals.extraWord}
                    {vals.extendedMid}
                    {vals.extraFmt}
                    {vals.extendedTail}
                  </p>
                </>
              ) : null}
            </aside>
          </section>
          <section style={{ padding: "96px var(--gutter) 0" }} data-sec="app-banner">
            {" "}
            <div
              style={{
                height: "320px",
                position: "relative",
                background: "#1679BE",
                color: "#FFFFFF",
                borderRadius: "32px",
                overflow: "hidden",
              }}
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  left: "56px",
                  top: "48px",
                  bottom: "48px",
                  width: "620px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                data-abs="text"
                data-w
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span
                    style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#D6E8F7" }}
                  >
                    Simbatech app
                  </span>
                  <h2
                    style={{
                      margin: "0",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "46px",
                      lineHeight: "0.98",
                      fontWeight: "700",
                      letterSpacing: "-0.045em",
                    }}
                  >
                    Track this order and extend rentals from your phone.
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a
                    href="#"
                    style={{
                      height: "54px",
                      padding: "0 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "14px",
                      background: "#111318",
                      color: "#FFFFFF",
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
                      <rect x="6" y="2" width="12" height="20" rx="3" />
                      <path d="M11 18h2" />
                    </svg>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.1" }}>
                      <span style={{ fontSize: "10px", color: "#BDBDC4" }}>Download on the</span>
                      <span style={{ fontSize: "15px", fontWeight: "700" }}>App Store</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    style={{
                      height: "54px",
                      padding: "0 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "14px",
                      background: "#111318",
                      color: "#FFFFFF",
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
                      <path d="M6 3l13 9-13 9z" />
                    </svg>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.1" }}>
                      <span style={{ fontSize: "10px", color: "#BDBDC4" }}>Get it on</span>
                      <span style={{ fontSize: "15px", fontWeight: "700" }}>Google Play</span>
                    </span>
                  </a>
                </div>
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  right: "90px",
                  top: "30px",
                  width: "280px",
                  height: "280px",
                  borderRadius: "999px",
                  background: "#3A8FD0",
                }}
                data-abs="deco"
              />{" "}
              <div
                style={{ position: "absolute", right: "100px", bottom: "-50px", zoom: "1.7", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"phone"} />
              </div>{" "}
            </div>{" "}
          </section>
          <SiteFooter />
        </div>
      </>
    );
  }
}

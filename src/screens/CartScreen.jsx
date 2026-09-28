"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var P = [
  { id: "p1", name: "Lumen Z6 Camera", cat: "Electronics", kind: "camera", bg: "#E0F1FF", buy: 139000, rent: 2500, rating: "4.8" },
  { id: "p2", name: "Pulse ANC Headphones", cat: "Electronics", kind: "headphones", bg: "#EEE8FF", buy: 18900, was: 23500, rating: "4.9" },
  { id: "p4", name: "Orbit Watch 2", cat: "Wearables", kind: "watch", bg: "#FFEADB", buy: 21500, was: 26900, rating: "4.6" },
  { id: "p5", name: "Linen 3-Seater Sofa", cat: "Home & Living", kind: "sofa", bg: "#F3EEE6", buy: 84900, rating: "4.7" },
  { id: "p6", name: "Barista Espresso Machine", cat: "Kitchen", kind: "espresso", bg: "#FFF4C7", buy: 38500, was: 45000, rating: "4.6" },
  { id: "p7", name: "Street Runner Sneakers", cat: "Fashion", kind: "sneaker", bg: "#FFE4EF", buy: 9800, was: 12400, rating: "4.5" },
  { id: "p8", name: "Glow Skincare Duo", cat: "Beauty", kind: "skincare", bg: "#D9F3F0", buy: 4600, rating: "4.8" },
];
var RECS = ["p2", "p4", "p6", "p8"];
// PLACEHOLDER: sample free-delivery threshold (KES 100,000 on purchases after discounts). Replace with the store's real rule.
var FREE_THRESHOLD = 100000;
// PLACEHOLDER: sample delivery fee below the threshold. Replace with the real fee table.
var DELIVERY_FEE = 500;
var PROMO_CODE = "SIMBA10";
function fmt(n) {
  return (
    "KES " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
function byId(id) {
  return P.filter(function (p) {
    return p.id === id;
  })[0];
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "buy",
      // Sample cart shared across Cart / Checkout / Confirmation. Rental price is the quoted 3-day price.
      rentals: [
        { id: "r1", name: "Lumen Z6 Camera", kind: "camera", bg: "#E0F1FF", days: 3, dates: "Sat 3 Oct – Tue 6 Oct 2026", price: 6900 },
      ],
      buys: [
        { id: "p5", qty: 1 },
        { id: "p7", qty: 2 },
      ],
      saved: [],
      delivery: "deliver",
      promoInput: "",
      promo: "",
      promoError: "",
      wished: {},
    };
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var rentalsS = s.rentals || [];
    var buysS = s.buys || [];
    var savedS = s.saved || [];
    var wished = s.wished || {};

    var mode = s.mode || "buy";
    var modes = [
      { id: "buy", label: "Buy" },
      { id: "rent", label: "Rent" },
    ].map(function (m) {
      var on = m.id === mode;
      return {
        label: m.label,
        aria: on ? "true" : "false",
        bg: on ? "#0D4F8B" : "transparent",
        fg: on ? "#FFFFFF" : "#0D4F8B",
        pick: function () {
          self.setState({ mode: m.id });
        },
      };
    });

    var setBuys = function (fn) {
      self.setState({ buys: fn((self.state.buys || []).slice()) });
    };

    var rentals = rentalsS.map(function (r) {
      return Object.assign({}, r, {
        priceFmt: fmt(r.price),
        remove: function () {
          self.setState({
            rentals: (self.state.rentals || []).filter(function (x) {
              return x.id !== r.id;
            }),
          });
        },
      });
    });

    var buyUnits = 0;
    var buySub = 0;
    var buys = buysS.map(function (b) {
      var p = byId(b.id);
      buyUnits += b.qty;
      buySub += p.buy * b.qty;
      return {
        name: p.name,
        cat: p.cat,
        kind: p.kind,
        bg: p.bg,
        qty: b.qty,
        unitFmt: fmt(p.buy),
        lineFmt: fmt(p.buy * b.qty),
        hasWas: !!p.was,
        wasFmt: p.was ? fmt(p.was) : "",
        unitColor: p.was ? "#C42A1C" : "#3A3F4A",
        decDisabled: b.qty <= 1,
        decColor: b.qty <= 1 ? "#B4B8BF" : "#111318",
        dec: function () {
          setBuys(function (l) {
            return l.map(function (x) {
              return x.id === b.id ? { id: x.id, qty: Math.max(1, x.qty - 1) } : x;
            });
          });
        },
        inc: function () {
          setBuys(function (l) {
            return l.map(function (x) {
              return x.id === b.id ? { id: x.id, qty: Math.min(9, x.qty + 1) } : x;
            });
          });
        },
        remove: function () {
          setBuys(function (l) {
            return l.filter(function (x) {
              return x.id !== b.id;
            });
          });
        },
        save: function () {
          var sv = (self.state.saved || [])
            .filter(function (x) {
              return x !== b.id;
            })
            .concat([b.id]);
          self.setState({
            saved: sv,
            buys: (self.state.buys || []).filter(function (x) {
              return x.id !== b.id;
            }),
          });
        },
      };
    });

    var saved = savedS.map(function (id) {
      var p = byId(id);
      return {
        name: p.name,
        kind: p.kind,
        bg: p.bg,
        unitFmt: fmt(p.buy),
        move: function () {
          var l = (self.state.buys || []).slice();
          if (
            !l.some(function (x) {
              return x.id === id;
            })
          )
            l.push({ id: id, qty: 1 });
          self.setState({
            buys: l,
            saved: (self.state.saved || []).filter(function (x) {
              return x !== id;
            }),
          });
        },
        drop: function () {
          self.setState({
            saved: (self.state.saved || []).filter(function (x) {
              return x !== id;
            }),
          });
        },
      };
    });

    var rentSub = rentalsS.reduce(function (a, r) {
      return a + r.price;
    }, 0);
    var promoOn = s.promo === PROMO_CODE && buySub > 0;
    var discount = promoOn ? Math.round(buySub * 0.1) : 0;
    var goods = buySub - discount;
    var away = Math.max(0, FREE_THRESHOLD - goods);
    var unlocked = buySub > 0 && away === 0;
    var pickup = s.delivery === "pickup";
    var fee = pickup || unlocked || buySub === 0 ? 0 : DELIVERY_FEE;
    var total = goods + rentSub + fee;
    var pct = Math.min(100, Math.round((goods / FREE_THRESHOLD) * 100));
    var lineCount = rentalsS.length + buysS.length;

    var deliveryOpts = [
      {
        id: "deliver",
        title: "Deliver to me",
        fee: unlocked || buySub === 0 ? "Free" : fmt(DELIVERY_FEE),
        line1: "To [ADDRESS], [CITY]. Pick a delivery slot at checkout.",
        line2: "Same-day available before [TIME]",
      },
      {
        id: "pickup",
        title: "Pick up in store",
        fee: "Free",
        line1: "Simbatech store, [ADDRESS], [CITY].",
        line2: "Ready in [N] hours · we will text you",
      },
    ].map(function (d) {
      var on = (s.delivery || "deliver") === d.id;
      return Object.assign({}, d, {
        aria: on ? "true" : "false",
        border: on ? "#0D4F8B" : "#EFEDE8",
        bg: on ? "#EAF3FA" : "#FFFFFF",
        ring: on ? "#0D4F8B" : "#B4B8BF",
        dot: on ? "#0D4F8B" : "transparent",
        feeColor: d.fee === "Free" ? "#2F7A3C" : "#111318",
        pick: function () {
          self.setState({ delivery: d.id });
        },
      });
    });

    var applyPromo = function () {
      var code = String(self.state.promoInput || "")
        .trim()
        .toUpperCase();
      if (!code) {
        self.setState({ promoError: "Enter a promo code first." });
        return;
      }
      if (code === PROMO_CODE) {
        self.setState({ promo: PROMO_CODE, promoError: "", promoInput: "" });
        return;
      }
      self.setState({ promoError: '"' + code + '" is not a valid code. Check the spelling and try again.' });
    };

    var recs = RECS.map(function (id) {
      var p = byId(id);
      var w = !!wished[id];
      var inCart = buysS.some(function (x) {
        return x.id === id;
      });
      var tag = p.was ? "Sale" : "Buy";
      return {
        name: p.name,
        cat: p.cat,
        kind: p.kind,
        bg: p.bg,
        rating: p.rating,
        tag: tag,
        tagBg: tag === "Sale" ? "#C42A1C" : "#FFFFFF",
        tagFg: tag === "Sale" ? "#FFFFFF" : "#111318",
        main: fmt(p.buy),
        sub: p.was ? "was " + fmt(p.was) : "Free delivery",
        cta: inCart ? "Added" : "Add",
        addBg: inCart ? "#2F7A3C" : "#0D4F8B",
        addLabel: (inCart ? "Add another: " : "Add to cart: ") + p.name,
        add: function () {
          var l = (self.state.buys || []).slice();
          var found = false;
          l = l.map(function (x) {
            if (x.id === id) {
              found = true;
              return { id: id, qty: Math.min(9, x.qty + 1) };
            }
            return x;
          });
          if (!found) l.push({ id: id, qty: 1 });
          self.setState({ buys: l });
        },
        heartFill: w ? "#E0522B" : "none",
        heartStroke: w ? "#E0522B" : "#111318",
        wishAria: w ? "true" : "false",
        wishLabel: (w ? "Remove from" : "Save to") + " wishlist: " + p.name,
        toggleWish: function () {
          var n = Object.assign({}, self.state.wished);
          n[id] = !n[id];
          self.setState({ wished: n });
        },
      };
    });

    var rentDays = rentalsS.reduce(function (a, r) {
      return a + r.days;
    }, 0);

    return {
      modes: modes,
      placeholder: mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      wishCount: Object.keys(wished).filter(function (k) {
        return wished[k];
      }).length,
      unitCount: buyUnits + rentalsS.length,
      headerTotal: fmt(total),
      lineCount: lineCount,
      isEmpty: lineCount === 0,
      hasItems: lineCount > 0,
      hasRentals: rentalsS.length > 0,
      hasBuys: buysS.length > 0,
      hasSaved: savedS.length > 0,
      savedCount: savedS.length,
      rentals: rentals,
      buys: buys,
      saved: saved,
      freeMsg: unlocked ? "You have unlocked free delivery" : "You’re " + fmt(away) + " away from free delivery",
      freeSub: "Free delivery on purchases over " + fmt(FREE_THRESHOLD),
      freePct: pct + "%",
      freePctNum: pct,
      freeBar: unlocked ? "#418D4D" : "#1679BE",
      freeIconBg: unlocked ? "#E4F2E6" : "#EAF3FA",
      freeIconFg: unlocked ? "#2F7A3C" : "#0D4F8B",
      deliveryOpts: deliveryOpts,
      deliveryNote: pickup
        ? "Rentals picked up in store go back to the same store by [TIME] on the return date."
        : "Rentals are always delivered and collected by us, whatever you choose for purchases.",
      buyUnits: buyUnits,
      buySubFmt: fmt(buySub),
      promoOn: promoOn,
      promoOff: !promoOn,
      discountFmt: "−" + fmt(discount),
      rentLabel: rentalsS.length + (rentalsS.length === 1 ? " item" : " items") + " · " + rentDays + " days",
      rentSubFmt: fmt(rentSub),
      feeFmt: fee === 0 ? "Free" : fmt(fee),
      feeColor: fee === 0 ? "#2F7A3C" : "#111318",
      totalFmt: fmt(total),
      promoInput: s.promoInput || "",
      promoError: s.promoError || "",
      promoInvalid: s.promoError ? "true" : "false",
      promoBorder: s.promoError ? "#C42A1C" : "#E6E4DE",
      onPromo: function (e) {
        self.setState({ promoInput: e.target.value, promoError: "" });
      },
      onPromoKey: function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          applyPromo();
        }
      },
      applyPromo: applyPromo,
      removePromo: function () {
        self.setState({ promo: "" });
      },
      recs: recs,
    };
  }
}

function preventSubmit(e) {
  e.preventDefault();
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.lift{transition:transform .2s ease, box-shadow .2s ease}\n.lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(13,79,139,.3)}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.ghost:hover{background:#F1F0EC}\n.nav a:hover{color:#0D4F8B}\ninput:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid #1679BE;outline-offset:2px}\n@media (prefers-reduced-motion: reduce){.lift{transition:none}}\n";

export default class CartScreen extends Component {
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
          <div
            style={{
              height: "40px",
              flexShrink: "0",
              boxSizing: "border-box",
              padding: "0 var(--gutter)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#0D4F8B",
              color: "#E6F0F9",
              fontSize: "13px",
            }}
            data-sec="utility-bar"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <button
                type="button"
                style={{
                  height: "28px",
                  padding: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "8px",
                  background: "transparent",
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
                <strong>[CITY]</strong>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8FD19A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                  <circle cx="7" cy="17.5" r="1.8" />
                  <circle cx="17" cy="17.5" r="1.8" />
                </svg>
                Free delivery on orders over KES [X]
              </span>
            </div>
            <nav aria-label="Utility" className="nav" style={{ display: "flex", gap: "24px" }}>
              <a href="#" style={{ color: "#E6F0F9" }}>
                Sell or list with us
              </a>
              <Link href="/account" style={{ color: "#E6F0F9" }}>
                Track order
              </Link>
              <a href="#" style={{ color: "#E6F0F9" }}>
                Help
              </a>
              <a href="#" style={{ color: "#E6F0F9" }}>
                English
              </a>
            </nav>
          </div>
          <header
            style={{
              height: "92px",
              flexShrink: "0",
              boxSizing: "border-box",
              padding: "0 var(--gutter)",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
            data-sec="header"
          >
            <Link href="/" aria-label="Simbatech home" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}>
              <img src="/images/logo.png" alt="Simbatech" style={{ height: "54px", width: "auto", display: "block" }} />
            </Link>
            <Link
              href="/shop"
              className="ghost"
              style={{
                height: "52px",
                boxSizing: "border-box",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #E6E4DE",
                borderRadius: "16px",
                background: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600",
                color: "#111318",
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
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            <form
              role="search"
              style={{
                flexGrow: "1",
                height: "52px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px",
                boxSizing: "border-box",
                border: "1.5px solid #0D4F8B",
                borderRadius: "16px",
                background: "#FFFFFF",
              }}
              onSubmit={preventSubmit}
            >
              <div
                role="group"
                aria-label="Buy or rent"
                style={{ display: "flex", gap: "2px", padding: "3px", background: "#EAF3FA", borderRadius: "12px", flexShrink: "0" }}
              >
                {(vals.modes || []).map((m, i0) => (
                  <Fragment key={i0}>
                    <button
                      type="button"
                      onClick={m.pick}
                      aria-pressed={m.aria}
                      style={{
                        height: "30px",
                        padding: "0 14px",
                        border: "none",
                        borderRadius: "9px",
                        background: m.bg,
                        color: m.fg,
                        font: "inherit",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      suppressHydrationWarning
                    >
                      {m.label}
                    </button>
                  </Fragment>
                ))}
              </div>
              <label htmlFor="c-search" className="sr-only">
                Search Simbatech
              </label>
              <input
                id="c-search"
                type="search"
                placeholder={vals.placeholder}
                style={{
                  flexGrow: "1",
                  minWidth: "0",
                  height: "40px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  font: "inherit",
                  fontSize: "15px",
                  color: "#111318",
                  padding: "0 8px",
                }}
              />
              <button
                type="submit"
                className="btn-y"
                aria-label="Search"
                style={{
                  height: "40px",
                  padding: "0 20px",
                  border: "none",
                  borderRadius: "11px",
                  background: "#2F7A3C",
                  color: "#FFFFFF",
                  font: "inherit",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>
                Search
              </button>
            </form>
            <Link href="/account" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0", height: "52px" }}>
              <span
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "999px",
                  background: "#F3F2EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                </svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
                <span style={{ fontSize: "12px", color: "#5E6470" }}>Hello, sign in</span>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>Account</span>
              </span>
            </Link>
            <Link
              href="/account"
              aria-label={`Wishlist, ${vals.wishCount} saved`}
              style={{
                position: "relative",
                width: "44px",
                height: "44px",
                flexShrink: "0",
                borderRadius: "999px",
                background: "#F3F2EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  minWidth: "18px",
                  height: "18px",
                  padding: "0 4px",
                  boxSizing: "border-box",
                  borderRadius: "999px",
                  background: "#0D4F8B",
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
                {vals.wishCount}
              </span>
            </Link>
            <Link
              href="/cart"
              aria-current="page"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: "0",
                height: "52px",
                padding: "0 16px 0 6px",
                borderRadius: "16px",
                background: "#0D4F8B",
                color: "#FFFFFF",
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "#1A62A8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 8h14l-1.2 12H6.2L5 8z" />
                  <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 4px",
                    boxSizing: "border-box",
                    borderRadius: "999px",
                    background: "#2F7A3C",
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
                  {vals.unitCount}
                </span>
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
                <span style={{ fontSize: "12px", color: "#BFD8EE" }}>My cart</span>
                <span style={{ fontSize: "14px", fontWeight: "700" }} suppressHydrationWarning>
                  {vals.headerTotal}
                </span>
              </span>
            </Link>
          </header>
          <nav
            aria-label="Departments"
            className="nav"
            style={{
              height: "52px",
              flexShrink: "0",
              boxSizing: "border-box",
              margin: "0 var(--gutter)",
              display: "flex",
              alignItems: "center",
              gap: "30px",
              borderTop: "1px solid #EFEDE8",
              borderBottom: "1px solid #EFEDE8",
              fontSize: "14px",
              fontWeight: "500",
              color: "#3A3F4A",
            }}
            data-sec="category-nav"
          >
            <Link href="/shop">Electronics</Link>
            <Link href="/shop">Phones</Link>
            <Link href="/shop">{"Home & Living"}</Link>
            <Link href="/shop">Kitchen</Link>
            <Link href="/shop">Fashion</Link>
            <Link href="/shop">Beauty</Link>
            <Link href="/shop">{"Tools & DIY"}</Link>
            <Link href="/shop">{"Baby & Kids"}</Link>
            <div style={{ flexGrow: "1" }} />
            <Link
              href="/shop"
              style={{
                height: "32px",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "999px",
                background: "#E4F2E6",
                color: "#2F7A3C",
                fontWeight: "600",
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
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              Rent anything
            </Link>
            <Link href="/shop" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#C42A1C", fontWeight: "600" }}>
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
                <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
                <circle cx="7.5" cy="7.5" r="1.5" />
              </svg>
              Deals
            </Link>
          </nav>
          <section
            style={{ padding: "32px var(--gutter) 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
            data-sec="title"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <nav
                aria-label="Breadcrumb"
                style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5E6470" }}
              >
                <Link href="/" style={{ color: "#5E6470" }}>
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span style={{ color: "#111318", fontWeight: "600" }}>Cart</span>
              </nav>
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
                {"Your cart "}
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontWeight: "400",
                    letterSpacing: "-0.02em",
                    color: "#0D4F8B",
                  }}
                  suppressHydrationWarning
                >
                  ({vals.lineCount})
                </span>
              </h1>
            </div>
            <Link
              href="/"
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
              Continue shopping
            </Link>
          </section>
          {vals.isEmpty ? (
            <>
              <section style={{ padding: "28px var(--gutter) 0" }} data-sec="empty-state">
                {" "}
                <div
                  style={{
                    position: "relative",
                    height: "420px",
                    boxSizing: "border-box",
                    borderRadius: "32px",
                    background: "#F6F5F1",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 var(--gutter)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "120px",
                      top: "60px",
                      width: "300px",
                      height: "300px",
                      borderRadius: "999px",
                      background: "#EAF3FA",
                    }}
                    data-abs="deco"
                    data-w
                  />
                  <div
                    style={{ position: "absolute", right: "150px", top: "70px", zoom: "1.4", width: "200px", height: "200px" }}
                    data-abs="art"
                  >
                    <Render kind={"blocks"} />
                  </div>
                  <div style={{ position: "relative", width: "560px", display: "flex", flexDirection: "column", gap: "18px" }} data-w>
                    <span
                      style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                    >
                      Nothing here yet
                    </span>
                    <h2
                      style={{
                        margin: "0",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "44px",
                        lineHeight: "1",
                        fontWeight: "700",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {"Your cart is empty. "}
                      <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: "400", color: "#2F7A3C" }}>
                        {"Let's fix that."}
                      </span>
                    </h2>
                    <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#3A3F4A" }}>
                      Buy something to keep, or rent it for just the days you need it.
                    </p>
                    <div style={{ display: "flex", gap: "12px", paddingTop: "6px" }}>
                      <Link
                        href="/"
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
                        Start shopping
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
                      <Link
                        href="/shop"
                        style={{
                          height: "52px",
                          boxSizing: "border-box",
                          padding: "0 24px",
                          display: "flex",
                          alignItems: "center",
                          border: "1.5px solid #2F7A3C",
                          borderRadius: "14px",
                          color: "#2F7A3C",
                          fontSize: "15px",
                          fontWeight: "600",
                        }}
                      >
                        Browse rentals
                      </Link>
                    </div>
                  </div>
                </div>{" "}
              </section>
            </>
          ) : null}
          {vals.hasItems ? (
            <>
              <section style={{ padding: "28px var(--gutter) 0" }} data-sec="free-delivery-progress">
                {" "}
                <div
                  style={{
                    boxSizing: "border-box",
                    padding: "20px 24px",
                    border: "1px solid #EFEDE8",
                    borderRadius: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    background: "#FFFFFF",
                  }}
                >
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      flexShrink: "0",
                      borderRadius: "14px",
                      background: vals.freeIconBg,
                      color: vals.freeIconFg,
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
                  <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px" }}>
                      <span aria-live="polite" style={{ fontSize: "16px", fontWeight: "700" }} suppressHydrationWarning>
                        {vals.freeMsg}
                      </span>
                      <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                        {vals.freeSub}
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label="Progress to free delivery"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={vals.freePctNum}
                      style={{ height: "10px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}
                    >
                      <div
                        style={{
                          height: "10px",
                          width: vals.freePct,
                          borderRadius: "999px",
                          background: vals.freeBar,
                          transition: "width .3s ease",
                        }}
                      />
                    </div>
                  </div>
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
                  {vals.hasRentals ? (
                    <>
                      <div
                        style={{ border: "1px solid #EFEDE8", borderRadius: "28px", overflow: "hidden", background: "#FFFFFF" }}
                        data-sec="rentals-group"
                      >
                        {" "}
                        <div
                          style={{
                            padding: "18px 24px",
                            background: "#E4F2E6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "#2F7A3C",
                                color: "#FFFFFF",
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
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                <path d="M3 10h18M8 3v4M16 3v4" />
                              </svg>
                            </span>
                            <h2
                              style={{
                                margin: "0",
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: "22px",
                                fontWeight: "700",
                                letterSpacing: "-0.03em",
                                color: "#1F5E33",
                              }}
                            >
                              {"Rentals "}
                              <span style={{ fontWeight: "500", color: "#2F7A3C" }}>— returned to us</span>
                            </h2>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "500", color: "#1F5E33" }}>
                            We deliver it, then collect it on the return date
                          </span>
                        </div>{" "}
                        {(vals.rentals || []).map((r, i0) => (
                          <Fragment key={i0}>
                            {" "}
                            <div
                              style={{
                                padding: "20px 24px",
                                display: "flex",
                                gap: "20px",
                                alignItems: "center",
                                borderTop: "1px solid #EFEDE8",
                              }}
                            >
                              <Link
                                href="/product"
                                aria-label={r.name}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  flexShrink: "0",
                                  borderRadius: "22px",
                                  background: r.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div style={{ zoom: "0.54", width: "200px", height: "200px" }}>
                                  <Render kind={r.kind} />
                                </div>
                              </Link>
                              <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                                <span
                                  style={{
                                    alignSelf: "flex-start",
                                    height: "24px",
                                    padding: "0 10px",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "999px",
                                    background: "#E4F2E6",
                                    color: "#2F7A3C",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                  suppressHydrationWarning
                                >
                                  {"Rental · "}
                                  {r.days}
                                  {" days"}
                                </span>
                                <Link
                                  href="/product"
                                  style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.015em" }}
                                  suppressHydrationWarning
                                >
                                  {r.name}
                                </Link>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    flexWrap: "wrap",
                                    fontSize: "14px",
                                    color: "#3A3F4A",
                                  }}
                                >
                                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }} suppressHydrationWarning>
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#2F7A3C"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <rect x="3" y="5" width="18" height="16" rx="2" />
                                      <path d="M3 10h18M8 3v4M16 3v4" />
                                    </svg>
                                    {r.dates}
                                  </span>
                                  <Link
                                    href="/product"
                                    style={{
                                      height: "32px",
                                      display: "flex",
                                      alignItems: "center",
                                      fontWeight: "600",
                                      color: "#2F7A3C",
                                      textDecoration: "underline",
                                      textUnderlineOffset: "3px",
                                    }}
                                  >
                                    Change dates
                                  </Link>
                                </div>
                                <span style={{ fontSize: "13px", color: "#5E6470" }}>
                                  {"Refundable deposit KES [X] · held until it's back with us"}
                                </span>
                              </div>
                              <div
                                style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: "0" }}
                              >
                                <span style={{ fontSize: "20px", fontWeight: "700" }} suppressHydrationWarning>
                                  {r.priceFmt}
                                </span>
                                <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                                  {"for "}
                                  {r.days}
                                  {" days"}
                                </span>
                                <button
                                  type="button"
                                  onClick={r.remove}
                                  aria-label={`Remove ${r.name} rental`}
                                  className="ghost"
                                  style={{
                                    height: "44px",
                                    padding: "0 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "none",
                                    borderRadius: "12px",
                                    background: "transparent",
                                    color: "#5E6470",
                                    font: "inherit",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
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
                                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>{" "}
                          </Fragment>
                        ))}{" "}
                      </div>
                    </>
                  ) : null}
                  {vals.hasBuys ? (
                    <>
                      <div
                        style={{ border: "1px solid #EFEDE8", borderRadius: "28px", overflow: "hidden", background: "#FFFFFF" }}
                        data-sec="purchases-group"
                      >
                        {" "}
                        <div
                          style={{
                            padding: "18px 24px",
                            background: "#EAF3FA",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "#0D4F8B",
                                color: "#FFFFFF",
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
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M5 8h14l-1.2 12H6.2L5 8z" />
                                <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                              </svg>
                            </span>
                            <h2
                              style={{
                                margin: "0",
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: "22px",
                                fontWeight: "700",
                                letterSpacing: "-0.03em",
                                color: "#0D4F8B",
                              }}
                            >
                              {"Purchases "}
                              <span style={{ fontWeight: "500", color: "#1A62A8" }}>— yours to keep</span>
                            </h2>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "500", color: "#0D4F8B" }}>Genuine, with warranty</span>
                        </div>{" "}
                        {(vals.buys || []).map((p, i0) => (
                          <Fragment key={i0}>
                            {" "}
                            <div
                              style={{
                                padding: "20px 24px",
                                display: "flex",
                                gap: "20px",
                                alignItems: "center",
                                borderTop: "1px solid #EFEDE8",
                              }}
                            >
                              <Link
                                href="/product"
                                aria-label={p.name}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  flexShrink: "0",
                                  borderRadius: "22px",
                                  background: p.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div style={{ zoom: "0.54", width: "200px", height: "200px" }}>
                                  <Render kind={p.kind} />
                                </div>
                              </Link>
                              <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                                <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                                  {p.cat}
                                </span>
                                <Link
                                  href="/product"
                                  style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.015em" }}
                                  suppressHydrationWarning
                                >
                                  {p.name}
                                </Link>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", fontSize: "14px" }}>
                                  <span style={{ fontWeight: "600", color: p.unitColor }} suppressHydrationWarning>
                                    {p.unitFmt}
                                    {" each"}
                                  </span>
                                  {p.hasWas ? (
                                    <>
                                      <span
                                        style={{ fontSize: "13px", color: "#5E6470", textDecoration: "line-through" }}
                                        suppressHydrationWarning
                                      >
                                        {p.wasFmt}
                                      </span>
                                      <span
                                        style={{
                                          height: "22px",
                                          padding: "0 8px",
                                          display: "flex",
                                          alignItems: "center",
                                          borderRadius: "6px",
                                          background: "#C42A1C",
                                          color: "#FFFFFF",
                                          fontSize: "11px",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Sale
                                      </span>
                                    </>
                                  ) : null}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingTop: "2px" }}>
                                  <button
                                    type="button"
                                    onClick={p.save}
                                    className="ghost"
                                    style={{
                                      height: "44px",
                                      padding: "0 12px 0 0",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      border: "none",
                                      borderRadius: "12px",
                                      background: "transparent",
                                      color: "#0D4F8B",
                                      font: "inherit",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.9"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                                    </svg>
                                    Save for later
                                  </button>
                                  <span aria-hidden="true" style={{ color: "#D5D3CC" }}>
                                    |
                                  </span>
                                  <button
                                    type="button"
                                    onClick={p.remove}
                                    aria-label={`Remove ${p.name}`}
                                    className="ghost"
                                    style={{
                                      height: "44px",
                                      padding: "0 12px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      border: "none",
                                      borderRadius: "12px",
                                      background: "transparent",
                                      color: "#5E6470",
                                      font: "inherit",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      cursor: "pointer",
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
                                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                                    </svg>
                                    Remove
                                  </button>
                                </div>
                              </div>
                              <div
                                style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: "0" }}
                              >
                                <span style={{ fontSize: "20px", fontWeight: "700" }} suppressHydrationWarning>
                                  {p.lineFmt}
                                </span>
                                <div
                                  role="group"
                                  aria-label={`Quantity for ${p.name}`}
                                  style={{
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #E6E4DE",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={p.dec}
                                    disabled={p.decDisabled}
                                    aria-label="Decrease quantity"
                                    className="ghost"
                                    style={{
                                      width: "44px",
                                      height: "44px",
                                      border: "none",
                                      background: "transparent",
                                      color: p.decColor,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M5 12h14" />
                                    </svg>
                                  </button>
                                  <span
                                    aria-live="polite"
                                    style={{
                                      minWidth: "36px",
                                      textAlign: "center",
                                      fontSize: "15px",
                                      fontWeight: "700",
                                      fontVariantNumeric: "tabular-nums",
                                    }}
                                    suppressHydrationWarning
                                  >
                                    {p.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={p.inc}
                                    aria-label="Increase quantity"
                                    className="ghost"
                                    style={{
                                      width: "44px",
                                      height: "44px",
                                      border: "none",
                                      background: "transparent",
                                      color: "#111318",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M12 5v14M5 12h14" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>{" "}
                          </Fragment>
                        ))}{" "}
                      </div>
                    </>
                  ) : null}
                  {vals.hasSaved ? (
                    <>
                      <div
                        style={{
                          border: "1px dashed #D5D3CC",
                          borderRadius: "28px",
                          padding: "18px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                        data-sec="saved-for-later"
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#0D4F8B",
                          }}
                          suppressHydrationWarning
                        >
                          Saved for later ({vals.savedCount})
                        </span>
                        {(vals.saved || []).map((sv, i0) => (
                          <Fragment key={i0}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <span
                                style={{
                                  width: "64px",
                                  height: "64px",
                                  flexShrink: "0",
                                  borderRadius: "16px",
                                  background: sv.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div style={{ zoom: "0.28", width: "200px", height: "200px" }}>
                                  <Render kind={sv.kind} />
                                </div>
                              </span>
                              <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontSize: "15px", fontWeight: "700" }} suppressHydrationWarning>
                                  {sv.name}
                                </span>
                                <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                  {sv.unitFmt}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={sv.move}
                                className="btn-t"
                                style={{
                                  height: "44px",
                                  padding: "0 16px",
                                  border: "none",
                                  borderRadius: "12px",
                                  background: "#0D4F8B",
                                  color: "#FFFFFF",
                                  font: "inherit",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                }}
                              >
                                Move to cart
                              </button>
                              <button
                                type="button"
                                onClick={sv.drop}
                                aria-label={`Delete ${sv.name} from saved`}
                                className="ghost"
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  border: "none",
                                  borderRadius: "12px",
                                  background: "transparent",
                                  color: "#5E6470",
                                  cursor: "pointer",
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
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  aria-hidden="true"
                                >
                                  <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                              </button>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  <div
                    style={{
                      border: "1px solid #EFEDE8",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                    data-sec="delivery-choice"
                  >
                    <h2
                      id="dlv-h"
                      style={{
                        margin: "0",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "22px",
                        fontWeight: "700",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      How do you want it?
                    </h2>
                    <div
                      role="radiogroup"
                      aria-labelledby="dlv-h"
                      style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}
                      data-cols="2"
                    >
                      {(vals.deliveryOpts || []).map((d, i0) => (
                        <Fragment key={i0}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={d.aria}
                            onClick={d.pick}
                            style={{
                              boxSizing: "border-box",
                              minHeight: "112px",
                              padding: "18px",
                              display: "flex",
                              gap: "14px",
                              alignItems: "flex-start",
                              textAlign: "left",
                              border: `2px solid ${d.border}`,
                              borderRadius: "20px",
                              background: d.bg,
                              color: "#111318",
                              font: "inherit",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              style={{
                                width: "22px",
                                height: "22px",
                                flexShrink: "0",
                                marginTop: "2px",
                                boxSizing: "border-box",
                                borderRadius: "999px",
                                border: `2px solid ${d.ring}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: d.dot }} />
                            </span>
                            <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                <span style={{ fontSize: "16px", fontWeight: "700" }} suppressHydrationWarning>
                                  {d.title}
                                </span>
                                <span style={{ fontSize: "14px", fontWeight: "700", color: d.feeColor }} suppressHydrationWarning>
                                  {d.fee}
                                </span>
                              </span>
                              <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#3A3F4A" }} suppressHydrationWarning>
                                {d.line1}
                              </span>
                              <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                {d.line2}
                              </span>
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <p style={{ margin: "0", fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                      {vals.deliveryNote}
                    </p>
                  </div>
                </div>
                <aside
                  aria-label="Order summary"
                  style={{
                    gridColumn: "span 4",
                    position: "sticky",
                    top: "24px",
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
                  data-sec="summary"
                >
                  <h2
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
                  <dl style={{ margin: "0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <dt style={{ color: "#3A3F4A" }} suppressHydrationWarning>
                        Purchases ({vals.buyUnits}
                        {" items)"}
                      </dt>
                      <dd style={{ margin: "0", fontWeight: "600" }} suppressHydrationWarning>
                        {vals.buySubFmt}
                      </dd>
                    </div>
                    {vals.promoOn ? (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                          <dt style={{ color: "#2F7A3C", fontWeight: "600" }}>SIMBA10 · 10% off purchases</dt>
                          <dd style={{ margin: "0", fontWeight: "700", color: "#2F7A3C" }} suppressHydrationWarning>
                            {vals.discountFmt}
                          </dd>
                        </div>
                      </>
                    ) : null}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <dt style={{ color: "#3A3F4A" }} suppressHydrationWarning>
                        Rentals ({vals.rentLabel})
                      </dt>
                      <dd style={{ margin: "0", fontWeight: "600" }} suppressHydrationWarning>
                        {vals.rentSubFmt}
                      </dd>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <dt style={{ color: "#3A3F4A" }}>Delivery</dt>
                      <dd style={{ margin: "0", fontWeight: "600", color: vals.feeColor }} suppressHydrationWarning>
                        {vals.feeFmt}
                      </dd>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <dt style={{ color: "#3A3F4A", display: "flex", alignItems: "center", gap: "6px" }}>
                        Refundable deposit
                        <span
                          style={{
                            height: "20px",
                            padding: "0 7px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            background: "#E4F2E6",
                            color: "#2F7A3C",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          Rental
                        </span>
                      </dt>
                      <dd style={{ margin: "0", fontWeight: "600" }}>KES [X]</dd>
                    </div>
                  </dl>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "16px", borderTop: "1px solid #EFEDE8" }}
                    data-sec="promo"
                  >
                    {vals.promoOn ? (
                      <>
                        <div
                          style={{
                            height: "48px",
                            boxSizing: "border-box",
                            padding: "0 6px 0 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: "12px",
                            background: "#E4F2E6",
                            color: "#1F5E33",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M5 12l5 5 9-10" />
                            </svg>
                            SIMBA10 applied
                          </span>
                          <button
                            type="button"
                            onClick={vals.removePromo}
                            style={{
                              height: "44px",
                              padding: "0 10px",
                              border: "none",
                              borderRadius: "10px",
                              background: "transparent",
                              color: "#1F5E33",
                              font: "inherit",
                              fontSize: "13px",
                              fontWeight: "700",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : null}
                    {vals.promoOff ? (
                      <>
                        <label htmlFor="promo" style={{ fontSize: "14px", fontWeight: "600" }}>
                          Promo code
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            id="promo"
                            type="text"
                            value={vals.promoInput}
                            onChange={vals.onPromo}
                            onKeyDown={vals.onPromoKey}
                            placeholder="Enter code"
                            aria-invalid={vals.promoInvalid}
                            aria-describedby="promo-msg"
                            autoComplete="off"
                            style={{
                              flexGrow: "1",
                              minWidth: "0",
                              height: "48px",
                              boxSizing: "border-box",
                              padding: "0 14px",
                              border: `1.5px solid ${vals.promoBorder}`,
                              borderRadius: "12px",
                              background: "#FFFFFF",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                              textTransform: "uppercase",
                            }}
                          />
                          <button
                            type="button"
                            onClick={vals.applyPromo}
                            className="btn-t"
                            style={{
                              height: "48px",
                              padding: "0 18px",
                              border: "none",
                              borderRadius: "12px",
                              background: "#0D4F8B",
                              color: "#FFFFFF",
                              font: "inherit",
                              fontSize: "14px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            Apply
                          </button>
                        </div>
                        <span
                          id="promo-msg"
                          role="alert"
                          style={{ minHeight: "18px", fontSize: "13px", fontWeight: "500", color: "#C42A1C" }}
                          suppressHydrationWarning
                        >
                          {vals.promoError}
                        </span>
                      </>
                    ) : null}
                  </div>
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
                      <span style={{ fontSize: "12px", color: "#5E6470" }}>+ KES [X] refundable deposit</span>
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
                  <Link
                    href="/checkout"
                    className="btn-y"
                    style={{
                      height: "56px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      borderRadius: "14px",
                      background: "#2F7A3C",
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
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
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                    Checkout securely
                  </Link>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#5E6470" }}>We accept</span>
                    <div style={{ display: "flex", gap: "8px" }}>
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
                        M-PESA
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
                        aria-label="Mastercard"
                        role="img"
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
                  </div>
                </aside>
              </section>
            </>
          ) : null}
          <section
            style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }}
            data-sec="you-might-also-need"
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Goes well with your cart
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "44px",
                    lineHeight: "1",
                    fontWeight: "700",
                    letterSpacing: "-0.04em",
                  }}
                >
                  You might also need
                </h2>
              </div>
              <Link
                href="/shop"
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
                See more
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
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }} data-cols="4">
              {(vals.recs || []).map((p, i0) => (
                <Fragment key={i0}>
                  <article
                    className="lift"
                    style={{
                      border: "1px solid #EFEDE8",
                      borderRadius: "26px",
                      padding: "12px 12px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      background: "#FFFFFF",
                    }}
                  >
                    <Link
                      href="/product"
                      aria-label={p.name}
                      style={{
                        position: "relative",
                        height: "232px",
                        borderRadius: "20px",
                        background: p.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          height: "26px",
                          padding: "0 10px",
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          background: p.tagBg,
                          color: p.tagFg,
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                        data-abs="misc"
                        suppressHydrationWarning
                      >
                        {p.tag}
                      </span>
                      <div style={{ zoom: "0.98", width: "200px", height: "200px" }}>
                        <Render kind={p.kind} />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={p.toggleWish}
                      aria-label={p.wishLabel}
                      aria-pressed={p.wishAria}
                      style={{
                        position: "relative",
                        margin: "-70px 12px 14px auto",
                        width: "44px",
                        height: "44px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={p.heartFill}
                        stroke={p.heartStroke}
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                      </svg>
                    </button>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "0 6px", marginTop: "-8px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "12px",
                          color: "#5E6470",
                        }}
                      >
                        <span suppressHydrationWarning>{p.cat}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                            <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                          </svg>
                          <span style={{ fontWeight: "600", color: "#111318" }} suppressHydrationWarning>
                            {p.rating}
                          </span>
                        </span>
                      </div>
                      <Link
                        href="/product"
                        style={{ fontSize: "17px", fontWeight: "700", letterSpacing: "-0.015em" }}
                        suppressHydrationWarning
                      >
                        {p.name}
                      </Link>
                      <div
                        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "10px", paddingTop: "6px" }}
                      >
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "18px", fontWeight: "700" }} suppressHydrationWarning>
                            {p.main}
                          </span>
                          <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                            {p.sub}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="btn-t"
                          onClick={p.add}
                          aria-label={p.addLabel}
                          style={{
                            height: "44px",
                            padding: "0 14px",
                            border: "none",
                            borderRadius: "12px",
                            background: p.addBg,
                            color: "#FFFFFF",
                            font: "inherit",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            flexShrink: "0",
                          }}
                          suppressHydrationWarning
                        >
                          {p.cta}
                        </button>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
          </section>
          <SiteFooter />
        </div>
      </>
    );
  }
}

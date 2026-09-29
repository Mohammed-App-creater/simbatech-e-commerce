"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";
import { shopState, connectShop, headerVals, submitSearch, navigate, cart, wishlist } from "@/lib/client/store";
import { computeTotals, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "@/lib/pricing";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var FREE_THRESHOLD = FREE_DELIVERY_THRESHOLD;
var MAX_QTY = 20;
var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(n) {
  return (
    "ETB " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
// "2026-10-03" -> Date at UTC midnight (timezone-independent, same on server and client)
function isoDate(s) {
  return new Date(s + "T00:00:00Z");
}
function dayLabel(d) {
  return DOW[d.getUTCDay()] + " " + d.getUTCDate() + " " + MON[d.getUTCMonth()];
}
function rentalDates(l) {
  if (!l.rentStart || !l.rentEnd) return "Dates to be confirmed";
  var a = isoDate(l.rentStart);
  var b = isoDate(l.rentEnd);
  return dayLabel(a) + " – " + dayLabel(b) + " " + b.getUTCFullYear();
}
function deptHref(name) {
  return "/shop?dept=" + encodeURIComponent(name);
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "buy",
      delivery: "deliver",
      promoInput: "",
      promoError: "",
      promoBusy: false,
      busy: {}, // line id -> true while an update is in flight
      actionError: "",
      recBusy: {}, // product id -> true while adding
      recAdded: {}, // product id -> true for ~1.5s after adding
    };
    this.timers = [];
  }
  componentDidMount() {
    this.unsubShop = connectShop(this);
  }
  componentWillUnmount() {
    this.unsubShop && this.unsubShop();
    this.timers.forEach(clearTimeout);
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var initial = this.props.initial || {};
    var shop = shopState(initial);
    var hv = headerVals(shop);
    var c = shop.cart || { lines: [], saved: [], promo: null, totals: null };
    var lines = c.lines || [];
    var savedL = c.saved || [];
    var rentalsL = lines.filter(function (l) {
      return l.mode === "rent";
    });
    var buysL = lines.filter(function (l) {
      return l.mode === "buy";
    });
    var busy = s.busy || {};

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

    // Runs a cart action for one line, disabling its controls while pending and surfacing errors.
    var act = function (lineId, fn) {
      if ((self.state.busy || {})[lineId]) return;
      self.setState(function (st) {
        var b = Object.assign({}, st.busy);
        b[lineId] = true;
        return { busy: b, actionError: "" };
      });
      var done = function (err) {
        self.setState(function (st) {
          var b = Object.assign({}, st.busy);
          delete b[lineId];
          return { busy: b, actionError: err ? err.message : "" };
        });
      };
      fn().then(
        function () {
          done(null);
        },
        function (err) {
          done(err);
        },
      );
    };

    var rentals = rentalsL.map(function (l) {
      var p = l.product;
      return {
        name: p.name,
        kind: p.kind,
        bg: p.bg,
        href: "/product/" + p.id,
        days: l.rentDays || 0,
        dates: rentalDates(l),
        priceFmt: fmt(l.lineTotal),
        depositText: "Refundable deposit " + fmt(l.deposit) + " · held until it's back with us",
        busy: !!busy[l.id],
        remove: function () {
          act(l.id, function () {
            return cart.remove(l.id);
          });
        },
      };
    });

    var buyUnits = 0;
    var buys = buysL.map(function (l) {
      var p = l.product;
      var b = !!busy[l.id];
      buyUnits += l.qty;
      return {
        name: p.name,
        cat: p.cat,
        kind: p.kind,
        bg: p.bg,
        href: "/product/" + p.id,
        qty: l.qty,
        unitFmt: fmt(l.unitPrice),
        lineFmt: fmt(l.lineTotal),
        hasWas: !!p.was,
        wasFmt: p.was ? fmt(p.was) : "",
        unitColor: p.was ? "#C42A1C" : "#3A3F4A",
        busy: b,
        decDisabled: l.qty <= 1 || b,
        incDisabled: l.qty >= MAX_QTY || b,
        decColor: l.qty <= 1 ? "#B4B8BF" : "#111318",
        dec: function () {
          if (l.qty <= 1) return;
          act(l.id, function () {
            return cart.update(l.id, { qty: l.qty - 1 });
          });
        },
        inc: function () {
          if (l.qty >= MAX_QTY) return;
          act(l.id, function () {
            return cart.update(l.id, { qty: l.qty + 1 });
          });
        },
        remove: function () {
          act(l.id, function () {
            return cart.remove(l.id);
          });
        },
        save: function () {
          act(l.id, function () {
            return cart.update(l.id, { savedForLater: true });
          });
        },
      };
    });

    var saved = savedL.map(function (l) {
      var p = l.product;
      return {
        name: p.name,
        kind: p.kind,
        bg: p.bg,
        unitFmt: l.mode === "rent" ? fmt(l.lineTotal) + " · rental" : fmt(l.unitPrice),
        busy: !!busy[l.id],
        move: function () {
          act(l.id, function () {
            return cart.update(l.id, { savedForLater: false });
          });
        },
        drop: function () {
          act(l.id, function () {
            return cart.remove(l.id);
          });
        },
      };
    });

    var pickup = s.delivery === "pickup";
    var base = c.totals || { purchases: 0, rentals: 0, deposit: 0 };
    var percentOff = c.promo ? c.promo.percentOff : 0;
    var t = computeTotals({
      purchases: base.purchases,
      rentals: base.rentals,
      deposit: base.deposit,
      percentOff: percentOff,
      pickup: pickup,
    });
    var deliverT = pickup
      ? computeTotals({ purchases: base.purchases, rentals: base.rentals, deposit: base.deposit, percentOff: percentOff })
      : t;
    var buySub = t.purchases;
    var goods = buySub - t.discount;
    var away = t.freeDeliveryRemaining;
    var unlocked = buySub > 0 && away === 0;
    var fee = t.deliveryFee;
    var pct = Math.min(100, Math.round((Math.max(0, goods) / FREE_THRESHOLD) * 100));
    var lineCount = lines.length;
    var hasAnything = lines.length + savedL.length > 0;

    var deliveryOpts = [
      {
        id: "deliver",
        title: "Deliver to me",
        fee: deliverT.deliveryFee === 0 ? "Free" : fmt(DELIVERY_FEE),
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
      if (self.state.promoBusy) return;
      var code = String(self.state.promoInput || "")
        .trim()
        .toUpperCase();
      if (!code) {
        self.setState({ promoError: "Enter a promo code first." });
        return;
      }
      self.setState({ promoBusy: true, promoError: "" });
      cart.applyPromo(code).then(
        function () {
          self.setState({ promoBusy: false, promoError: "", promoInput: "" });
        },
        function (err) {
          self.setState({ promoBusy: false, promoError: err.message });
        },
      );
    };

    var inCartIds = buysL.map(function (l) {
      return l.product.id;
    });
    var recBusy = s.recBusy || {};
    var recAdded = s.recAdded || {};
    var recs = (initial.recommendations || []).map(function (p) {
      var id = p.id;
      var w = wishlist.has(shop, id);
      var inCart = inCartIds.indexOf(id) >= 0;
      var justAdded = !!recAdded[id];
      var tag = p.was ? "Sale" : "Buy";
      return {
        name: p.name,
        cat: p.cat,
        kind: p.kind,
        bg: p.bg,
        href: "/product/" + id,
        rating: p.rating,
        tag: tag,
        tagBg: tag === "Sale" ? "#C42A1C" : "#FFFFFF",
        tagFg: tag === "Sale" ? "#FFFFFF" : "#111318",
        main: fmt(p.buy),
        sub: p.was ? "was " + fmt(p.was) : "Free delivery",
        cta: justAdded || inCart ? "Added" : "Add",
        addBg: justAdded || inCart ? "#2F7A3C" : "#0D4F8B",
        addLabel: (inCart ? "Add another: " : "Add to cart: ") + p.name,
        addDisabled: !!recBusy[id],
        add: function () {
          if ((self.state.recBusy || {})[id]) return;
          var setMap = function (key, val) {
            self.setState(function (st) {
              var m = Object.assign({}, st[key]);
              if (val) m[id] = true;
              else delete m[id];
              var o = {};
              o[key] = m;
              return o;
            });
          };
          setMap("recBusy", true);
          self.setState({ actionError: "" });
          cart.add({ productId: id, mode: "buy", qty: 1 }).then(
            function () {
              setMap("recBusy", false);
              setMap("recAdded", true);
              self.timers.push(
                setTimeout(function () {
                  setMap("recAdded", false);
                }, 1500),
              );
            },
            function (err) {
              setMap("recBusy", false);
              self.setState({ actionError: err.message });
            },
          );
        },
        heartFill: w ? "#E0522B" : "none",
        heartStroke: w ? "#E0522B" : "#111318",
        wishAria: w ? "true" : "false",
        wishLabel: (w ? "Remove from" : "Save to") + " wishlist: " + p.name,
        toggleWish: function () {
          wishlist.toggle(id).catch(function (err) {
            self.setState({ actionError: err.message });
          });
        },
      };
    });

    var rentDays = rentalsL.reduce(function (a, l) {
      return a + (l.rentDays || 0);
    }, 0);
    var checkoutHref = pickup ? "/checkout?fulfilment=pickup" : "/checkout";
    var canCheckout = lineCount > 0;

    return {
      modes: modes,
      placeholder: mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      onSearch: function (e) {
        submitSearch(e, mode);
      },
      accountHref: hv.accountHref,
      accountHello: hv.accountHello,
      deptHref: deptHref,
      wishCount: hv.wishCount,
      unitCount: hv.cartCount,
      headerTotal: hv.cartTotal,
      lineCount: lineCount,
      isEmpty: !hasAnything,
      hasItems: hasAnything,
      hasRentals: rentalsL.length > 0,
      hasBuys: buysL.length > 0,
      hasSaved: savedL.length > 0,
      savedCount: savedL.length,
      noLines: lineCount === 0,
      rentals: rentals,
      buys: buys,
      saved: saved,
      actionError: s.actionError || "",
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
      promoOn: !!c.promo,
      promoOff: !c.promo,
      promoLabel: c.promo ? c.promo.code + " · " + c.promo.percentOff + "% off purchases" : "",
      promoApplied: c.promo ? c.promo.code + " applied" : "",
      discountFmt: "−" + fmt(t.discount),
      rentLabel: rentalsL.length + (rentalsL.length === 1 ? " item" : " items") + " · " + rentDays + " days",
      rentSubFmt: fmt(t.rentals),
      feeFmt: fee === 0 ? "Free" : fmt(fee),
      feeColor: fee === 0 ? "#2F7A3C" : "#111318",
      depositFmt: fmt(t.deposit),
      depositNote: "+ " + fmt(t.deposit) + " refundable deposit",
      totalFmt: fmt(t.total),
      checkoutHref: canCheckout ? checkoutHref : "/cart",
      checkoutDisabled: canCheckout ? undefined : "true",
      checkoutOpacity: canCheckout ? undefined : "0.5",
      onCheckout: function (e) {
        e.preventDefault();
        if (!canCheckout) return;
        navigate(checkoutHref);
      },
      promoInput: s.promoInput || "",
      promoError: s.promoError || "",
      promoBusy: !!s.promoBusy,
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
        if (self.state.promoBusy) return;
        self.setState({ promoBusy: true, promoError: "" });
        cart.removePromo().then(
          function () {
            self.setState({ promoBusy: false });
          },
          function (err) {
            self.setState({ promoBusy: false, actionError: err.message });
          },
        );
      },
      recs: recs,
    };
  }
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
                Free delivery on orders over ETB [X]
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
              onSubmit={vals.onSearch}
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
            <Link href={vals.accountHref} style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0", height: "52px" }}>
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
                <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                  {vals.accountHello}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>Account</span>
              </span>
            </Link>
            <Link
              href={vals.accountHref}
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
            <Link href={vals.deptHref("Electronics")}>Electronics</Link>
            <Link href={vals.deptHref("Phones")}>Phones</Link>
            <Link href={vals.deptHref("Home & Living")}>{"Home & Living"}</Link>
            <Link href={vals.deptHref("Kitchen")}>Kitchen</Link>
            <Link href={vals.deptHref("Fashion")}>Fashion</Link>
            <Link href={vals.deptHref("Beauty")}>Beauty</Link>
            <Link href={vals.deptHref("Tools & DIY")}>{"Tools & DIY"}</Link>
            <Link href={vals.deptHref("Baby & Kids")}>{"Baby & Kids"}</Link>
            <div style={{ flexGrow: "1" }} />
            <Link
              href="/shop?mode=rent"
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
                        href="/shop"
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
                        href="/shop?mode=rent"
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
                                href={r.href}
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
                                  href={r.href}
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
                                    href={r.href}
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
                                <span style={{ fontSize: "13px", color: "#5E6470" }}>{r.depositText}</span>
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
                                  disabled={r.busy}
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
                                href={p.href}
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
                                  href={p.href}
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
                                    disabled={p.busy}
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
                                    disabled={p.busy}
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
                                    disabled={p.incDisabled}
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
                                disabled={sv.busy}
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
                                disabled={sv.busy}
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
                  {vals.actionError ? (
                    <span role="alert" style={{ minHeight: "18px", fontSize: "13px", fontWeight: "500", color: "#C42A1C" }}>
                      {vals.actionError}
                    </span>
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
                          <dt style={{ color: "#2F7A3C", fontWeight: "600" }} suppressHydrationWarning>
                            {vals.promoLabel}
                          </dt>
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
                      <dd style={{ margin: "0", fontWeight: "600" }} suppressHydrationWarning>
                        {vals.depositFmt}
                      </dd>
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
                            {vals.promoApplied}
                          </span>
                          <button
                            type="button"
                            onClick={vals.removePromo}
                            disabled={vals.promoBusy}
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
                            suppressHydrationWarning
                          />
                          <button
                            type="button"
                            onClick={vals.applyPromo}
                            disabled={vals.promoBusy}
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
                      <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                        {vals.depositNote}
                      </span>
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
                    href={vals.checkoutHref}
                    onClick={vals.onCheckout}
                    aria-disabled={vals.checkoutDisabled}
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
                      opacity: vals.checkoutOpacity,
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
                      href={p.href}
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
                        href={p.href}
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
                          disabled={p.addDisabled}
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

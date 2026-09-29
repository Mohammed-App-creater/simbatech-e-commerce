"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var BUY_PRICE = 139000;
var DURS = [
  { id: "d1", days: 1, label: "1 day", price: 2500 },
  { id: "d3", days: 3, label: "3 days", price: 6900 },
  { id: "w1", days: 7, label: "1 week", price: 14000 },
  { id: "w2", days: 14, label: "2 weeks", price: 25000 },
];
var ADDONS = [
  { id: "battery", label: "Extra battery", perDay: 300, note: "Shoot all day without recharging" },
  { id: "lens", label: "Spare lens", perDay: 900, note: "[LENS MODEL]" },
  { id: "cover", label: "Damage cover", perDay: 200, note: "Lowers your excess to ETB [X]" },
];
var VARIANTS = [
  { id: "body", label: "Body only", extra: 0 },
  { id: "kit", label: "With kit lens", extra: 18000 },
];
var SHOTS = [
  { label: "Front", bg: "#E0F1FF", rot: "0deg", zoom: 2.2, tZoom: 0.5 },
  { label: "Angled left", bg: "#EEE8FF", rot: "-14deg", zoom: 2.1, tZoom: 0.5 },
  { label: "Angled right", bg: "#DDF5EA", rot: "12deg", zoom: 2.1, tZoom: 0.5 },
  { label: "Close-up", bg: "#FFEADB", rot: "-5deg", zoom: 2.9, tZoom: 0.74 },
];
var TABS = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specifications" },
  { id: "terms", label: "Rental terms" },
  { id: "reviews", label: "Reviews ([N])" },
];
var SPECS = [
  ["Type", "Mirrorless camera"],
  ["Video", "4K"],
  ["Sensor", "[SPEC]"],
  ["Resolution", "[SPEC] MP"],
  ["Lens mount", "[SPEC]"],
  ["Image stabilisation", "[SPEC]"],
  ["Screen", "[SPEC]"],
  ["Viewfinder", "[SPEC]"],
  ["Battery life", "[SPEC] shots"],
  ["Connectivity", "[SPEC]"],
  ["Weight (body)", "[SPEC] g"],
  ["Warranty", "[TERM]"],
];
var TERMS = [
  { title: "Deposit", body: "A refundable deposit of ETB [X] is held when you book and released within [N] days of collection." },
  { title: "Extending", body: "Need it longer? Extend from your account before the return date, at the same daily rate." },
  { title: "Damage", body: "[DAMAGE POLICY]. Add damage cover to lower your excess to ETB [X]." },
  { title: "Delivery & collection", body: "We deliver on your start date and collect on the return date, [TIME WINDOW]." },
];
var DIST = [
  { stars: 5, w: "78%" },
  { stars: 4, w: "46%" },
  { stars: 3, w: "24%" },
  { stars: 2, w: "12%" },
  { stars: 1, w: "6%" },
];
var CAT = [
  { id: "p1", name: "Lumen Z6 Camera", cat: "Electronics", kind: "camera", bg: "#E0F1FF", buy: 139000, rent: 2500, rating: "4.8" },
  { id: "p2", name: "Pulse ANC Headphones", cat: "Electronics", kind: "headphones", bg: "#EEE8FF", buy: 18900, was: 23500, rating: "4.9" },
  { id: "p3", name: "Aero X Pro", cat: "Phones", kind: "phone", bg: "#DDF5EA", buy: 89500, rating: "4.7" },
  { id: "p9", name: "Cordless Drill Kit", cat: "Tools & DIY", kind: "drill", bg: "#FFF4C7", buy: 14500, rent: 800, rating: "4.9" },
  {
    id: "p10",
    name: "Canopy Tent 3 × 3 m",
    cat: "Events & Party",
    kind: "tent",
    bg: "#FFEADB",
    buy: 45000,
    rent: 3500,
    rating: "4.7",
    rentOnly: true,
  },
  { id: "p11", name: "Trail Mountain Bike", cat: "Sports", kind: "bike", bg: "#DDF5EA", buy: 65000, rent: 1200, rating: "4.5" },
];
var FBT = [
  { id: "p1", tag: "This item" },
  { id: "p10", tag: "Shade for outdoor shoots" },
  { id: "p11", tag: "For the trip there" },
];
var RELATED = ["p10", "p2", "p3", "p9"];
var CUTOFF_HOUR = 16;
var WDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(n) {
  return (
    "ETB " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
function pad(n) {
  return (n < 10 ? "0" : "") + n;
}
function byId(id) {
  return CAT.filter(function (p) {
    return p.id === id;
  })[0];
}
function iso(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function parseIso(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  return isNaN(d.getTime()) ? null : d;
}
function niceDate(d) {
  return WDAY[d.getDay()] + ", " + d.getDate() + " " + MON[d.getMonth()];
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    var t = new Date();
    var tomorrow = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
    this.state = {
      mode: "rent",
      dur: "d3",
      start: iso(tomorrow),
      addons: { battery: true },
      variant: "body",
      qty: 1,
      shot: 0,
      wished: false,
      shared: false,
      tab: "overview",
      reviewPrompt: false,
      fulfil: "delivery",
      fbt: { p1: true, p10: true, p11: true },
      fbtAdded: false,
      searchMode: "rent",
      cardMode: {},
      cardWish: {},
      cartCount: 3,
      cartTotal: 99700,
      now: Date.now(),
    };
  }
  componentDidMount() {
    var self = this;
    this.timer = setInterval(function () {
      self.setState({ now: Date.now() });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(this.shareTimer);
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var addCart = function (amount, count) {
      self.setState({ cartCount: (self.state.cartCount || 0) + (count || 1), cartTotal: (self.state.cartTotal || 0) + amount });
    };

    // Header search mode
    var searchMode = s.searchMode || "rent";
    var modes = [
      { id: "buy", label: "Buy" },
      { id: "rent", label: "Rent" },
    ].map(function (m) {
      var on = m.id === searchMode;
      return {
        label: m.label,
        aria: on ? "true" : "false",
        bg: on ? "#0D4F8B" : "transparent",
        fg: on ? "#FFFFFF" : "#0D4F8B",
        pick: function () {
          self.setState({ searchMode: m.id });
        },
      };
    });

    // Gallery
    var shotIdx = s.shot || 0;
    var goShot = function (i) {
      return function () {
        self.setState({ shot: (i + SHOTS.length) % SHOTS.length });
      };
    };
    var thumbs = SHOTS.map(function (x, i) {
      var on = i === shotIdx;
      return {
        label: x.label + " view",
        bg: x.bg,
        rot: x.rot,
        zoom: x.tZoom,
        aria: on ? "true" : "false",
        border: on ? "#0D4F8B" : "transparent",
        pick: goShot(i),
      };
    });

    // Mode
    var mode = s.mode || "rent";
    var isRent = mode === "rent";

    // Rent
    var dur =
      DURS.filter(function (d) {
        return d.id === s.dur;
      })[0] || DURS[1];
    var durs = DURS.map(function (d) {
      var on = d.id === dur.id;
      var full = d.days * DURS[0].price;
      var pct = Math.round((1 - d.price / full) * 100);
      return {
        label: d.label,
        priceFmt: fmt(d.price),
        save: pct > 0 ? "Save " + pct + "%" : "",
        aria: on ? "true" : "false",
        border: on ? "#2F7A3C" : "#E6E4DE",
        bg: on ? "#E4F2E6" : "#FFFFFF",
        pick: function () {
          self.setState({ dur: d.id });
        },
      };
    });
    var picked = s.addons || {};
    var addonTotal = 0,
      addonCount = 0;
    var addons = ADDONS.map(function (a) {
      var on = !!picked[a.id];
      if (on) {
        addonTotal += a.perDay * dur.days;
        addonCount += 1;
      }
      return {
        label: a.label,
        note: a.note,
        priceFmt: fmt(a.perDay),
        checked: on,
        border: on ? "#2F7A3C" : "#E6E4DE",
        bg: on ? "#F4FAF5" : "#FFFFFF",
        toggle: function () {
          var n = Object.assign({}, self.state.addons);
          n[a.id] = !n[a.id];
          self.setState({ addons: n });
        },
      };
    });
    var rentTotal = dur.price + addonTotal;
    var today = new Date(s.now || Date.now());
    var startD = parseIso(s.start) || new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    var returnD = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + dur.days);

    // Buy
    var variant =
      VARIANTS.filter(function (v) {
        return v.id === s.variant;
      })[0] || VARIANTS[0];
    var unit = BUY_PRICE + variant.extra;
    var qty = s.qty || 1;
    var variants = VARIANTS.map(function (v) {
      var on = v.id === variant.id;
      return {
        label: v.label,
        sub: v.extra ? "+" + fmt(v.extra) : fmt(BUY_PRICE),
        aria: on ? "true" : "false",
        border: on ? "#1679BE" : "#E6E4DE",
        bg: on ? "#EAF3FA" : "#FFFFFF",
        pick: function () {
          self.setState({ variant: v.id });
        },
      };
    });

    // Delivery countdown
    var nowD = new Date(s.now || Date.now());
    var cutoff = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate(), CUTOFF_HOUR, 0, 0);
    var cdDay = "today";
    if (nowD >= cutoff) {
      cutoff = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate() + 1, CUTOFF_HOUR, 0, 0);
      cdDay = "tomorrow";
    }
    var leftMin = Math.max(0, Math.floor((cutoff - nowD) / 60000));
    var fulfilSel = s.fulfil || "delivery";
    var fulfil = [
      { id: "delivery", label: "Home delivery", sub: "Free over ETB [X]" },
      { id: "pickup", label: "Pick up", sub: "[STORE] · free" },
    ].map(function (f) {
      var on = f.id === fulfilSel;
      return {
        label: f.label,
        sub: f.sub,
        checked: on,
        border: on ? "#2F7A3C" : "#E6E4DE",
        bg: on ? "#F4FAF5" : "#FFFFFF",
        pick: function () {
          self.setState({ fulfil: f.id });
        },
      };
    });

    // Tabs
    var tab = s.tab || "overview";
    var tabs = TABS.map(function (t) {
      var on = t.id === tab;
      return {
        label: t.label,
        tabId: "tab-" + t.id,
        panelId: "panel-" + t.id,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#111318" : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        pick: function () {
          self.setState({ tab: t.id });
        },
      };
    });
    var inBox = ["Lumen Z6 camera body", "Rechargeable battery", "Charger and cable", "Shoulder strap", "Body cap"];
    if (variant.id === "kit") inBox = inBox.concat(["Kit lens with caps"]);
    inBox = inBox.concat(["[OTHER ITEMS]"]);

    // Frequently rented together
    var fbtSel = s.fbt || {};
    var fbtTotal = 0,
      fbtCount = 0;
    var fbt = FBT.map(function (f, i) {
      var p = byId(f.id);
      var on = !!fbtSel[f.id];
      if (on) {
        fbtTotal += p.rent;
        fbtCount += 1;
      }
      return {
        plus: i > 0,
        name: p.name,
        kind: p.kind,
        bg: p.bg,
        tag: f.tag,
        priceFmt: fmt(p.rent),
        checked: on,
        border: on ? "#2F7A3C" : "transparent",
        toggle: function () {
          var n = Object.assign({}, self.state.fbt);
          n[f.id] = !n[f.id];
          self.setState({ fbt: n, fbtAdded: false });
        },
      };
    });

    // Related (Top-products card style)
    var cardWish = s.cardWish || {};
    var related = RELATED.map(function (id) {
      var p = byId(id);
      var cm = (s.cardMode || {})[p.id];
      var showRent = !!p.rent && (p.rentOnly || cm === "rent");
      var w = !!cardWish[p.id];
      var setCard = function (m) {
        return function () {
          var n = Object.assign({}, self.state.cardMode);
          n[p.id] = m;
          self.setState({ cardMode: n });
        };
      };
      var tag = p.rent ? (p.rentOnly ? "For rent" : "Buy or rent") : p.was ? "Sale" : "Buy";
      return Object.assign({}, p, {
        canToggle: !!p.rent && !p.rentOnly,
        pickBuy: setCard("buy"),
        pickRent: setCard("rent"),
        buyAria: showRent ? "false" : "true",
        rentAria: showRent ? "true" : "false",
        buyBg: showRent ? "transparent" : "#FFFFFF",
        buyFg: showRent ? "#5E6470" : "#0D4F8B",
        rentBg: showRent ? "#2F7A3C" : "transparent",
        rentFg: showRent ? "#FFFFFF" : "#5E6470",
        main: showRent ? fmt(p.rent) : fmt(p.buy),
        unit: showRent ? "/ day" : "",
        sub: p.rent
          ? showRent
            ? "or buy " + fmt(p.buy)
            : "or rent " + fmt(p.rent) + "/day"
          : p.was
            ? "was " + fmt(p.was)
            : "Free delivery",
        tag: tag,
        tagBg: tag === "Sale" ? "#C42A1C" : p.rent ? "#2F7A3C" : "#FFFFFF",
        tagFg: tag === "Sale" || p.rent ? "#FFFFFF" : "#111318",
        cta: showRent ? "Rent" : "Add",
        addLabel: (showRent ? "Rent " : "Add to cart: ") + p.name,
        add: function () {
          addCart(showRent ? p.rent : p.buy, 1);
        },
        heartFill: w ? "#E0522B" : "none",
        heartStroke: w ? "#E0522B" : "#111318",
        wishAria: w ? "true" : "false",
        wishLabel: (w ? "Remove from" : "Save to") + " wishlist: " + p.name,
        toggleWish: function () {
          var n = Object.assign({}, self.state.cardWish);
          n[p.id] = !n[p.id];
          self.setState({ cardWish: n });
        },
      });
    });

    var wishCount =
      (s.wished ? 1 : 0) +
      Object.keys(cardWish).filter(function (k) {
        return cardWish[k];
      }).length;

    return {
      modes: modes,
      placeholder:
        searchMode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      wishCount: wishCount,
      cartCount: s.cartCount || 0,
      cartTotal: fmt(s.cartTotal || 0),

      shot: SHOTS[shotIdx],
      shotNo: "0" + (shotIdx + 1),
      thumbs: thumbs,
      prevShot: goShot(shotIdx - 1),
      nextShot: goShot(shotIdx + 1),
      shared: !!s.shared,
      share: function () {
        try {
          if (navigator.clipboard) navigator.clipboard.writeText(String(location.href)).catch(function () {});
        } catch (e) {}
        clearTimeout(self.shareTimer);
        self.setState({ shared: true });
        self.shareTimer = setTimeout(function () {
          self.setState({ shared: false });
        }, 2200);
      },
      toggleWish: function () {
        self.setState({ wished: !self.state.wished });
      },
      wishLabel: s.wished ? "Remove Lumen Z6 Camera from wishlist" : "Save Lumen Z6 Camera to wishlist",
      wishAria: s.wished ? "true" : "false",
      heartFill: s.wished ? "#E0522B" : "none",
      heartStroke: s.wished ? "#E0522B" : "#111318",

      openReviews: function () {
        self.setState({ tab: "reviews" });
      },

      isRent: isRent,
      isBuy: !isRent,
      pickBuy: function () {
        self.setState({ mode: "buy" });
      },
      pickRent: function () {
        self.setState({ mode: "rent" });
      },
      buyAria: isRent ? "false" : "true",
      rentAria: isRent ? "true" : "false",
      buyBg: isRent ? "transparent" : "#0D4F8B",
      buyFg: isRent ? "#3A3F4A" : "#FFFFFF",
      buySub: isRent ? "#5E6470" : "#D6E8F7",
      buyShadow: isRent ? "none" : "0 6px 16px -8px rgba(13,79,139,0.6)",
      rentBg: isRent ? "#2F7A3C" : "transparent",
      rentFg: isRent ? "#FFFFFF" : "#3A3F4A",
      rentSub: isRent ? "#E4F2E6" : "#5E6470",
      rentShadow: isRent ? "0 6px 16px -8px rgba(47,122,60,0.6)" : "none",

      durs: durs,
      durLabel: dur.label,
      startIso: iso(startD),
      minIso: iso(today),
      onStart: function (e) {
        var v = e && e.target ? e.target.value : "";
        if (parseIso(v)) self.setState({ start: v });
      },
      returnFmt: niceDate(returnD),
      addons: addons,
      addonCount: addonCount,
      rentalFmt: fmt(dur.price),
      addonFmt: fmt(addonTotal),
      rentTotalFmt: fmt(rentTotal),
      bookRental: function () {
        addCart(rentTotal, 1);
      },

      unitFmt: fmt(unit),
      variants: variants,
      qty: qty,
      decQty: function () {
        self.setState({ qty: Math.max(1, (self.state.qty || 1) - 1) });
      },
      incQty: function () {
        self.setState({ qty: Math.min(10, (self.state.qty || 1) + 1) });
      },
      subtotalFmt: fmt(unit * qty),
      addBuy: function () {
        addCart(unit * qty, qty);
      },

      cdH: String(Math.floor(leftMin / 60)),
      cdM: pad(leftMin % 60),
      cdDay: cdDay,
      fulfil: fulfil,

      tabs: tabs,
      tabOverview: tab === "overview",
      tabSpecs: tab === "specs",
      tabTerms: tab === "terms",
      tabReviews: tab === "reviews",
      inBox: inBox.map(function (l) {
        return { label: l };
      }),
      specs: SPECS.map(function (r) {
        return { k: r[0], v: r[1] };
      }),
      terms: TERMS.map(function (t, i) {
        return { n: "0" + (i + 1), title: t.title, body: t.body };
      }),
      dist: DIST,
      reviewPrompt: !!s.reviewPrompt,
      writeReview: function () {
        self.setState({ reviewPrompt: true });
      },

      fbt: fbt,
      fbtCount: fbtCount,
      fbtWord: fbtCount === 1 ? "item" : "items",
      fbtTotalFmt: fmt(fbtTotal),
      fbtNone: fbtCount === 0,
      fbtBtnBg: fbtCount === 0 ? "#9AA39C" : "#2F7A3C",
      fbtAdded: !!s.fbtAdded,
      addAll: function () {
        if (!fbtCount) return;
        addCart(fbtTotal, fbtCount);
        self.setState({ fbtAdded: true });
      },

      related: related,
    };
  }
}

function preventSubmit(e) {
  e.preventDefault();
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.lift{transition:transform .2s ease, box-shadow .2s ease}\n.lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(13,79,139,.3)}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.btn-o:hover{background:#EAF3FA;color:#0D4F8B}\n.ghost:hover{background:#F1F0EC}\n.nav a:hover{color:#0D4F8B}\n.opt:hover{border-color:#B9B5AC}\ninput[type=checkbox],input[type=radio]{accent-color:#2F7A3C;cursor:pointer}\n.rv{transition:transform .35s ease}\n@media (prefers-reduced-motion: reduce){.lift,.rv{transition:none}}\n";

export default class ProductScreen extends Component {
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
              <a href="#" style={{ color: "#E6F0F9" }}>
                Track order
              </a>
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
              <label htmlFor="d-search" className="sr-only">
                Search Simbatech
              </label>
              <input
                id="d-search"
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
                  {vals.cartCount}
                </span>
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
                <span style={{ fontSize: "12px", color: "#BFD8EE" }}>My cart</span>
                <span style={{ fontSize: "14px", fontWeight: "700" }} suppressHydrationWarning>
                  {vals.cartTotal}
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
            <Link href="/shop" style={{ color: "#0D4F8B", fontWeight: "600" }}>
              Electronics
            </Link>
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
          <nav aria-label="Breadcrumb" style={{ padding: "22px var(--gutter) 0", flexShrink: "0" }} data-sec="breadcrumb">
            {" "}
            <ol
              style={{
                margin: "0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                color: "#5E6470",
              }}
            >
              <li>
                <Link href="/" style={{ display: "flex", alignItems: "center", height: "28px" }}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true" style={{ display: "flex" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </li>
              <li>
                <Link href="/shop" style={{ display: "flex", alignItems: "center", height: "28px" }}>
                  Electronics
                </Link>
              </li>
              <li aria-hidden="true" style={{ display: "flex" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </li>
              <li>
                <Link href="/shop" style={{ display: "flex", alignItems: "center", height: "28px" }}>
                  Cameras
                </Link>
              </li>
              <li aria-hidden="true" style={{ display: "flex" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </li>
              <li aria-current="page" style={{ fontWeight: "600", color: "#111318" }}>
                Lumen Z6 Camera
              </li>
            </ol>{" "}
          </nav>
          <section
            style={{ padding: "20px var(--gutter) 0", display: "flex", gap: "56px", alignItems: "flex-start" }}
            data-row
            data-sec="product-hero"
          >
            <div
              style={{ width: "660px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "16px" }}
              data-w
              data-sec="left-gallery-delivery"
            >
              <div
                role="region"
                aria-label="Product images"
                style={{
                  position: "relative",
                  width: "660px",
                  height: "560px",
                  borderRadius: "32px",
                  overflow: "hidden",
                  background: vals.shot.bg,
                  transition: "background-color .4s ease",
                }}
                data-w
              >
                {" "}
                <div
                  style={{
                    position: "absolute",
                    left: "120px",
                    top: "70px",
                    width: "420px",
                    height: "420px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.5)",
                  }}
                  data-abs="deco"
                  data-w
                />{" "}
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    right: "0",
                    bottom: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-abs="art"
                >
                  <div
                    className="rv"
                    style={{ zoom: vals.shot.zoom, width: "200px", height: "200px", transform: `rotate(${vals.shot.rot})` }}
                  >
                    <Render kind={"camera"} />
                  </div>
                </div>{" "}
                <span
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    height: "32px",
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "999px",
                    background: "#2F7A3C",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                  data-abs="misc"
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
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                  Buy or rent
                </span>{" "}
                <div
                  style={{ position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px" }}
                  data-abs="misc"
                >
                  {vals.shared ? (
                    <>
                      <span
                        role="status"
                        style={{
                          height: "32px",
                          padding: "0 12px",
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          background: "#111318",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Link copied
                      </span>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={vals.share}
                    aria-label="Share this product"
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "none",
                      borderRadius: "999px",
                      background: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      color: "#111318",
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
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="18" cy="5" r="2.5" />
                      <circle cx="6" cy="12" r="2.5" />
                      <circle cx="18" cy="19" r="2.5" />
                      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={vals.toggleWish}
                    aria-label={vals.wishLabel}
                    aria-pressed={vals.wishAria}
                    style={{
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
                      fill={vals.heartFill}
                      stroke={vals.heartStroke}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                    </svg>
                  </button>
                </div>{" "}
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    right: "20px",
                    bottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  data-abs="misc"
                >
                  <span
                    style={{
                      height: "32px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.8)",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#111318",
                      fontVariantNumeric: "tabular-nums",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.shot.label}
                    {" · "}
                    {vals.shotNo}
                    {" / 04"}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={vals.prevShot}
                      aria-label="Previous image"
                      style={{
                        width: "44px",
                        height: "44px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        color: "#111318",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
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
                    </button>
                    <button
                      type="button"
                      onClick={vals.nextShot}
                      aria-label="Next image"
                      style={{
                        width: "44px",
                        height: "44px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#111318",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
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
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </div>{" "}
              </div>
              <div
                role="group"
                aria-label="Choose an image"
                style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" }}
                data-cols="4"
              >
                {(vals.thumbs || []).map((t, i0) => (
                  <Fragment key={i0}>
                    <button
                      type="button"
                      onClick={t.pick}
                      aria-label={`Show ${t.label}`}
                      aria-pressed={t.aria}
                      style={{
                        position: "relative",
                        height: "120px",
                        padding: "0",
                        border: `2px solid ${t.border}`,
                        borderRadius: "22px",
                        background: t.bg,
                        overflow: "hidden",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ zoom: t.zoom, width: "200px", height: "200px", transform: `rotate(${t.rot})` }}>
                        <Render kind={"camera"} />
                      </div>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  border: "1px solid #EFEDE8",
                  borderRadius: "24px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
                data-sec="delivery-estimator"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      flexShrink: "0",
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
                  <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>Deliver to [CITY]</span>
                    <span aria-live="off" style={{ fontSize: "14px", color: "#3A3F4A" }} suppressHydrationWarning>
                      {"Order in the next "}
                      <strong style={{ color: "#2F7A3C", fontVariantNumeric: "tabular-nums" }} suppressHydrationWarning>
                        {vals.cdH}
                        {"h "}
                        {vals.cdM}m
                      </strong>
                      {" for delivery "}
                      {vals.cdDay}
                    </span>
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="How to get it"
                  style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}
                  data-cols="2"
                >
                  {(vals.fulfil || []).map((f, i0) => (
                    <Fragment key={i0}>
                      <label
                        className="opt"
                        style={{
                          minHeight: "64px",
                          boxSizing: "border-box",
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          border: `1.5px solid ${f.border}`,
                          borderRadius: "16px",
                          background: f.bg,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="fulfil"
                          checked={f.checked}
                          onChange={f.pick}
                          style={{ width: "18px", height: "18px", margin: "0", flexShrink: "0" }}
                        />
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "700" }} suppressHydrationWarning>
                            {f.label}
                          </span>
                          <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                            {f.sub}
                          </span>
                        </span>
                      </label>
                    </Fragment>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    paddingTop: "16px",
                    borderTop: "1px solid #EFEDE8",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    color: "#3A3F4A",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0D4F8B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: "0", marginTop: "2px" }}
                  >
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                  <span>
                    <strong style={{ color: "#111318" }}>Returns:</strong>
                    {" buying? Free returns within [N] days. Renting? We collect it from your door on the return date."}
                  </span>
                </div>
              </div>
              <div
                style={{
                  border: "1px solid #EFEDE8",
                  borderRadius: "24px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  alignItems: "center",
                  height: "92px",
                }}
                data-cols="3"
                data-sec="assurance-row"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 18px" }}>
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      flexShrink: "0",
                      borderRadius: "12px",
                      background: "#FFF4C7",
                      color: "#8A6300",
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
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>Genuine + warranty</span>
                    <span style={{ fontSize: "12px", color: "#5E6470" }}>[TERM] warranty</span>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", borderLeft: "1px solid #EFEDE8" }}>
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      flexShrink: "0",
                      borderRadius: "12px",
                      background: "#E4F2E6",
                      color: "#2F7A3C",
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>{"Checked & cleaned"}</span>
                    <span style={{ fontSize: "12px", color: "#5E6470" }}>Before every rental</span>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", borderLeft: "1px solid #EFEDE8" }}>
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      flexShrink: "0",
                      borderRadius: "12px",
                      background: "#FFE4EF",
                      color: "#B0245F",
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
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>Secure payment</span>
                    <span style={{ fontSize: "12px", color: "#5E6470" }}>Telebirr or card</span>
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{ flexGrow: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "22px" }}
              data-sec="right-info-panel"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link
                  href="/shop"
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "0.3em",
                    color: "#111318",
                  }}
                >
                  <span style={{ width: "12px", height: "12px", borderRadius: "999px", border: "3px solid #111318" }} />
                  LUMEN
                </Link>
                <span style={{ fontSize: "13px", color: "#5E6470" }}>SKU [SKU]</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h1
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "44px",
                    lineHeight: "1",
                    fontWeight: "700",
                    letterSpacing: "-0.045em",
                  }}
                >
                  Lumen Z6 Camera
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "14px", color: "#3A3F4A" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "2px" }} aria-label="Rated 4.8 out of 5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                    </svg>
                    <span style={{ marginLeft: "6px", fontWeight: "700", color: "#111318" }}>4.8</span>
                  </span>
                  <a
                    href="#details"
                    onClick={vals.openReviews}
                    style={{
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      color: "#0D4F8B",
                      fontWeight: "600",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    [N] reviews
                  </a>
                  <span style={{ width: "1px", height: "16px", background: "#E6E4DE" }} />
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", color: "#2F7A3C" }}>
                    <span
                      style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#418D4D", boxShadow: "0 0 0 4px #E4F2E6" }}
                    />
                    In stock
                  </span>
                </div>
              </div>
              <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", color: "#3A3F4A" }}>
                A mirrorless camera for photos and 4K video. Rent it for a shoot, a wedding or a weekend away — or buy it to keep, with
                warranty. Every rental is checked, cleaned and charged before it reaches you.
              </p>
              <div
                role="group"
                aria-label="Buy or rent this camera"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "4px",
                  padding: "5px",
                  background: "#F3F2EE",
                  borderRadius: "18px",
                }}
                data-cols="2"
                data-sec="buy-rent-segmented"
              >
                <button
                  type="button"
                  onClick={vals.pickBuy}
                  aria-pressed={vals.buyAria}
                  style={{
                    height: "66px",
                    border: "none",
                    borderRadius: "14px",
                    background: vals.buyBg,
                    color: vals.buyFg,
                    font: "inherit",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    boxShadow: vals.buyShadow,
                  }}
                >
                  <span style={{ fontSize: "17px", fontWeight: "700" }}>Buy it</span>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: vals.buySub }}>ETB 139,000</span>
                </button>
                <button
                  type="button"
                  onClick={vals.pickRent}
                  aria-pressed={vals.rentAria}
                  style={{
                    height: "66px",
                    border: "none",
                    borderRadius: "14px",
                    background: vals.rentBg,
                    color: vals.rentFg,
                    font: "inherit",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    boxShadow: vals.rentShadow,
                  }}
                >
                  <span style={{ fontSize: "17px", fontWeight: "700" }}>Rent it</span>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: vals.rentSub }}>from ETB 2,500 / day</span>
                </button>
              </div>
              {vals.isRent ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "22px" }} data-sec="rent-mode">
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <span
                        id="dur-label"
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#2F7A3C",
                        }}
                      >
                        How long do you need it?
                      </span>
                      <div
                        role="group"
                        aria-labelledby="dur-label"
                        style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}
                        data-cols="4"
                      >
                        {(vals.durs || []).map((d, i0) => (
                          <Fragment key={i0}>
                            <button
                              type="button"
                              className="opt"
                              onClick={d.pick}
                              aria-pressed={d.aria}
                              style={{
                                height: "84px",
                                padding: "0 8px",
                                border: `2px solid ${d.border}`,
                                borderRadius: "16px",
                                background: d.bg,
                                font: "inherit",
                                color: "#111318",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "3px",
                              }}
                            >
                              <span style={{ fontSize: "15px", fontWeight: "700" }} suppressHydrationWarning>
                                {d.label}
                              </span>
                              <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                                {d.priceFmt}
                              </span>
                              <span
                                style={{ fontSize: "12px", fontWeight: "700", color: "#2F7A3C", minHeight: "15px" }}
                                suppressHydrationWarning
                              >
                                {d.save}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }} data-cols="2">
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label htmlFor="d-start" style={{ fontSize: "14px", fontWeight: "600" }}>
                          Start date
                        </label>
                        <input
                          id="d-start"
                          type="date"
                          value={vals.startIso}
                          min={vals.minIso}
                          onChange={vals.onStart}
                          style={{
                            height: "52px",
                            boxSizing: "border-box",
                            padding: "0 14px",
                            border: "1.5px solid #E6E4DE",
                            borderRadius: "14px",
                            background: "#FFFFFF",
                            font: "inherit",
                            fontSize: "15px",
                            color: "#111318",
                          }}
                          suppressHydrationWarning
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>Return by</span>
                        <div
                          aria-live="polite"
                          style={{
                            height: "52px",
                            boxSizing: "border-box",
                            padding: "0 14px",
                            borderRadius: "14px",
                            background: "#E4F2E6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "15px", fontWeight: "700", color: "#111318" }} suppressHydrationWarning>
                            {vals.returnFmt}
                          </span>
                          <span style={{ fontSize: "12px", color: "#2F7A3C", fontWeight: "600" }}>We collect</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                        {"Add-ons "}
                        <span style={{ fontWeight: "400", color: "#5E6470" }}>· charged per day</span>
                      </span>
                      {(vals.addons || []).map((a, i0) => (
                        <Fragment key={i0}>
                          <label
                            className="opt"
                            style={{
                              minHeight: "56px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                              border: `1.5px solid ${a.border}`,
                              borderRadius: "14px",
                              background: a.bg,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={a.checked}
                              onChange={a.toggle}
                              style={{ width: "20px", height: "20px", margin: "0", flexShrink: "0" }}
                            />
                            <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "1px" }}>
                              <span style={{ fontSize: "15px", fontWeight: "600" }} suppressHydrationWarning>
                                {a.label}
                              </span>
                              <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                                {a.note}
                              </span>
                            </span>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#2F7A3C" }} suppressHydrationWarning>
                              +{a.priceFmt}/day
                            </span>
                          </label>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      aria-live="polite"
                      style={{
                        background: "#F6F5F1",
                        borderRadius: "20px",
                        padding: "22px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        fontSize: "15px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#3A3F4A" }} suppressHydrationWarning>
                          {"Rental · "}
                          {vals.durLabel}
                        </span>
                        <span style={{ fontWeight: "600" }} suppressHydrationWarning>
                          {vals.rentalFmt}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#3A3F4A" }} suppressHydrationWarning>
                          Add-ons ({vals.addonCount})
                        </span>
                        <span style={{ fontWeight: "600" }} suppressHydrationWarning>
                          {vals.addonFmt}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#3A3F4A" }}>Refundable deposit</span>
                        <span style={{ fontWeight: "600" }}>ETB [X]</span>
                      </div>
                      <div style={{ height: "1px", background: "#E6E4DE" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontWeight: "700" }}>Total</span>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "30px",
                            fontWeight: "700",
                            letterSpacing: "-0.03em",
                          }}
                          suppressHydrationWarning
                        >
                          {vals.rentTotalFmt}
                        </span>
                      </div>
                      <span style={{ fontSize: "13px", color: "#5E6470", marginTop: "-6px" }}>
                        Plus the refundable deposit, returned after we collect the camera.
                      </span>
                    </div>
                    <Link
                      href="/cart"
                      className="btn-y"
                      onClick={vals.bookRental}
                      style={{
                        height: "58px",
                        borderRadius: "14px",
                        background: "#2F7A3C",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        fontSize: "16px",
                        fontWeight: "700",
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
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18M8 3v4M16 3v4" />
                      </svg>
                      {"Book rental · "}
                      {vals.rentTotalFmt}
                    </Link>
                    <span style={{ fontSize: "13px", color: "#5E6470", textAlign: "center", marginTop: "-10px" }}>
                      Free cancellation up to [N] hours before delivery.
                    </span>
                  </div>
                </>
              ) : null}
              {vals.isBuy ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "22px" }} data-sec="buy-mode">
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span
                        aria-live="polite"
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "40px",
                          lineHeight: "1",
                          fontWeight: "700",
                          letterSpacing: "-0.04em",
                          color: "#0D4F8B",
                        }}
                        suppressHydrationWarning
                      >
                        {vals.unitFmt}
                      </span>
                      <span style={{ fontSize: "14px", color: "#3A3F4A" }}>
                        {"or "}
                        <strong>ETB [X]/month</strong>
                        {" over [TERM] with instalments · Free delivery"}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <span
                        id="var-label"
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#0D4F8B",
                        }}
                      >
                        Choose a set
                      </span>
                      <div
                        role="group"
                        aria-labelledby="var-label"
                        style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}
                        data-cols="2"
                      >
                        {(vals.variants || []).map((v, i0) => (
                          <Fragment key={i0}>
                            <button
                              type="button"
                              className="opt"
                              onClick={v.pick}
                              aria-pressed={v.aria}
                              style={{
                                height: "76px",
                                padding: "0 16px",
                                border: `2px solid ${v.border}`,
                                borderRadius: "16px",
                                background: v.bg,
                                font: "inherit",
                                color: "#111318",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                textAlign: "left",
                              }}
                            >
                              <span
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  flexShrink: "0",
                                  borderRadius: "12px",
                                  background: "#E0F1FF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <div style={{ zoom: "0.26", width: "200px", height: "200px" }}>
                                  <Render kind={"camera"} />
                                </div>
                              </span>
                              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontSize: "15px", fontWeight: "700" }} suppressHydrationWarning>
                                  {v.label}
                                </span>
                                <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                                  {v.sub}
                                </span>
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <span id="qty-label" style={{ fontSize: "14px", fontWeight: "600" }}>
                          Quantity
                        </span>
                        <div
                          role="group"
                          aria-labelledby="qty-label"
                          style={{
                            height: "52px",
                            display: "flex",
                            alignItems: "center",
                            border: "1.5px solid #E6E4DE",
                            borderRadius: "14px",
                            padding: "0 4px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={vals.decQty}
                            aria-label="Decrease quantity"
                            style={{
                              width: "44px",
                              height: "44px",
                              border: "none",
                              borderRadius: "10px",
                              background: "transparent",
                              color: "#111318",
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
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span
                            aria-live="polite"
                            style={{
                              minWidth: "36px",
                              textAlign: "center",
                              fontSize: "16px",
                              fontWeight: "700",
                              fontVariantNumeric: "tabular-nums",
                            }}
                            suppressHydrationWarning
                          >
                            {vals.qty}
                          </span>
                          <button
                            type="button"
                            onClick={vals.incQty}
                            aria-label="Increase quantity"
                            style={{
                              width: "44px",
                              height: "44px",
                              border: "none",
                              borderRadius: "10px",
                              background: "transparent",
                              color: "#111318",
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
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <span style={{ fontSize: "15px", color: "#3A3F4A" }}>
                        {"Subtotal "}
                        <strong style={{ color: "#111318", fontSize: "18px" }} suppressHydrationWarning>
                          {vals.subtotalFmt}
                        </strong>
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Link
                        href="/cart"
                        className="btn-t"
                        onClick={vals.addBuy}
                        style={{
                          flexGrow: "1",
                          height: "58px",
                          borderRadius: "14px",
                          background: "#0D4F8B",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 8h14l-1.2 12H6.2L5 8z" />
                          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                        </svg>
                        Add to cart
                      </Link>
                      <Link
                        href="/checkout"
                        className="btn-o"
                        style={{
                          width: "190px",
                          height: "58px",
                          boxSizing: "border-box",
                          border: "1.5px solid #0D4F8B",
                          borderRadius: "14px",
                          color: "#0D4F8B",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        Buy now
                      </Link>
                    </div>
                    <span style={{ fontSize: "13px", color: "#5E6470", textAlign: "center", marginTop: "-10px" }}>
                      Genuine, sealed stock with [TERM] manufacturer warranty.
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </section>
          <section
            id="details"
            style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "28px" }}
            data-sec="tabs"
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Product details
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
                  Everything about the Z6
                </h2>
              </div>
              <div
                role="tablist"
                aria-label="Product information"
                style={{ display: "flex", gap: "4px", padding: "4px", background: "#F3F2EE", borderRadius: "14px" }}
              >
                {(vals.tabs || []).map((t, i0) => (
                  <Fragment key={i0}>
                    <button
                      type="button"
                      role="tab"
                      id={t.tabId}
                      aria-controls={t.panelId}
                      onClick={t.pick}
                      aria-selected={t.aria}
                      style={{
                        height: "44px",
                        padding: "0 20px",
                        border: "none",
                        borderRadius: "11px",
                        background: t.bg,
                        color: t.fg,
                        font: "inherit",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: t.shadow,
                      }}
                      suppressHydrationWarning
                    >
                      {t.label}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              style={{ minHeight: "460px", boxSizing: "border-box", border: "1px solid #EFEDE8", borderRadius: "28px", padding: "40px" }}
            >
              {" "}
              {vals.tabOverview ? (
                <>
                  {" "}
                  <div
                    role="tabpanel"
                    id="panel-overview"
                    aria-labelledby="tab-overview"
                    style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "40px" }}
                    data-cols="12"
                  >
                    <div style={{ gridColumn: "span 7", display: "flex", flexDirection: "column", gap: "18px" }} data-span="7">
                      <h3
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "28px",
                          fontWeight: "700",
                          letterSpacing: "-0.035em",
                        }}
                      >
                        About the Lumen Z6
                      </h3>
                      <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.65", color: "#3A3F4A" }}>
                        [PRODUCT DESCRIPTION — two or three short paragraphs from the supplier: what the camera is for, who it suits, and
                        what makes it stand out.]
                      </p>
                      <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.65", color: "#3A3F4A" }}>
                        {
                          "Renting? Your Z6 arrives with a charged battery and a formatted memory card slot, ready to shoot. Buying? It ships sealed, with the manufacturer's warranty."
                        }
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "6px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>Popular for</span>
                        <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          <li
                            style={{
                              height: "34px",
                              padding: "0 14px",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "999px",
                              background: "#F3F2EE",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#3A3F4A",
                            }}
                          >
                            {"Weddings & events"}
                          </li>
                          <li
                            style={{
                              height: "34px",
                              padding: "0 14px",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "999px",
                              background: "#F3F2EE",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#3A3F4A",
                            }}
                          >
                            Travel
                          </li>
                          <li
                            style={{
                              height: "34px",
                              padding: "0 14px",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "999px",
                              background: "#F3F2EE",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#3A3F4A",
                            }}
                          >
                            Content creation
                          </li>
                          <li
                            style={{
                              height: "34px",
                              padding: "0 14px",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "999px",
                              background: "#F3F2EE",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#3A3F4A",
                            }}
                          >
                            Product shoots
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div
                      style={{
                        gridColumn: "span 5",
                        background: "#F6F5F1",
                        borderRadius: "24px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                      data-span="5"
                    >
                      <h3
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "22px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        In the box
                      </h3>
                      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {(vals.inBox || []).map((b, i0) => (
                          <Fragment key={i0}>
                            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px" }} suppressHydrationWarning>
                              <span
                                style={{
                                  width: "26px",
                                  height: "26px",
                                  flexShrink: "0",
                                  borderRadius: "8px",
                                  background: "#E4F2E6",
                                  color: "#2F7A3C",
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
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M5 12l5 5 9-10" />
                                </svg>
                              </span>
                              {b.label}
                            </li>
                          </Fragment>
                        ))}
                      </ul>
                      <span style={{ fontSize: "13px", color: "#5E6470" }}>
                        Rentals ship with the same contents, checked before every booking.
                      </span>
                    </div>
                  </div>{" "}
                </>
              ) : null}{" "}
              {vals.tabSpecs ? (
                <>
                  {" "}
                  <div
                    role="tabpanel"
                    id="panel-specs"
                    aria-labelledby="tab-specs"
                    style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                  >
                    <h3
                      style={{
                        margin: "0",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "28px",
                        fontWeight: "700",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      Specifications
                    </h3>
                    <dl
                      style={{ margin: "0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: "48px" }}
                      data-cols="2"
                    >
                      {(vals.specs || []).map((sp, i0) => (
                        <Fragment key={i0}>
                          <div
                            style={{
                              height: "52px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #EFEDE8",
                              fontSize: "15px",
                            }}
                          >
                            <dt style={{ color: "#5E6470" }} suppressHydrationWarning>
                              {sp.k}
                            </dt>
                            <dd style={{ margin: "0", fontWeight: "600", color: "#111318" }} suppressHydrationWarning>
                              {sp.v}
                            </dd>
                          </div>
                        </Fragment>
                      ))}
                    </dl>
                    <span style={{ fontSize: "13px", color: "#5E6470" }}>
                      Specifications to be confirmed with the supplier before launch.
                    </span>
                  </div>{" "}
                </>
              ) : null}{" "}
              {vals.tabTerms ? (
                <>
                  {" "}
                  <div
                    role="tabpanel"
                    id="panel-terms"
                    aria-labelledby="tab-terms"
                    style={{ display: "flex", flexDirection: "column", gap: "22px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h3
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "28px",
                          fontWeight: "700",
                          letterSpacing: "-0.035em",
                        }}
                      >
                        Rental terms
                      </h3>
                      <a
                        href="#"
                        style={{
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#2F7A3C",
                        }}
                      >
                        Read the full rental terms
                      </a>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }} data-cols="2">
                      {(vals.terms || []).map((tm, i0) => (
                        <Fragment key={i0}>
                          <div style={{ background: "#F6F5F1", borderRadius: "22px", padding: "24px", display: "flex", gap: "16px" }}>
                            <span
                              style={{
                                width: "44px",
                                height: "44px",
                                flexShrink: "0",
                                borderRadius: "12px",
                                background: "#E4F2E6",
                                color: "#2F7A3C",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: "18px",
                                fontWeight: "700",
                              }}
                              suppressHydrationWarning
                            >
                              {tm.n}
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ fontSize: "17px", fontWeight: "700" }} suppressHydrationWarning>
                                {tm.title}
                              </span>
                              <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#3A3F4A" }} suppressHydrationWarning>
                                {tm.body}
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>{" "}
                </>
              ) : null}{" "}
              {vals.tabReviews ? (
                <>
                  {" "}
                  <div
                    role="tabpanel"
                    id="panel-reviews"
                    aria-labelledby="tab-reviews"
                    style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "40px" }}
                    data-cols="12"
                  >
                    <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "16px" }} data-span="4">
                      <h3
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "28px",
                          fontWeight: "700",
                          letterSpacing: "-0.035em",
                        }}
                      >
                        Customer reviews
                      </h3>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "56px",
                            lineHeight: "1",
                            fontWeight: "700",
                            letterSpacing: "-0.04em",
                          }}
                        >
                          4.8
                        </span>
                        <span style={{ fontSize: "15px", color: "#5E6470" }}>out of 5 · [N] reviews</span>
                      </div>
                      <ul
                        aria-label="Rating distribution (placeholder)"
                        style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}
                      >
                        {(vals.dist || []).map((ds, i0) => (
                          <Fragment key={i0}>
                            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#3A3F4A" }}>
                              <span
                                style={{ width: "44px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}
                                suppressHydrationWarning
                              >
                                {ds.stars}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                                  <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                                </svg>
                              </span>
                              <span
                                style={{ flexGrow: "1", height: "10px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}
                              >
                                <span
                                  style={{
                                    display: "block",
                                    height: "10px",
                                    width: ds.w,
                                    borderRadius: "999px",
                                    background: "repeating-linear-gradient(45deg, #D6D2C9 0 6px, #E8E5DE 6px 12px)",
                                  }}
                                />
                              </span>
                              <span style={{ width: "36px", textAlign: "right", color: "#5E6470" }}>[%]</span>
                            </li>
                          </Fragment>
                        ))}
                      </ul>
                      <span style={{ fontSize: "12px", color: "#5E6470" }}>
                        Placeholder bars — the real distribution appears once reviews are in.
                      </span>
                    </div>
                    <div
                      style={{
                        gridColumn: "span 8",
                        border: "1.5px dashed #D9D6CE",
                        borderRadius: "24px",
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "14px",
                        textAlign: "center",
                      }}
                      data-span="8"
                    >
                      <span
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "20px",
                          background: "#EAF3FA",
                          color: "#0D4F8B",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
                          <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
                        </svg>
                      </span>
                      <span
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "24px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        Reviews will appear here
                      </span>
                      <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#5E6470", maxWidth: "420px" }}>
                        Customers who bought or rented the Lumen Z6 can share how it went after their order.
                      </span>
                      <button
                        type="button"
                        className="btn-t"
                        onClick={vals.writeReview}
                        style={{
                          height: "48px",
                          padding: "0 22px",
                          border: "none",
                          borderRadius: "14px",
                          background: "#0D4F8B",
                          color: "#FFFFFF",
                          font: "inherit",
                          fontSize: "15px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
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
                          <path d="M4 20h4L19 9l-4-4L4 16v4z" />
                        </svg>
                        Write a review
                      </button>
                      {vals.reviewPrompt ? (
                        <>
                          <span role="status" style={{ fontSize: "14px", color: "#3A3F4A" }}>
                            <Link
                              href="/signin"
                              style={{ color: "#0D4F8B", fontWeight: "700", textDecoration: "underline", textUnderlineOffset: "3px" }}
                            >
                              Sign in
                            </Link>
                            {" to review a product you bought or rented."}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>{" "}
                </>
              ) : null}{" "}
            </div>
          </section>
          <section style={{ padding: "96px var(--gutter) 0" }} data-sec="frequently-rented-together">
            {" "}
            <div
              style={{
                background: "#F6F5F1",
                borderRadius: "36px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span
                    style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2F7A3C" }}
                  >
                    Rent the set
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
                    {"Frequently rented "}
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: "400", color: "#2F7A3C" }}>
                      together
                    </span>
                  </h2>
                </div>
                <span style={{ fontSize: "15px", color: "#5E6470" }}>Tick what you need. Prices are per day.</span>
              </div>
              <div style={{ display: "flex", alignItems: "stretch", gap: "14px" }}>
                {(vals.fbt || []).map((f, i0) => (
                  <Fragment key={i0}>
                    {f.plus ? (
                      <>
                        <span
                          aria-hidden="true"
                          style={{
                            alignSelf: "center",
                            width: "36px",
                            height: "36px",
                            flexShrink: "0",
                            borderRadius: "999px",
                            background: "#FFFFFF",
                            color: "#5E6470",
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
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </>
                    ) : null}
                    <label
                      style={{
                        width: "232px",
                        flexShrink: "0",
                        boxSizing: "border-box",
                        padding: "12px 12px 16px",
                        border: `2px solid ${f.border}`,
                        borderRadius: "24px",
                        background: "#FFFFFF",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          height: "150px",
                          borderRadius: "18px",
                          background: f.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={f.checked}
                          onChange={f.toggle}
                          style={{ position: "absolute", top: "12px", left: "12px", width: "22px", height: "22px", margin: "0" }}
                          data-abs="deco"
                        />
                        <span style={{ display: "block", zoom: "0.66", width: "200px", height: "200px" }}>
                          <Render kind={f.kind} />
                        </span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }} suppressHydrationWarning>
                          {f.tag}
                        </span>
                        <span style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" }} suppressHydrationWarning>
                          {f.name}
                        </span>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#2F7A3C" }} suppressHydrationWarning>
                          {f.priceFmt} <span style={{ fontSize: "13px", fontWeight: "500", color: "#5E6470" }}>/ day</span>
                        </span>
                      </span>
                    </label>
                  </Fragment>
                ))}
                <div style={{ flexGrow: "1" }} />
                <div
                  style={{
                    width: "340px",
                    flexShrink: "0",
                    boxSizing: "border-box",
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "18px",
                  }}
                  data-w
                >
                  <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "14px", color: "#5E6470" }} suppressHydrationWarning>
                      {vals.fbtCount} {vals.fbtWord}
                      {" selected"}
                    </span>
                    <span style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "40px",
                          lineHeight: "1",
                          fontWeight: "700",
                          letterSpacing: "-0.04em",
                        }}
                        suppressHydrationWarning
                      >
                        {vals.fbtTotalFmt}
                      </span>
                      <span style={{ fontSize: "15px", color: "#5E6470" }}>/ day</span>
                    </span>
                    <span style={{ fontSize: "13px", color: "#5E6470" }}>Plus refundable deposits, ETB [X] each.</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button
                      type="button"
                      className="btn-y"
                      onClick={vals.addAll}
                      disabled={vals.fbtNone}
                      style={{
                        height: "54px",
                        border: "none",
                        borderRadius: "14px",
                        background: vals.fbtBtnBg,
                        color: "#FFFFFF",
                        font: "inherit",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 8h14l-1.2 12H6.2L5 8z" />
                        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                      </svg>
                      Add all to cart
                    </button>
                    {vals.fbtAdded ? (
                      <>
                        <span role="status" style={{ fontSize: "13px", color: "#2F7A3C", fontWeight: "600", textAlign: "center" }}>
                          {"Added to your cart · "}
                          <Link href="/cart" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                            View cart
                          </Link>
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>{" "}
          </section>
          <section
            style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }}
            data-sec="you-might-also-need"
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Complete the kit
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
                View all
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
              {(vals.related || []).map((p, i0) => (
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
                        width: "40px",
                        height: "40px",
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
                      {p.canToggle ? (
                        <>
                          <div
                            role="group"
                            aria-label={`Buy or rent ${p.name}`}
                            style={{
                              alignSelf: "flex-start",
                              display: "flex",
                              gap: "2px",
                              padding: "3px",
                              marginTop: "2px",
                              background: "#F3F2EE",
                              borderRadius: "10px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={p.pickBuy}
                              aria-pressed={p.buyAria}
                              style={{
                                height: "28px",
                                padding: "0 12px",
                                border: "none",
                                borderRadius: "8px",
                                background: p.buyBg,
                                color: p.buyFg,
                                font: "inherit",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                              }}
                            >
                              Buy
                            </button>
                            <button
                              type="button"
                              onClick={p.pickRent}
                              aria-pressed={p.rentAria}
                              style={{
                                height: "28px",
                                padding: "0 12px",
                                border: "none",
                                borderRadius: "8px",
                                background: p.rentBg,
                                color: p.rentFg,
                                font: "inherit",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                              }}
                            >
                              Rent
                            </button>
                          </div>
                        </>
                      ) : null}
                      <div
                        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "10px", paddingTop: "6px" }}
                      >
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <span style={{ fontSize: "18px", fontWeight: "700" }} suppressHydrationWarning>
                              {p.main}
                            </span>
                            <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                              {p.unit}
                            </span>
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
                            height: "42px",
                            padding: "0 14px",
                            border: "none",
                            borderRadius: "12px",
                            background: "#0D4F8B",
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

"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import { DEPTS } from "@/lib/menu";
import SiteFooter from "@/components/SiteFooter";
import { shopState, connectShop, headerVals, submitSearch, navigate, storeVals, cart, wishlist } from "@/lib/client/store";
import { rentalBasePrice, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

// Short labels for the rent-vs-buy calculator, by product kind (falls back to the product name).
var CALC_LABELS = { camera: "Camera", tent: "Party tent", drill: "Drill", bike: "Bike" };
// The design's order for the calculator items and the "Shop by category" tiles.
var CALC_ORDER = ["camera", "tent", "drill"];
var CAT_ORDER = ["Electronics", "Phones", "Home & Living", "Kitchen", "Fashion", "Beauty", "Tools & DIY", "Events & Party"];
var TABS = [
  { id: "best", label: "Best sellers" },
  { id: "new", label: "New arrivals" },
  { id: "rent", label: "Most rented" },
];
function shopHref(params) {
  var q = Object.keys(params)
    .map(function (k) {
      return k + "=" + encodeURIComponent(params[k]);
    })
    .join("&");
  return "/shop" + (q ? "?" + q : "");
}
function deptHref(name) {
  return shopHref({ dept: name });
}
var SLIDES = [
  {
    eyebrow: "New season 2026",
    title: "Own it. Rent it.",
    accent: "Get it today.",
    sub: "Electronics, home, fashion, tools and event gear — shop to keep, or rent by the day. Delivered to your door.",
    cta1: "Shop now",
    href1: "/shop",
    cta2: "Rent something",
    href2: "/shop?mode=rent",
    chipKind: "camera",
    chipRent: true,
    bg: "#0D4F8B",
    circle: "#1A62A8",
    k1: "camera",
    k2: "headphones",
    k3: "sneaker",
    chipName: "Lumen Z6 Camera",
    chipPrice: "ETB 2,500 / day",
  },
  {
    eyebrow: "Weekend rentals",
    title: "Party this weekend?",
    accent: "Rent the gear.",
    sub: "Tents, chairs, sound and lights — delivered, set up and collected when you are done.",
    cta1: "See event bundles",
    href1: deptHref("Events & Party"),
    cta2: "Browse rentals",
    href2: "/shop?mode=rent",
    chipKind: "tent",
    bg: "#1F5E33",
    circle: "#2F7A3C",
    k1: "tent",
    k2: "blocks",
    k3: "camera",
    chipName: "Garden party bundle",
    chipPrice: "from ETB 6,500 / day",
  },
  {
    eyebrow: "Home refresh",
    title: "Make your home",
    accent: "feel brand new.",
    sub: "Sofas, coffee machines and everyday essentials, with free delivery over ETB [X].",
    cta1: "Shop home",
    href1: deptHref("Home & Living"),
    cta2: "View offers",
    href2: "/shop",
    chipKind: "sofa",
    bg: "#1B2230",
    circle: "#2A3345",
    k1: "sofa",
    k2: "espresso",
    k3: "skincare",
    chipName: "Linen 3-Seater Sofa",
    chipPrice: "ETB 84,900",
  },
];
// The hero chip and the Events & Party promo quote the "Garden party" bundle's real price.
var HERO_BUNDLE = "Garden party";
var DUR = (4 * 3600 + 12 * 60 + 36) * 1000;
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
function byKind(list, kind) {
  return list.filter(function (p) {
    return p.kind === kind;
  })[0];
}
function tomorrowISO() {
  var d = new Date();
  d.setDate(d.getDate() + 1);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.end = Date.now() + DUR;
    this.lastSlide = Date.now();
    this.state = {
      mode: "buy",
      tab: "best",
      calc: null,
      days: 4,
      busy: {},
      done: {},
      errs: {},
      now: Date.now(),
      slide: 0,
      heroPaused: false,
      menuOpen: false,
      dept: 0,
      cardMode: {},
    };
  }
  componentDidMount() {
    var self = this;
    this.unsubShop = connectShop(this);
    var reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}
    this.timer = setInterval(function () {
      var now = Date.now();
      var upd = { now: now };
      var st = self.state || {};
      if (!reduce && !st.heroPaused && !st.menuOpen && now - self.lastSlide >= 6000) {
        upd.slide = ((st.slide || 0) + 1) % SLIDES.length;
        self.lastSlide = now;
      }
      self.setState(upd);
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.unsubShop && this.unsubShop();
    (this.flashTimers || []).forEach(clearTimeout);
  }
  // Runs a store action for one control: disables it while pending, shows "Added" for ~1.5s (or until the next action
  // when `keepDone` is set), keeps the error message.
  runAction(key, fn, keepDone) {
    var self = this;
    if (self.state.busy[key]) return;
    var patch = function (field, value) {
      var n = Object.assign({}, self.state[field]);
      if (value) n[key] = value;
      else delete n[key];
      var o = {};
      o[field] = n;
      return o;
    };
    self.setState(Object.assign(patch("busy", true), patch("errs", null), patch("done", null)));
    Promise.resolve()
      .then(fn)
      .then(
        function () {
          self.setState(Object.assign(patch("busy", null), patch("done", true)));
          if (keepDone) return;
          self.flashTimers = self.flashTimers || [];
          self.flashTimers.push(
            setTimeout(function () {
              self.setState(patch("done", null));
            }, 1500),
          );
        },
        function (err) {
          self.setState(
            Object.assign(patch("busy", null), patch("errs", (err && err.message) || "Something went wrong. Please try again.")),
          );
        },
      );
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var initial = this.props.initial || {};
    var P = initial.products || [];
    var shop = shopState(initial);
    var hv = headerVals(shop);
    var store = storeVals(shop);
    var freeOverFmt = fmt(FREE_DELIVERY_THRESHOLD);
    var busy = s.busy || {};
    var done = s.done || {};
    var errs = s.errs || {};
    var BUNDLES = initial.bundles || [];
    var heroBundle = BUNDLES.filter(function (b) {
      return b.name === HERO_BUNDLE;
    })[0];
    var addToCart = function (key, p, mode) {
      return function () {
        self.runAction(key, function () {
          return mode === "rent"
            ? cart.add({ productId: p.id, mode: "rent", qty: 1, rentStart: tomorrowISO(), rentDays: 1 })
            : cart.add({ productId: p.id, mode: "buy", qty: 1 });
        });
      };
    };
    var productHref = function (p) {
      return p ? "/product/" + p.id : "/shop";
    };

    var left = Math.max(0, (this.end || Date.now() + DUR) - (s.now || Date.now()));
    var secs = Math.floor(left / 1000);

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

    var flash = P.filter(function (p) {
      return !!p.was && !p.rentOnly;
    })
      .slice(0, 5)
      .map(function (p) {
        var key = "flash:" + p.id;
        return Object.assign({}, p, {
          href: productHref(p),
          priceFmt: fmt(p.buy),
          wasFmt: fmt(p.was),
          discount: "-" + Math.round((1 - p.buy / p.was) * 100) + "%",
          soldPct: p.sold + "%",
          add: addToCart(key, p, "buy"),
          busy: !!busy[key],
          addText: busy[key] ? "Adding…" : done[key] ? "Added" : "Add to cart",
          err: errs[key] || "",
        });
      });

    var tab = s.tab || "best";
    var tabList =
      tab === "new"
        ? P.slice().reverse()
        : tab === "rent"
          ? P.filter(function (p) {
              return !!p.rent;
            })
          : P.slice().sort(function (a, b) {
              return parseFloat(b.rating) - parseFloat(a.rating) || b.reviews - a.reviews;
            });
    var tabs = TABS.map(function (t) {
      var on = t.id === tab;
      return {
        label: t.label,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#111318" : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        pick: function () {
          self.setState({ tab: t.id });
        },
      };
    });
    var top = tabList.slice(0, 8).map(function (p) {
      var key = "top:" + p.id;
      var cm = (s.cardMode || {})[p.id];
      var showRent = !!p.rent && (p.rentOnly || (cm ? cm === "rent" : tab === "rent"));
      var w = wishlist.has(shop, p.id);
      var setCard = function (m) {
        return function () {
          var n = Object.assign({}, self.state.cardMode);
          n[p.id] = m;
          self.setState({ cardMode: n });
        };
      };
      var toggleFields = {
        canToggle: !!p.rent && !p.rentOnly,
        pickBuy: setCard("buy"),
        pickRent: setCard("rent"),
        buyAria: showRent ? "false" : "true",
        rentAria: showRent ? "true" : "false",
        buyBg: showRent ? "transparent" : "#FFFFFF",
        buyFg: showRent ? "#5E6470" : "#0D4F8B",
        rentBg: showRent ? "#2F7A3C" : "transparent",
        rentFg: showRent ? "#FFFFFF" : "#5E6470",
      };
      var tag = p.rent ? (p.rentOnly ? "For rent" : "Buy or rent") : p.was ? "Sale" : "Buy";
      return Object.assign({}, p, toggleFields, {
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
        href: productHref(p),
        cta: busy[key] ? "…" : done[key] ? "Added" : showRent ? "Rent" : "Add",
        addLabel: (showRent ? "Rent for 1 day from tomorrow: " : "Add to cart: ") + p.name,
        add: addToCart(key, p, showRent ? "rent" : "buy"),
        busy: !!busy[key],
        err: errs[key] || "",
        heartFill: w ? "#E0522B" : "none",
        heartStroke: w ? "#E0522B" : "#111318",
        wishAria: w ? "true" : "false",
        wishLabel: (w ? "Remove from" : "Save to") + " wishlist: " + p.name,
        toggleWish: function () {
          var n = Object.assign({}, self.state.errs);
          delete n[key];
          self.setState({ errs: n });
          wishlist.toggle(p.id).catch(function (err) {
            var e = Object.assign({}, self.state.errs);
            e[key] = (err && err.message) || "Could not update your wishlist.";
            self.setState({ errs: e });
          });
        },
      });
    });

    var CALC = P.filter(function (p) {
      return !!p.rent;
    })
      .slice()
      .sort(function (a, b) {
        var ia = CALC_ORDER.indexOf(a.kind),
          ib = CALC_ORDER.indexOf(b.kind);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      })
      .map(function (p) {
        return {
          id: p.id,
          label: CALC_LABELS[p.kind] || p.name,
          name: p.name,
          kind: p.kind,
          rate: p.rent,
          buy: p.buy,
          plans: p.plans || [],
        };
      });
    var defCalc = byKind(CALC, "tent") || CALC[0];
    var calcId = s.calc || (defCalc && defCalc.id);
    var c =
      CALC.filter(function (x) {
        return x.id === calcId;
      })[0] || defCalc;
    var days = s.days || 4;
    var calc = null;
    if (c) {
      var rentTotal = rentalBasePrice(c.rate, c.plans, days);
      var maxV = Math.max(rentTotal, c.buy);
      var saves = c.buy - rentTotal;
      var breakEven = Math.ceil(c.buy / c.rate);
      for (var d = 1; d <= 365; d++) {
        if (rentalBasePrice(c.rate, c.plans, d) >= c.buy) {
          breakEven = d;
          break;
        }
      }
      var rentWins = saves > 0;
      calc = {
        kind: c.kind,
        name: c.name,
        href: "/product/" + c.id,
        rateFmt: fmt(c.rate),
        buyFmt: fmt(c.buy),
        rentTotalFmt: fmt(rentTotal),
        rentPct: Math.max(4, Math.round((rentTotal / maxV) * 100)) + "%",
        buyPct: Math.max(4, Math.round((c.buy / maxV) * 100)) + "%",
        verdict: rentWins ? "Renting saves you " + fmt(saves) : "Buying is the better deal",
        verdictSub: rentWins ? "Buying only pays off after " + breakEven + " days." : "After " + breakEven + " days, owning it costs less.",
        verdictBg: rentWins ? "#E4F2E6" : "#EAF3FA",
        verdictFg: rentWins ? "#2F7A3C" : "#0D4F8B",
        cta: rentWins ? "Rent it" : "Buy it",
      };
    }
    if (!calc)
      calc = {
        kind: "camera",
        name: "",
        href: "/shop?mode=rent",
        rateFmt: fmt(0),
        buyFmt: fmt(0),
        rentTotalFmt: fmt(0),
        rentPct: "4%",
        buyPct: "4%",
        verdict: "",
        verdictSub: "",
        verdictBg: "#EAF3FA",
        verdictFg: "#0D4F8B",
        cta: "Browse rentals",
      };
    var calcItems = CALC.map(function (x) {
      var on = c && x.id === c.id;
      return {
        label: x.label,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#0D4F8B" : "#FFFFFF",
        border: on ? "#FFFFFF" : "rgba(255,255,255,0.35)",
        pick: function () {
          self.setState({ calc: x.id });
        },
      };
    });

    var slideIdx = s.slide || 0;
    var goTo = function (i) {
      return function () {
        self.lastSlide = Date.now();
        self.setState({ slide: (i + SLIDES.length) % SLIDES.length });
      };
    };
    var baseSlide = SLIDES[slideIdx];
    var chipP = byKind(P, baseSlide.chipKind);
    var chipIsBundle = baseSlide.chipName === HERO_BUNDLE + " bundle";
    var slide = Object.assign({}, baseSlide, {
      sub: baseSlide.sub.replace("ETB [X]", freeOverFmt),
      chipHref: chipIsBundle ? "#bundles" : chipP ? productHref(chipP) : baseSlide.href1,
      chipName: chipP && baseSlide.chipName === chipP.name ? chipP.name : baseSlide.chipName,
      chipPrice:
        chipIsBundle && heroBundle
          ? "from " + fmt(heroBundle.price) + " / day"
          : chipP && baseSlide.chipName === chipP.name
            ? baseSlide.chipRent && chipP.rent
              ? fmt(chipP.rent) + " / day"
              : fmt(chipP.buy)
            : baseSlide.chipPrice,
    });
    var dots = SLIDES.map(function (x, i) {
      var on = i === slideIdx;
      return {
        n: i + 1,
        aria: on ? "true" : "false",
        w: on ? "28px" : "8px",
        hit: on ? "40px" : "24px",
        bg: on ? "#8FD19A" : "rgba(255,255,255,0.45)",
        pick: goTo(i),
      };
    });

    var deptIdx = s.dept || 0;
    var menuOpen = !!s.menuOpen;
    var deptDef = DEPTS[deptIdx];
    var dept = Object.assign({}, deptDef, {
      href: deptHref(deptDef.shop),
      promoTitle:
        deptDef.promoEyebrow === "Rental bundles" && heroBundle
          ? heroBundle.name + " from " + fmt(heroBundle.price) + " a day"
          : deptDef.promoTitle,
    });
    var menuDepts = DEPTS.map(function (d, i) {
      var on = i === deptIdx;
      return {
        name: d.name,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#0D4F8B" : "#111318",
        shadow: on ? "0 2px 8px rgba(13,79,139,0.12)" : "none",
        pick: function () {
          self.setState({ dept: i });
        },
      };
    });

    // Rental bundles: "Book bundle" books every rentable item in the bundle for one day and keeps the customer here
    // (the header cart updates); the button then offers the cart.
    var bundles = BUNDLES.map(function (b) {
      var key = "bundle:" + b.id;
      var booked = !!done[key];
      var items = b.items || [];
      return Object.assign({}, b, {
        count: b.count || items.length,
        priceFmt: fmt(b.price || 0),
        items: items.map(function (it) {
          return { label: it.label };
        }),
        busy: !!busy[key],
        booked: booked,
        cta: busy[key] ? "Booking…" : booked ? "Booked · View cart" : "Book bundle",
        err: errs[key] || "",
        add: function () {
          if (booked) return navigate("/cart");
          self.runAction(
            key,
            function () {
              return cart.addBundle({ bundleId: b.id, rentDays: 1 });
            },
            true,
          );
        },
      });
    });

    var cats = (initial.categories || [])
      .slice()
      .sort(function (a, b) {
        var ia = CAT_ORDER.indexOf(a.label),
          ib = CAT_ORDER.indexOf(b.label);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      })
      .slice(0, 8)
      .map(function (c) {
        return Object.assign({}, c, { href: deptHref(c.label) });
      });
    var camera = byKind(P, "camera");

    return {
      slide: slide,
      slideNo: "0" + (slideIdx + 1),
      dots: dots,
      prevSlide: goTo(slideIdx - 1),
      nextSlide: goTo(slideIdx + 1),
      pauseHero: function () {
        self.setState({ heroPaused: true });
      },
      resumeHero: function () {
        self.lastSlide = Date.now();
        self.setState({ heroPaused: false });
      },
      menuOpen: menuOpen,
      menuAria: menuOpen ? "true" : "false",
      menuBtnBg: menuOpen ? "#EAF3FA" : "#FFFFFF",
      menuBtnBorder: menuOpen ? "#1679BE" : "#E6E4DE",
      toggleMenu: function () {
        self.setState({ menuOpen: !self.state.menuOpen });
      },
      closeMenu: function () {
        self.setState({ menuOpen: false });
      },
      menuDepts: menuDepts,
      dept: dept,
      bundles: bundles,
      modes: modes,
      placeholder: mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      hh: pad(Math.floor(secs / 3600)),
      mm: pad(Math.floor((secs % 3600) / 60)),
      ss: pad(secs % 60),
      cats: cats,
      cameraHref: productHref(camera),
      searchSubmit: function (e) {
        submitSearch(e, mode);
      },
      flash: flash,
      tabs: tabs,
      top: top,
      calc: calc,
      calcItems: calcItems,
      days: days,
      dayWord: days === 1 ? "day" : "days",
      onDays: function (e) {
        self.setState({ days: parseInt(e.target.value, 10) || 1 });
      },
      wishCount: hv.wishCount,
      cartCount: hv.cartCount,
      cartTotal: hv.cartTotal,
      accountHref: hv.accountHref,
      accountHello: hv.accountHello,
      wishHref: hv.signedIn ? "/account?tab=wishlist" : "/signin?next=" + encodeURIComponent("/account?tab=wishlist"),
      // Store details and utility links
      city: store.city,
      freeOverLine: "Free delivery on orders over " + freeOverFmt,
      sellHref: "/p/sell-with-us",
      trackHref: "/track",
      helpHref: "/p/help",
      dealsHref: "/shop?deals=1",
    };
  }
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.lift{transition:transform .2s ease, box-shadow .2s ease}\n.lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(13,79,139,.3)}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.btn-w:hover{background:#FFFFFF;color:#0D4F8B}\n.ghost:hover{background:#F1F0EC}\n.nav a:hover{color:#0D4F8B}\ninput[type=range]{accent-color:#0D4F8B;width:100%;height:28px;margin:0;cursor:pointer}\n@media (prefers-reduced-motion: reduce){.lift{transition:none}}\n";

export default class HomeScreen extends Component {
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
                <strong>{vals.city}</strong>
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
                {vals.freeOverLine}
              </span>
            </div>
            <nav aria-label="Utility" className="nav" style={{ display: "flex", gap: "24px" }}>
              <Link href={vals.sellHref} style={{ color: "#E6F0F9" }}>
                Sell or list with us
              </Link>
              <Link href={vals.trackHref} style={{ color: "#E6F0F9" }}>
                Track order
              </Link>
              <Link href={vals.helpHref} style={{ color: "#E6F0F9" }}>
                Help
              </Link>
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
            <button
              type="button"
              className="ghost"
              onClick={vals.toggleMenu}
              aria-expanded={vals.menuAria}
              aria-controls="mega"
              style={{
                height: "52px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: `1px solid ${vals.menuBtnBorder}`,
                borderRadius: "16px",
                background: vals.menuBtnBg,
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
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
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
              onSubmit={vals.searchSubmit}
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
              href={vals.wishHref}
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
            <Link href={deptHref("Electronics")}>Electronics</Link>
            <Link href={deptHref("Phones")}>Phones</Link>
            <Link href={deptHref("Home & Living")}>{"Home & Living"}</Link>
            <Link href={deptHref("Kitchen")}>Kitchen</Link>
            <Link href={deptHref("Fashion")}>Fashion</Link>
            <Link href={deptHref("Beauty")}>Beauty</Link>
            <Link href={deptHref("Tools & DIY")}>{"Tools & DIY"}</Link>
            <Link href={deptHref("Baby & Kids")}>{"Baby & Kids"}</Link>
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
            <Link href={vals.dealsHref} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#C42A1C", fontWeight: "600" }}>
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
            style={{
              padding: "24px var(--gutter) 0",
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gridTemplateRows: "repeat(2, 260px)",
              gap: "20px",
            }}
            data-cols="12"
            data-rows="2"
            data-sec="hero"
          >
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured"
              onMouseEnter={vals.pauseHero}
              onMouseLeave={vals.resumeHero}
              style={{
                gridColumn: "span 8",
                gridRow: "span 2",
                position: "relative",
                background: vals.slide.bg,
                borderRadius: "32px",
                overflow: "hidden",
                transition: "background-color .6s ease",
              }}
              data-span="8"
              data-rowspan="2"
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  right: "-90px",
                  top: "-80px",
                  width: "580px",
                  height: "580px",
                  borderRadius: "999px",
                  background: vals.slide.circle,
                  transition: "background-color .6s ease",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{
                  position: "absolute",
                  right: "140px",
                  bottom: "-190px",
                  width: "380px",
                  height: "380px",
                  borderRadius: "999px",
                  border: "2px solid rgba(255,255,255,0.12)",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{
                  position: "absolute",
                  left: "56px",
                  top: "52px",
                  width: "440px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  color: "#FFFFFF",
                }}
                data-abs="text"
                data-w
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    height: "30px",
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.12)",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#CFEBD3",
                  }}
                  suppressHydrationWarning
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#8FD19A" }} />
                  {vals.slide.eyebrow}
                </span>
                <h1
                  style={{
                    margin: "0",
                    minHeight: "171px",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "58px",
                    lineHeight: "0.98",
                    fontWeight: "700",
                    letterSpacing: "-0.045em",
                  }}
                  suppressHydrationWarning
                >
                  {vals.slide.title}{" "}
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontWeight: "400",
                      letterSpacing: "-0.02em",
                      color: "#8FD19A",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.slide.accent}
                  </span>
                </h1>
                <p
                  style={{ margin: "0", minHeight: "52px", fontSize: "17px", lineHeight: "1.55", color: "#E1ECF5", maxWidth: "390px" }}
                  suppressHydrationWarning
                >
                  {vals.slide.sub}
                </p>
                <div style={{ display: "flex", gap: "12px", paddingTop: "6px" }}>
                  <Link
                    href={vals.slide.href1}
                    className="btn-y"
                    style={{
                      height: "52px",
                      padding: "0 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "14px",
                      background: "#2F7A3C",
                      color: "#FFFFFF",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.slide.cta1}
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
                    href={vals.slide.href2}
                    className="btn-w"
                    style={{
                      height: "52px",
                      padding: "0 24px",
                      display: "flex",
                      alignItems: "center",
                      border: "1.5px solid rgba(255,255,255,0.5)",
                      borderRadius: "14px",
                      color: "#FFFFFF",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.slide.cta2}
                  </Link>
                </div>
              </div>{" "}
              <div
                style={{ position: "absolute", left: "56px", bottom: "32px", display: "flex", alignItems: "center", gap: "14px" }}
                data-abs="misc"
              >
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                    fontVariantNumeric: "tabular-nums",
                  }}
                  suppressHydrationWarning
                >
                  {vals.slideNo} <span style={{ color: "rgba(255,255,255,0.5)" }}>/ 03</span>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                  {(vals.dots || []).map((d, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        onClick={d.pick}
                        aria-label={`Show slide ${d.n}`}
                        aria-current={d.aria}
                        style={{
                          width: d.hit,
                          height: "44px",
                          padding: "0",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            width: d.w,
                            height: "6px",
                            borderRadius: "999px",
                            background: d.bg,
                            transition: "width .3s ease",
                          }}
                        />
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={vals.prevSlide}
                    aria-label="Previous slide"
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "1.5px solid rgba(255,255,255,0.35)",
                      borderRadius: "999px",
                      background: "transparent",
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
                      <path d="M19 12H5M11 6l-6 6 6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nextSlide}
                    aria-label="Next slide"
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
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>{" "}
              <div
                style={{ position: "absolute", right: "46px", top: "58px", zoom: "1.45", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={vals.slide.k1} />
              </div>{" "}
              <div
                style={{ position: "absolute", left: "500px", bottom: "34px", zoom: "0.92", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={vals.slide.k2} />
              </div>{" "}
              <div
                style={{ position: "absolute", right: "12px", bottom: "6px", zoom: "0.95", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={vals.slide.k3} />
              </div>{" "}
              <Link
                href={vals.slide.chipHref}
                style={{
                  position: "absolute",
                  right: "36px",
                  top: "30px",
                  height: "44px",
                  padding: "0 8px 0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderRadius: "999px",
                  background: "#FFFFFF",
                  color: "#111318",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
                }}
                data-abs="misc"
              >
                <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
                  <span style={{ fontSize: "11px", color: "#5E6470" }} suppressHydrationWarning>
                    {vals.slide.chipName}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "700" }} suppressHydrationWarning>
                    {vals.slide.chipPrice}
                  </span>
                </span>
                <span
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "999px",
                    background: vals.slide.bg,
                    color: "#FFFFFF",
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
                </span>
              </Link>{" "}
            </div>
            <Link
              href={deptHref("Events & Party")}
              className="lift"
              style={{
                gridColumn: "span 4",
                position: "relative",
                background: "#E4F2E6",
                borderRadius: "28px",
                overflow: "hidden",
                color: "#111318",
              }}
              data-span="4"
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  left: "28px",
                  top: "28px",
                  bottom: "28px",
                  width: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                data-abs="text"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span
                    style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#2F7A3C" }}
                  >
                    Weekend rentals
                  </span>
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "30px",
                      lineHeight: "1",
                      fontWeight: "700",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Event gear for your next party
                  </span>
                </div>
                <span style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "14px", color: "#3A3F4A" }}>
                    {"from "}
                    <strong style={{ color: "#111318" }}>ETB 1,500 / day</strong>
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      height: "38px",
                      padding: "0 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "12px",
                      background: "#111318",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Book now
                  </span>
                </span>
              </div>{" "}
              <div
                style={{ position: "absolute", right: "-8px", bottom: "6px", zoom: "0.95", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"tent"} />
              </div>{" "}
            </Link>
            <div
              style={{ gridColumn: "span 4", position: "relative", background: "#EEE8FF", borderRadius: "28px", overflow: "hidden" }}
              data-span="4"
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  left: "28px",
                  top: "28px",
                  bottom: "28px",
                  width: "240px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                data-abs="text"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span
                    style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#5B3FD0" }}
                  >
                    Flash deals
                  </span>
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "30px",
                      lineHeight: "1",
                      fontWeight: "700",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Up to 25% off wearables
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#3A3F4A" }}>Ends in</span>
                  <div aria-live="off" style={{ display: "flex", gap: "6px" }}>
                    <span
                      style={{
                        width: "46px",
                        height: "42px",
                        borderRadius: "10px",
                        background: "#111318",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "17px",
                        fontWeight: "700",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.hh}
                    </span>
                    <span
                      style={{
                        width: "46px",
                        height: "42px",
                        borderRadius: "10px",
                        background: "#111318",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "17px",
                        fontWeight: "700",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.mm}
                    </span>
                    <span
                      style={{
                        width: "46px",
                        height: "42px",
                        borderRadius: "10px",
                        background: "#111318",
                        color: "#8FD19A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "17px",
                        fontWeight: "700",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.ss}
                    </span>
                  </div>
                </div>
              </div>{" "}
              <div
                style={{ position: "absolute", right: "-10px", bottom: "0px", zoom: "0.95", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"watch"} />
              </div>{" "}
            </div>
          </section>
          <section style={{ padding: "20px var(--gutter) 0" }} data-sec="trust-strip">
            {" "}
            <div
              style={{
                height: "96px",
                boxSizing: "border-box",
                border: "1px solid #EFEDE8",
                borderRadius: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                alignItems: "center",
              }}
              data-cols="4"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 28px" }}>
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
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>Same-day delivery</span>
                  <span style={{ fontSize: "13px", color: "#5E6470" }}>Across {vals.city}</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 28px", borderLeft: "1px solid #EFEDE8" }}>
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    flexShrink: "0",
                    borderRadius: "14px",
                    background: "#FFF4C7",
                    color: "#8A6300",
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
                    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>100% genuine</span>
                  <span style={{ fontSize: "13px", color: "#5E6470" }}>With warranty</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 28px", borderLeft: "1px solid #EFEDE8" }}>
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    flexShrink: "0",
                    borderRadius: "14px",
                    background: "#EEE8FF",
                    color: "#5B3FD0",
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
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>Rent by the day</span>
                  <span style={{ fontSize: "13px", color: "#5E6470" }}>Extend anytime</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 28px", borderLeft: "1px solid #EFEDE8" }}>
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    flexShrink: "0",
                    borderRadius: "14px",
                    background: "#FFE4EF",
                    color: "#B0245F",
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
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>Secure checkout</span>
                  <span style={{ fontSize: "13px", color: "#5E6470" }}>Telebirr, Visa, Mastercard</span>
                </span>
              </div>
            </div>{" "}
          </section>
          <section style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }} data-sec="categories">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Departments
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
                  Shop by category
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
                View all categories
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "16px" }} data-cols="8">
              {(vals.cats || []).map((c, i0) => (
                <Fragment key={i0}>
                  <Link
                    href={c.href}
                    className="lift"
                    style={{
                      height: "212px",
                      boxSizing: "border-box",
                      padding: "14px 14px 18px",
                      background: c.bg,
                      borderRadius: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: "#111318",
                    }}
                  >
                    <div style={{ zoom: "0.62", width: "200px", height: "200px" }}>
                      <Render kind={c.kind} />
                    </div>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" }} suppressHydrationWarning>
                        {c.label}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A505C" }} suppressHydrationWarning>
                        {c.tag}
                      </span>
                    </span>
                  </Link>
                </Fragment>
              ))}
            </div>
          </section>
          <section style={{ padding: "96px var(--gutter) 0" }} data-sec="flash-deals">
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
                    Flash deals
                  </h2>
                  <div
                    style={{
                      height: "44px",
                      padding: "0 6px 0 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "12px",
                      background: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#3A3F4A",
                    }}
                  >
                    Ends in
                    <span
                      style={{
                        height: "32px",
                        minWidth: "36px",
                        padding: "0 6px",
                        boxSizing: "border-box",
                        borderRadius: "8px",
                        background: "#C42A1C",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: "700",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.hh}
                    </span>
                    :
                    <span
                      style={{
                        height: "32px",
                        minWidth: "36px",
                        padding: "0 6px",
                        boxSizing: "border-box",
                        borderRadius: "8px",
                        background: "#C42A1C",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: "700",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.mm}
                    </span>
                    :
                    <span
                      style={{
                        height: "32px",
                        minWidth: "36px",
                        padding: "0 6px",
                        boxSizing: "border-box",
                        borderRadius: "8px",
                        background: "#C42A1C",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: "700",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.ss}
                    </span>
                  </div>
                </div>
                <Link
                  href={vals.dealsHref}
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
                  See all deals
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "16px" }} data-cols="5">
                {(vals.flash || []).map((p, i0) => (
                  <Fragment key={i0}>
                    <article
                      className="lift"
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "24px",
                        padding: "12px 12px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <Link
                        href={p.href}
                        aria-label={p.name}
                        style={{
                          position: "relative",
                          height: "196px",
                          borderRadius: "18px",
                          background: p.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            height: "26px",
                            padding: "0 9px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "8px",
                            background: "#C42A1C",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                          data-abs="misc"
                          suppressHydrationWarning
                        >
                          {p.discount}
                        </span>
                        <div style={{ zoom: "0.84", width: "200px", height: "200px" }}>
                          <Render kind={p.kind} />
                        </div>
                      </Link>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "0 4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#5E6470" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                            <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                          </svg>
                          <span style={{ fontWeight: "600", color: "#111318" }} suppressHydrationWarning>
                            {p.rating}
                          </span>
                          <span>·</span>
                          <span suppressHydrationWarning>{p.cat}</span>
                        </div>
                        <Link
                          href={p.href}
                          style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" }}
                          suppressHydrationWarning
                        >
                          {p.name}
                        </Link>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span style={{ fontSize: "17px", fontWeight: "700", color: "#C42A1C" }} suppressHydrationWarning>
                            {p.priceFmt}
                          </span>
                          <span style={{ fontSize: "13px", color: "#5E6470", textDecoration: "line-through" }} suppressHydrationWarning>
                            {p.wasFmt}
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "4px" }}>
                          <div style={{ height: "6px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}>
                            <div style={{ height: "6px", width: p.soldPct, borderRadius: "999px", background: "#F08A24" }} />
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: "500", color: "#5E6470" }} suppressHydrationWarning>
                            {"Only "}
                            {p.left}
                            {" left"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-y"
                        onClick={p.add}
                        disabled={p.busy}
                        style={{
                          height: "44px",
                          margin: "0 4px",
                          border: "none",
                          borderRadius: "12px",
                          background: "#2F7A3C",
                          color: "#FFFFFF",
                          font: "inherit",
                          fontSize: "14px",
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
                        {p.addText}
                      </button>
                      {p.err ? (
                        <span role="alert" style={{ fontSize: "12px", fontWeight: "500", color: "#C42A1C" }}>
                          {p.err}
                        </span>
                      ) : null}
                    </article>
                  </Fragment>
                ))}
              </div>
            </div>{" "}
          </section>
          <section style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }} data-sec="offers">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                Offers
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
                Deals worth grabbing
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                gridTemplateRows: "repeat(2, 220px)",
                gap: "20px",
              }}
              data-cols="12"
              data-rows="2"
            >
              <Link
                href={deptHref("Kitchen")}
                className="lift"
                style={{
                  gridColumn: "span 6",
                  gridRow: "span 2",
                  position: "relative",
                  background: "#DDF0FF",
                  borderRadius: "32px",
                  overflow: "hidden",
                  color: "#111318",
                }}
                data-span="6"
                data-rowspan="2"
                data-banner
              >
                {" "}
                <div
                  style={{
                    position: "absolute",
                    left: "44px",
                    top: "44px",
                    bottom: "44px",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  data-abs="text"
                  data-w
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        height: "28px",
                        padding: "0 12px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#1F5FAE",
                      }}
                    >
                      {"Kitchen & Home"}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "22px",
                        fontWeight: "600",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Up to
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "96px",
                        lineHeight: "0.85",
                        fontWeight: "800",
                        letterSpacing: "-0.06em",
                        color: "#1F5FAE",
                      }}
                    >
                      30%
                      <span style={{ fontSize: "44px", letterSpacing: "-0.03em" }}>{" off"}</span>
                    </span>
                    <span style={{ fontSize: "16px", lineHeight: "1.5", color: "#3A3F4A" }}>
                      Coffee machines, blenders and small appliances.
                    </span>
                  </div>
                  <span
                    className="btn-t"
                    style={{
                      alignSelf: "flex-start",
                      height: "48px",
                      padding: "0 22px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "14px",
                      background: "#0D4F8B",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                  >
                    Shop the sale
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
                  </span>
                </div>{" "}
                <div
                  style={{
                    position: "absolute",
                    right: "150px",
                    bottom: "34px",
                    width: "260px",
                    height: "260px",
                    borderRadius: "999px",
                    background: "#C4E3FF",
                  }}
                  data-abs="deco"
                />{" "}
                <div
                  style={{ position: "absolute", right: "60px", bottom: "30px", zoom: "1.6", width: "200px", height: "200px" }}
                  data-abs="art"
                >
                  <Render kind={"espresso"} />
                </div>{" "}
              </Link>
              <Link
                href={deptHref("Fashion")}
                className="lift"
                style={{
                  gridColumn: "span 6",
                  position: "relative",
                  background: "#FFEADB",
                  borderRadius: "28px",
                  overflow: "hidden",
                  color: "#111318",
                }}
                data-span="6"
                data-banner
              >
                {" "}
                <div
                  style={{
                    position: "absolute",
                    left: "36px",
                    top: "34px",
                    bottom: "34px",
                    width: "280px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  data-abs="text"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span
                      style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#B4431C" }}
                    >
                      Fashion week
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "34px",
                        lineHeight: "1",
                        fontWeight: "700",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {"20% off sneakers & bags"}
                    </span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "700", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                    Shop fashion
                  </span>
                </div>{" "}
                <div
                  style={{
                    position: "absolute",
                    right: "20px",
                    bottom: "0px",
                    zoom: "1.1",
                    width: "200px",
                    height: "200px",
                    transform: "rotate(-8deg)",
                  }}
                  data-abs="art"
                >
                  <Render kind={"sneaker"} />
                </div>{" "}
              </Link>
              <Link
                href={vals.cameraHref}
                className="lift"
                style={{
                  gridColumn: "span 6",
                  position: "relative",
                  background: "#0D4F8B",
                  borderRadius: "28px",
                  overflow: "hidden",
                  color: "#FFFFFF",
                }}
                data-span="6"
                data-banner
              >
                {" "}
                <div
                  style={{
                    position: "absolute",
                    left: "36px",
                    top: "34px",
                    bottom: "34px",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  data-abs="text"
                  data-w
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span
                      style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8FD19A" }}
                    >
                      {"Rent, don't buy"}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "34px",
                        lineHeight: "1",
                        fontWeight: "700",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      Pro cameras from ETB 2,500 a day
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      color: "#8FD19A",
                    }}
                  >
                    Book a camera
                  </span>
                </div>{" "}
                <div
                  style={{ position: "absolute", right: "26px", bottom: "6px", zoom: "1.05", width: "200px", height: "200px" }}
                  data-abs="art"
                >
                  <Render kind={"camera"} />
                </div>{" "}
              </Link>
            </div>
          </section>
          <section style={{ padding: "96px var(--gutter) 0" }} data-sec="rent-vs-buy">
            {" "}
            <div
              style={{
                position: "relative",
                background: "#0D4F8B",
                borderRadius: "40px",
                padding: "56px",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                gap: "40px",
                color: "#FFFFFF",
              }}
              data-cols="12"
            >
              <div
                style={{
                  position: "absolute",
                  left: "-120px",
                  bottom: "-220px",
                  width: "520px",
                  height: "520px",
                  borderRadius: "999px",
                  background: "#1A62A8",
                }}
                data-abs="deco"
                data-w
              />
              <div
                style={{ gridColumn: "span 5", position: "relative", display: "flex", flexDirection: "column", gap: "22px" }}
                data-span="5"
              >
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8FD19A" }}>
                  Rent or buy?
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "52px",
                    lineHeight: "0.98",
                    fontWeight: "700",
                    letterSpacing: "-0.045em",
                  }}
                >
                  {"Only need it for a few days? "}
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: "400", color: "#8FD19A" }}>
                    Rent it.
                  </span>
                </h2>
                <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#CFE2F3", maxWidth: "420px" }}>
                  {"Pick an item and how long you need it. We'll show you which one saves you more."}
                </p>
                <div role="group" aria-label="Choose an item" style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "6px" }}>
                  {(vals.calcItems || []).map((ci, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        onClick={ci.pick}
                        aria-pressed={ci.aria}
                        style={{
                          height: "48px",
                          padding: "0 20px",
                          border: `1.5px solid ${ci.border}`,
                          borderRadius: "14px",
                          background: ci.bg,
                          color: ci.fg,
                          font: "inherit",
                          fontSize: "15px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                        suppressHydrationWarning
                      >
                        {ci.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                style={{
                  gridColumn: "7 / span 6",
                  position: "relative",
                  background: "#FFFFFF",
                  color: "#111318",
                  borderRadius: "28px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
                data-span="6"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div
                    style={{
                      width: "88px",
                      height: "88px",
                      flexShrink: "0",
                      borderRadius: "20px",
                      background: "#F6F5F1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ zoom: "0.4", width: "200px", height: "200px" }}>
                      <Render kind={vals.calc.kind} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em" }} suppressHydrationWarning>
                      {vals.calc.name}
                    </span>
                    <span style={{ fontSize: "14px", color: "#5E6470" }} suppressHydrationWarning>
                      {"Rent "}
                      {vals.calc.rateFmt}
                      {" / day · Buy "}
                      {vals.calc.buyFmt}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label htmlFor="days" style={{ fontSize: "15px", fontWeight: "600" }}>
                      How many days do you need it?
                    </label>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "28px",
                        fontWeight: "700",
                        letterSpacing: "-0.03em",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.days} {vals.dayWord}
                    </span>
                  </div>
                  <input id="days" type="range" min="1" max="30" value={vals.days} onChange={vals.onDays} suppressHydrationWarning />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#5E6470" }}>
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ fontWeight: "600" }} suppressHydrationWarning>
                        {"Rent for "}
                        {vals.days} {vals.dayWord}
                      </span>
                      <span style={{ fontWeight: "700" }} suppressHydrationWarning>
                        {vals.calc.rentTotalFmt}
                      </span>
                    </div>
                    <div style={{ height: "12px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}>
                      <div style={{ height: "12px", width: vals.calc.rentPct, borderRadius: "999px", background: "#418D4D" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ fontWeight: "600" }}>Buy it</span>
                      <span style={{ fontWeight: "700" }} suppressHydrationWarning>
                        {vals.calc.buyFmt}
                      </span>
                    </div>
                    <div style={{ height: "12px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}>
                      <div style={{ height: "12px", width: vals.calc.buyPct, borderRadius: "999px", background: "#1679BE" }} />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px 18px",
                    borderRadius: "18px",
                    background: vals.calc.verdictBg,
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: vals.calc.verdictFg }} suppressHydrationWarning>
                      {vals.calc.verdict}
                    </span>
                    <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                      {vals.calc.verdictSub}
                    </span>
                  </span>
                  <Link
                    href={vals.calc.href}
                    className="btn-t"
                    style={{
                      flexShrink: "0",
                      height: "46px",
                      padding: "0 18px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "12px",
                      background: "#0D4F8B",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.calc.cta}
                  </Link>
                </div>
              </div>
            </div>{" "}
          </section>
          <section
            id="bundles"
            style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }}
            data-sec="rental-bundles"
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2F7A3C" }}>
                  Rental bundles
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
                  {"Everything for the occasion. "}
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: "400", color: "#2F7A3C" }}>
                    One booking.
                  </span>
                </h2>
              </div>
              <Link
                href="/shop?mode=rent"
                style={{
                  height: "48px",
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1.5px solid #0D4F8B",
                  borderRadius: "14px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#0D4F8B",
                }}
              >
                Build your own bundle
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }} data-cols="4">
              {(vals.bundles || []).map((b, i0) => (
                <Fragment key={i0}>
                  <article
                    className="lift"
                    style={{
                      border: "1px solid #EFEDE8",
                      borderRadius: "28px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      background: "#FFFFFF",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "220px",
                        background: b.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          height: "28px",
                          padding: "0 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "999px",
                          background: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#111318",
                        }}
                        data-abs="misc"
                        suppressHydrationWarning
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                          <path d="M3 8v8l9 5 9-5V8" />
                        </svg>
                        {b.count}
                        {" items"}
                      </span>
                      <div style={{ zoom: "0.95", width: "200px", height: "200px" }}>
                        <Render kind={b.k1} />
                      </div>
                      <div
                        style={{ position: "absolute", right: "8px", bottom: "6px", zoom: "0.5", width: "200px", height: "200px" }}
                        data-abs="art"
                      >
                        <Render kind={b.k2} />
                      </div>
                    </div>
                    <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: "14px", flexGrow: "1" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "23px",
                            fontWeight: "700",
                            letterSpacing: "-0.03em",
                          }}
                          suppressHydrationWarning
                        >
                          {b.name}
                        </span>
                        <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#5E6470" }} suppressHydrationWarning>
                          {b.desc}
                        </span>
                      </div>
                      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {(b.items || []).map((it, i1) => (
                          <Fragment key={i1}>
                            <li
                              style={{
                                height: "28px",
                                padding: "0 10px",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "8px",
                                background: "#F3F2EE",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#3A3F4A",
                              }}
                              suppressHydrationWarning
                            >
                              {it.label}
                            </li>
                          </Fragment>
                        ))}
                      </ul>
                      <div style={{ flexGrow: "1" }} />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "14px",
                          borderTop: "1px solid #EFEDE8",
                        }}
                      >
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                          <span style={{ fontSize: "12px", color: "#5E6470" }}>from</span>
                          <span style={{ fontSize: "18px", fontWeight: "700" }} suppressHydrationWarning>
                            {b.priceFmt} <span style={{ fontSize: "13px", fontWeight: "500", color: "#5E6470" }}>/ day</span>
                          </span>
                        </span>
                        <button
                          type="button"
                          className="btn-y"
                          onClick={b.add}
                          disabled={b.busy}
                          aria-label={`${b.cta}: ${b.name}`}
                          style={{
                            height: "44px",
                            padding: "0 16px",
                            border: "none",
                            borderRadius: "12px",
                            background: "#2F7A3C",
                            color: "#FFFFFF",
                            font: "inherit",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                          suppressHydrationWarning
                        >
                          {b.cta}
                        </button>
                      </div>
                      {b.err ? (
                        <span role="alert" style={{ fontSize: "12px", fontWeight: "500", color: "#C42A1C" }}>
                          {b.err}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
          </section>
          <section
            style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "32px" }}
            data-sec="top-products"
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Trending
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
                  Top products
                </h2>
              </div>
              <div
                role="tablist"
                aria-label="Product lists"
                style={{ display: "flex", gap: "4px", padding: "4px", background: "#F3F2EE", borderRadius: "14px" }}
              >
                {(vals.tabs || []).map((t, i0) => (
                  <Fragment key={i0}>
                    <button
                      type="button"
                      role="tab"
                      onClick={t.pick}
                      aria-selected={t.aria}
                      style={{
                        height: "40px",
                        padding: "0 18px",
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }} data-cols="4">
              {(vals.top || []).map((p, i0) => (
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
                        href={p.href}
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
                          disabled={p.busy}
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
                      {p.err ? (
                        <span role="alert" style={{ fontSize: "12px", fontWeight: "500", color: "#C42A1C" }}>
                          {p.err}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
          </section>
          <section style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "28px" }} data-sec="brands">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2
                style={{
                  margin: "0",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "32px",
                  fontWeight: "700",
                  letterSpacing: "-0.035em",
                }}
              >
                Brands on Simbatech
              </h2>
              <Link href="/shop" style={{ fontSize: "15px", fontWeight: "600", color: "#0D4F8B" }}>
                All brands
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "16px" }} data-cols="6">
              <Link
                href={shopHref({ brand: "Nova" })}
                className="lift"
                style={{
                  height: "104px",
                  borderRadius: "20px",
                  background: "#F6F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "30px",
                  fontWeight: "800",
                  letterSpacing: "0.12em",
                  color: "#111318",
                }}
              >
                NOVA
              </Link>
              <Link
                href={shopHref({ brand: "Aero" })}
                className="lift"
                style={{
                  height: "104px",
                  borderRadius: "20px",
                  background: "#F6F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "32px",
                  fontWeight: "700",
                  letterSpacing: "-0.05em",
                  color: "#1F5FAE",
                }}
              >
                aero
                <span style={{ color: "#FF7A45" }}>.</span>
              </Link>
              <Link
                href={shopHref({ brand: "Pulse" })}
                className="lift"
                style={{
                  height: "104px",
                  borderRadius: "20px",
                  background: "#F6F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "40px",
                  fontStyle: "italic",
                  color: "#0D4F8B",
                }}
              >
                Pulse
              </Link>
              <Link
                href={shopHref({ brand: "Lumen" })}
                className="lift"
                style={{
                  height: "104px",
                  borderRadius: "20px",
                  background: "#F6F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "24px",
                  fontWeight: "600",
                  letterSpacing: "0.3em",
                  color: "#111318",
                }}
              >
                <span style={{ width: "18px", height: "18px", borderRadius: "999px", border: "4px solid #111318" }} />
                LUMEN
              </Link>
              <Link
                href={shopHref({ brand: "Casa Verde" })}
                className="lift"
                style={{
                  height: "104px",
                  borderRadius: "20px",
                  background: "#F6F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "36px",
                  color: "#7A4E2D",
                }}
              >
                casa verde
              </Link>
              <Link
                href={shopHref({ brand: "Orbit" })}
                className="lift"
                style={{
                  height: "104px",
                  borderRadius: "20px",
                  background: "#F6F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "32px",
                  fontWeight: "800",
                  letterSpacing: "-0.05em",
                  color: "#5B3FD0",
                }}
              >
                orbit
              </Link>
            </div>
          </section>
          <section
            style={{ padding: "96px var(--gutter) 0", display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "20px" }}
            data-cols="12"
            data-sec="app-why"
          >
            <div
              style={{
                gridColumn: "span 7",
                height: "380px",
                position: "relative",
                background: "#1679BE",
                color: "#FFFFFF",
                borderRadius: "32px",
                overflow: "hidden",
              }}
              data-span="7"
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  left: "48px",
                  top: "48px",
                  bottom: "48px",
                  width: "400px",
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
                    Shop, rent and track, all from your phone.
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
                  right: "40px",
                  top: "40px",
                  width: "300px",
                  height: "300px",
                  borderRadius: "999px",
                  background: "#3A8FD0",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{ position: "absolute", right: "50px", bottom: "-40px", zoom: "1.9", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"phone"} />
              </div>{" "}
            </div>
            <div
              style={{
                gridColumn: "span 5",
                height: "380px",
                boxSizing: "border-box",
                border: "1px solid #EFEDE8",
                borderRadius: "32px",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
              data-span="5"
            >
              <h2
                style={{
                  margin: "0",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "30px",
                  fontWeight: "700",
                  letterSpacing: "-0.035em",
                }}
              >
                Why people choose us
              </h2>
              <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "18px" }}>
                <li style={{ display: "flex", gap: "14px" }}>
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>One store, two ways</span>
                    <span style={{ fontSize: "14px", color: "#5E6470" }}>Buy to keep, or rent for as long as you need.</span>
                  </span>
                </li>
                <li style={{ display: "flex", gap: "14px" }}>
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>Checked before it ships</span>
                    <span style={{ fontSize: "14px", color: "#5E6470" }}>Every rental is inspected, cleaned and charged.</span>
                  </span>
                </li>
                <li style={{ display: "flex", gap: "14px" }}>
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>Pay the way you like</span>
                    <span style={{ fontSize: "14px", color: "#5E6470" }}>Telebirr, Visa or Mastercard, secured.</span>
                  </span>
                </li>
              </ul>
            </div>
          </section>
          <SiteFooter />
          {vals.menuOpen ? (
            <>
              <div
                onClick={vals.closeMenu}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  top: "132px",
                  bottom: "0",
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
                  {(vals.menuDepts || []).map((d, i0) => (
                    <Fragment key={i0}>
                      <li>
                        <button
                          type="button"
                          onClick={d.pick}
                          onMouseEnter={d.pick}
                          aria-current={d.aria}
                          style={{
                            width: "100%",
                            height: "50px",
                            padding: "0 14px",
                            border: "none",
                            borderRadius: "12px",
                            background: d.bg,
                            color: d.fg,
                            font: "inherit",
                            fontSize: "15px",
                            fontWeight: "600",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: d.shadow,
                          }}
                          suppressHydrationWarning
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
                    </Fragment>
                  ))}
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
                        suppressHydrationWarning
                      >
                        {vals.dept.name}
                      </h3>
                      <Link href={vals.dept.href} style={{ fontSize: "14px", fontWeight: "600", color: "#1679BE" }}>
                        Shop all
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={vals.closeMenu}
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "28px" }} data-cols="3">
                    {(vals.dept.groups || []).map((g, i0) => (
                      <Fragment key={i0}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#5E6470",
                            }}
                            suppressHydrationWarning
                          >
                            {g.title}
                          </span>
                          {(g.links || []).map((l, i1) => (
                            <Fragment key={i1}>
                              <Link
                                href={vals.dept.href}
                                style={{ fontSize: "15px", fontWeight: "500", color: "#111318" }}
                                suppressHydrationWarning
                              >
                                {l.label}
                              </Link>
                            </Fragment>
                          ))}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <Link
                  href={vals.dept.href}
                  style={{
                    width: "300px",
                    flexShrink: "0",
                    margin: "16px",
                    position: "relative",
                    borderRadius: "20px",
                    background: vals.dept.promoBg,
                    overflow: "hidden",
                    color: "#111318",
                  }}
                  data-banner
                  data-w
                >
                  {" "}
                  <div
                    style={{
                      position: "absolute",
                      left: "24px",
                      top: "24px",
                      right: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                    data-abs="text"
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: vals.dept.promoFg,
                      }}
                      suppressHydrationWarning
                    >
                      {vals.dept.promoEyebrow}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "26px",
                        lineHeight: "1.02",
                        fontWeight: "700",
                        letterSpacing: "-0.035em",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.dept.promoTitle}
                    </span>
                  </div>{" "}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "10px",
                      marginLeft: "-100px",
                      zoom: "1",
                      width: "200px",
                      height: "200px",
                    }}
                    data-abs="art"
                  >
                    <Render kind={vals.dept.kind} />
                  </div>{" "}
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}

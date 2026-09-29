"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var P = [
  { id: "p1", name: "Lumen Z6 Camera", cat: "Electronics", kind: "camera", bg: "#E0F1FF", buy: 139000, rent: 2500, rating: "4.8" },
  {
    id: "p2",
    name: "Pulse ANC Headphones",
    cat: "Electronics",
    kind: "headphones",
    bg: "#EEE8FF",
    buy: 18900,
    was: 23500,
    rating: "4.9",
    left: 6,
    sold: 78,
  },
  { id: "p3", name: "Aero X Pro", cat: "Phones", kind: "phone", bg: "#DDF5EA", buy: 89500, rating: "4.7" },
  {
    id: "p4",
    name: "Orbit Watch 2",
    cat: "Wearables",
    kind: "watch",
    bg: "#FFEADB",
    buy: 21500,
    was: 26900,
    rating: "4.6",
    left: 3,
    sold: 90,
  },
  { id: "p5", name: "Linen 3-Seater Sofa", cat: "Home & Living", kind: "sofa", bg: "#F3EEE6", buy: 84900, rating: "4.7" },
  {
    id: "p6",
    name: "Barista Espresso Machine",
    cat: "Kitchen",
    kind: "espresso",
    bg: "#FFF4C7",
    buy: 38500,
    was: 45000,
    rating: "4.6",
    left: 9,
    sold: 55,
  },
  {
    id: "p7",
    name: "Street Runner Sneakers",
    cat: "Fashion",
    kind: "sneaker",
    bg: "#FFE4EF",
    buy: 9800,
    was: 12400,
    rating: "4.5",
    left: 12,
    sold: 40,
  },
  { id: "p8", name: "Glow Skincare Duo", cat: "Beauty", kind: "skincare", bg: "#D9F3F0", buy: 4600, rating: "4.8" },
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
  {
    id: "p12",
    name: "Stack & Learn Blocks",
    cat: "Baby & Kids",
    kind: "blocks",
    bg: "#E0F1FF",
    buy: 2900,
    was: 3600,
    rating: "4.8",
    left: 4,
    sold: 84,
  },
];
var FLASH = ["p2", "p4", "p6", "p7", "p12"];
var TABS = [
  { id: "best", label: "Best sellers", ids: ["p1", "p2", "p3", "p5", "p6", "p8", "p11", "p7"] },
  { id: "new", label: "New arrivals", ids: ["p3", "p4", "p7", "p8", "p11", "p12", "p2", "p6"] },
  { id: "rent", label: "Most rented", ids: ["p1", "p10", "p9", "p11"] },
];
var CALC = [
  { id: "camera", label: "Camera", name: "Lumen Z6 Camera", kind: "camera", rate: 2500, buy: 139000 },
  { id: "tent", label: "Party tent", name: "Canopy Tent 3 × 3 m", kind: "tent", rate: 3500, buy: 45000 },
  { id: "drill", label: "Drill", name: "Cordless Drill Kit", kind: "drill", rate: 800, buy: 14500 },
];
var CATS = [
  { label: "Electronics", kind: "headphones", bg: "#E0F1FF", tag: "Buy · Rent" },
  { label: "Phones", kind: "phone", bg: "#EEE8FF", tag: "Buy" },
  { label: "Home & Living", kind: "sofa", bg: "#DDF5EA", tag: "Buy" },
  { label: "Kitchen", kind: "espresso", bg: "#F3EEE6", tag: "Buy" },
  { label: "Fashion", kind: "sneaker", bg: "#FFEADB", tag: "Buy" },
  { label: "Beauty", kind: "skincare", bg: "#FFE4EF", tag: "Buy" },
  { label: "Tools & DIY", kind: "drill", bg: "#FFF4C7", tag: "Buy · Rent" },
  { label: "Events & Party", kind: "tent", bg: "#D9F3F0", tag: "Rent" },
];
var SLIDES = [
  {
    eyebrow: "New season 2026",
    title: "Own it. Rent it.",
    accent: "Get it today.",
    sub: "Electronics, home, fashion, tools and event gear — shop to keep, or rent by the day. Delivered to your door.",
    cta1: "Shop now",
    href1: "/shop",
    cta2: "Rent something",
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
    href1: "/shop",
    cta2: "Browse rentals",
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
    href1: "/shop",
    cta2: "View offers",
    bg: "#1B2230",
    circle: "#2A3345",
    k1: "sofa",
    k2: "espresso",
    k3: "skincare",
    chipName: "Linen 3-Seater Sofa",
    chipPrice: "ETB 84,900",
  },
];
var BUNDLES = [
  {
    name: "Garden party",
    desc: "Shade, seating and sound for up to [N] guests.",
    k1: "tent",
    k2: "headphones",
    bg: "#E4F2E6",
    price: 6500,
    items: ["Canopy tent", "20 chairs", "Speaker", "String lights"],
  },
  {
    name: "Photoshoot kit",
    desc: "Everything for a pro shoot, ready to go.",
    k1: "camera",
    k2: "phone",
    bg: "#EAF3FA",
    price: 4200,
    items: ["Lumen Z6", "2 lenses", "Light kit", "Tripod"],
  },
  {
    name: "Weekend DIY",
    desc: "Tackle the shelves, the fence and the gutters.",
    k1: "drill",
    k2: "bike",
    bg: "#FFF4C7",
    price: 1500,
    items: ["Cordless drill", "Ladder", "Tool set", "Safety kit"],
  },
  {
    name: "Kids' birthday",
    desc: "Play, shade and seating for a day of fun.",
    k1: "blocks",
    k2: "tent",
    bg: "#FFE4EF",
    price: 5200,
    items: ["Kids' tent", "Tables & chairs", "Toy set", "Party lights"],
  },
];
function g(title, links) {
  return {
    title: title,
    links: links.map(function (l) {
      return { label: l };
    }),
  };
}
var DEPTS = [
  {
    name: "Electronics",
    kind: "headphones",
    promoBg: "#EAF3FA",
    promoFg: "#1679BE",
    promoEyebrow: "Rent it",
    promoTitle: "Pro cameras from ETB 2,500 a day",
    groups: [
      g("Audio", ["Headphones", "Earbuds", "Speakers", "Soundbars"]),
      g("Cameras", ["Mirrorless", "Action cameras", "Lenses", "Drones"]),
      g("Computing", ["Laptops", "Monitors", "Keyboards", "Storage"]),
    ],
  },
  {
    name: "Phones & Tablets",
    kind: "phone",
    promoBg: "#EEE8FF",
    promoFg: "#5B3FD0",
    promoEyebrow: "New in",
    promoTitle: "Aero X Pro from ETB 89,500",
    groups: [
      g("Phones", ["Smartphones", "Feature phones", "Refurbished", "Dual SIM"]),
      g("Tablets", ["Tablets", "Kids' tablets", "E-readers", "Styluses"]),
      g("Accessories", ["Cases", "Chargers", "Power banks", "Screen protectors"]),
    ],
  },
  {
    name: "Home & Living",
    kind: "sofa",
    promoBg: "#F3EEE6",
    promoFg: "#7A4E2D",
    promoEyebrow: "Home refresh",
    promoTitle: "Linen sofa, ETB 84,900",
    groups: [
      g("Furniture", ["Sofas", "Beds", "Tables", "Storage"]),
      g("Decor", ["Lighting", "Rugs", "Mirrors", "Plants"]),
      g("Bedding", ["Sheets", "Duvets", "Pillows", "Towels"]),
    ],
  },
  {
    name: "Kitchen",
    kind: "espresso",
    promoBg: "#FFF4C7",
    promoFg: "#8A6300",
    promoEyebrow: "Up to 30% off",
    promoTitle: "Small kitchen appliances",
    groups: [
      g("Appliances", ["Coffee machines", "Blenders", "Microwaves", "Kettles"]),
      g("Cookware", ["Pots & pans", "Knives", "Bakeware", "Utensils"]),
      g("Dining", ["Plates", "Glassware", "Cutlery", "Serveware"]),
    ],
  },
  {
    name: "Fashion",
    kind: "sneaker",
    promoBg: "#FFEADB",
    promoFg: "#B4431C",
    promoEyebrow: "20% off",
    promoTitle: "Sneakers and bags",
    groups: [
      g("Shoes", ["Sneakers", "Sandals", "Boots", "Formal"]),
      g("Bags", ["Totes", "Backpacks", "Wallets", "Travel"]),
      g("Clothing", ["Tops", "Dresses", "Jeans", "Jackets"]),
    ],
  },
  {
    name: "Beauty",
    kind: "skincare",
    promoBg: "#FFE4EF",
    promoFg: "#B0245F",
    promoEyebrow: "New arrivals",
    promoTitle: "Glow Skincare Duo, ETB 4,600",
    groups: [
      g("Skincare", ["Cleansers", "Serums", "Moisturisers", "Sunscreen"]),
      g("Hair", ["Shampoo", "Oils", "Styling", "Hair tools"]),
      g("Fragrance & makeup", ["Perfume", "Lipstick", "Foundation", "Nails"]),
    ],
  },
  {
    name: "Tools & DIY",
    kind: "drill",
    promoBg: "#E4F2E6",
    promoFg: "#2F7A3C",
    promoEyebrow: "Rent it",
    promoTitle: "Drills from ETB 800 a day",
    groups: [
      g("Power tools", ["Drills", "Saws", "Sanders", "Grinders"]),
      g("Hand tools", ["Tool sets", "Ladders", "Measuring", "Safety gear"]),
      g("Garden", ["Mowers", "Hoses", "Pressure washers", "Planters"]),
    ],
  },
  {
    name: "Events & Party",
    kind: "tent",
    promoBg: "#E4F2E6",
    promoFg: "#2F7A3C",
    promoEyebrow: "Rental bundles",
    promoTitle: "Garden party from ETB 6,500 a day",
    groups: [
      g("Shelter", ["Tents", "Canopies", "Umbrellas", "Flooring"]),
      g("Furniture", ["Chairs", "Tables", "Linens", "Stages"]),
      g("Sound & light", ["Speakers", "PA systems", "String lights", "Projectors"]),
    ],
  },
];
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
function byId(id) {
  return P.filter(function (p) {
    return p.id === id;
  })[0];
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.end = Date.now() + DUR;
    this.lastSlide = Date.now();
    this.state = {
      mode: "buy",
      tab: "best",
      calc: "tent",
      days: 4,
      wished: { p5: true },
      cartCount: 3,
      cartTotal: 99700,
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
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var wished = s.wished || {};
    var addToCart = function (amount) {
      return function () {
        self.setState({ cartCount: (self.state.cartCount || 0) + 1, cartTotal: (self.state.cartTotal || 0) + amount });
      };
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

    var flash = FLASH.map(function (id) {
      var p = byId(id);
      return Object.assign({}, p, {
        priceFmt: fmt(p.buy),
        wasFmt: fmt(p.was),
        discount: "-" + Math.round((1 - p.buy / p.was) * 100) + "%",
        soldPct: p.sold + "%",
        add: addToCart(p.buy),
      });
    });

    var tab = s.tab || "best";
    var tabDef =
      TABS.filter(function (t) {
        return t.id === tab;
      })[0] || TABS[0];
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
    var top = tabDef.ids.map(function (id) {
      var p = byId(id);
      var cm = (s.cardMode || {})[p.id];
      var showRent = !!p.rent && (p.rentOnly || (cm ? cm === "rent" : tab === "rent"));
      var w = !!wished[p.id];
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
        cta: showRent ? "Rent" : "Add",
        addLabel: (showRent ? "Rent " : "Add to cart: ") + p.name,
        add: addToCart(showRent ? p.rent : p.buy),
        heartFill: w ? "#E0522B" : "none",
        heartStroke: w ? "#E0522B" : "#111318",
        wishAria: w ? "true" : "false",
        wishLabel: (w ? "Remove from" : "Save to") + " wishlist: " + p.name,
        toggleWish: function () {
          var n = Object.assign({}, self.state.wished);
          n[p.id] = !n[p.id];
          self.setState({ wished: n });
        },
      });
    });

    var calcId = s.calc || "tent";
    var c =
      CALC.filter(function (x) {
        return x.id === calcId;
      })[0] || CALC[0];
    var days = s.days || 4;
    var rentTotal = c.rate * days;
    var maxV = Math.max(rentTotal, c.buy);
    var saves = c.buy - rentTotal;
    var breakEven = Math.ceil(c.buy / c.rate);
    var rentWins = saves > 0;
    var calc = {
      kind: c.kind,
      name: c.name,
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
    var calcItems = CALC.map(function (x) {
      var on = x.id === calcId;
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

    var wishCount = Object.keys(wished).filter(function (k) {
      return wished[k];
    }).length;

    var slideIdx = s.slide || 0;
    var goTo = function (i) {
      return function () {
        self.lastSlide = Date.now();
        self.setState({ slide: (i + SLIDES.length) % SLIDES.length });
      };
    };
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

    var bundles = BUNDLES.map(function (b) {
      return Object.assign({}, b, {
        count: b.items.length,
        priceFmt: fmt(b.price),
        items: b.items.map(function (l) {
          return { label: l };
        }),
        add: addToCart(b.price),
      });
    });

    return {
      slide: SLIDES[slideIdx],
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
      dept: DEPTS[deptIdx],
      bundles: bundles,
      modes: modes,
      placeholder: mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      hh: pad(Math.floor(secs / 3600)),
      mm: pad(Math.floor((secs % 3600) / 60)),
      ss: pad(secs % 60),
      cats: CATS,
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
      wishCount: wishCount,
      cartCount: s.cartCount || 0,
      cartTotal: fmt(s.cartTotal || 0),
    };
  }
}

function preventSubmit(e) {
  e.preventDefault();
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
            <Link href="/signin" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0", height: "52px" }}>
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
            <a
              href="#"
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
            </a>
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
                    href="/shop"
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
                href="/product"
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
              href="/shop"
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
                  <span style={{ fontSize: "13px", color: "#5E6470" }}>Across [CITY]</span>
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
                    href="/shop"
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
                        href="/product"
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
                          href="/product"
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
                        Add to cart
                      </button>
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
                href="/shop"
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
                href="/shop"
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
                href="/product"
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
                    href="/product"
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
                href="/shop"
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
                        >
                          Book bundle
                        </button>
                      </div>
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
                href="/shop"
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
                href="/shop"
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
                href="/shop"
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
                href="/shop"
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
                href="/shop"
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
                href="/shop"
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
                      <Link href="/shop" style={{ fontSize: "14px", fontWeight: "600", color: "#1679BE" }}>
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
                              <Link href="/shop" style={{ fontSize: "15px", fontWeight: "500", color: "#111318" }} suppressHydrationWarning>
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
                  href="/shop"
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

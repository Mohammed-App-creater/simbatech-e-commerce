"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";
import CategoryMenu from "@/components/CategoryMenu";
import MobileFilters from "@/components/MobileFilters";
import { shopState, connectShop, headerVals, submitSearch, navigate, storeVals, cart, wishlist } from "@/lib/client/store";
import { rentalBasePrice, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";

/* eslint-disable */
// Generated from the Simbatech design export. Markup mirrors the original 1:1; data comes from `initial`.

var RATINGS = [
  { v: 4.8, label: "4.8 & up" },
  { v: 4.7, label: "4.7 & up" },
  { v: 4.5, label: "4.5 & up" },
  { v: 0, label: "Any rating" },
];
var PERIODS = [
  { id: "day", label: "Daily", mult: 1, unit: "/ day", word: "Daily rental" },
  { id: "week", label: "Weekly", mult: 7, unit: "/ week", word: "Weekly rental" },
  { id: "month", label: "Monthly", mult: 30, unit: "/ month", word: "Monthly rental" },
];
var SHOP = [
  { id: "all", label: "All" },
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
];
var PMAX = 150000; // the slider's top end ("ETB 150,000+"): a max at PMAX means no upper limit
var PAGE_SIZE = 24;
var PAGE_BUTTONS = [1, 2, 3, 4];
function fmt(n) {
  return (
    "ETB " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
function anyOn(o) {
  return Object.keys(o || {}).some(function (k) {
    return o[k];
  });
}
function uniq(list) {
  var seen = {};
  return list.filter(function (x) {
    if (!x || seen[x]) return false;
    seen[x] = true;
    return true;
  });
}
function products(initial) {
  return (initial && initial.products) || [];
}
// Department names from the catalogue's categories (fallback: the products themselves)
function deptList(initial) {
  var cats = (initial && initial.categories) || [];
  var d = uniq(
    cats.map(function (c) {
      return c.dept;
    }),
  );
  if (d.length) return d;
  return uniq(
    products(initial).map(function (p) {
      return p.dept;
    }),
  );
}
function brandList(initial) {
  var b = ((initial && initial.brands) || []).map(function (x) {
    return x.name;
  });
  if (b.length) return b;
  return uniq(
    products(initial).map(function (p) {
      return p.brand;
    }),
  );
}
function toSet(list) {
  var o = {};
  (list || []).forEach(function (k) {
    o[k] = true;
  });
  return o;
}
// URL values may be names or slugs; normalise to the names the UI shows
function normDepts(initial, list) {
  var cats = (initial && initial.categories) || [];
  return (list || []).map(function (v) {
    var c = cats.filter(function (x) {
      return x.slug === v;
    })[0];
    return c ? c.label : v;
  });
}
function normBrands(initial, list) {
  var brands = (initial && initial.brands) || [];
  return (list || []).map(function (v) {
    var b = brands.filter(function (x) {
      return x.slug === v || x.name.toLowerCase() === String(v).toLowerCase();
    })[0];
    return b ? b.name : v;
  });
}
function searchText(p) {
  return [p.name, p.brand, p.cat, p.dept, p.kind, p.description].join(" ").toLowerCase();
}
function shopHref(q, mode, cats, brands, deals) {
  var params = new URLSearchParams();
  if (q) params.set("q", q);
  if (mode && mode !== "all") params.set("mode", mode);
  if (deals) params.set("deals", "1");
  Object.keys(cats || {}).forEach(function (k) {
    if (cats[k]) params.append("dept", k);
  });
  Object.keys(brands || {}).forEach(function (k) {
    if (brands[k]) params.append("brand", k);
  });
  var qs = params.toString();
  return "/shop" + (qs ? "?" + qs : "");
}
function readRecent() {
  try {
    var v = JSON.parse(window.localStorage.getItem("st_recent") || "[]");
    return Array.isArray(v)
      ? v.filter(function (x) {
          return typeof x === "string";
        })
      : [];
  } catch (e) {
    return [];
  }
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    var initial = props.initial || {};
    var query = initial.query || {};
    var shopMode = query.mode === "rent" || query.mode === "buy" ? query.mode : "all";
    this.state = {
      mode: shopMode === "rent" ? "rent" : "buy",
      q: query.q || "",
      shop: shopMode,
      deals: !!query.deals, // /shop?deals=1 → only products with a "was" price
      sort: "featured",
      cats: toSet(normDepts(initial, query.depts)),
      brands: toSet(normBrands(initial, query.brands)),
      rating: 0,
      minP: 0,
      maxP: PMAX,
      period: "day",
      availNow: false,
      freeDel: false,
      cardMode: {},
      busy: {}, // productId -> true while a cart call is pending
      done: {}, // productId -> true for ~1.5s after a successful add
      errs: {}, // productId -> error message
      page: 1,
      more: 0, // extra pages appended by "Load more"
      recentIds: [],
    };
    this.timers = [];
  }
  componentDidMount() {
    this.unsubShop = connectShop(this);
    var ids = readRecent();
    if (ids.length) this.setState({ recentIds: ids });
  }
  componentWillUnmount() {
    this.unsubShop && this.unsubShop();
    this.timers.forEach(clearTimeout);
  }
  patchMap(key, id, value) {
    var n = Object.assign({}, this.state[key]);
    if (value === undefined) delete n[id];
    else n[id] = value;
    var o = {};
    o[key] = n;
    this.setState(o);
  }
  renderVals() {
    var self = this;
    var initial = this.props.initial || {};
    var P = products(initial);
    var DEPTS = deptList(initial);
    var CHIPS = DEPTS.slice(0, 8);
    var BRANDS = brandList(initial);
    var shopS = shopState(initial);
    var hv = headerVals(shopS);
    var store = storeVals(shopS);
    var s = this.state || {};
    var cats = s.cats || {};
    var brands = s.brands || {};
    var shop = s.shop || "all";
    var deals = !!s.deals;
    var q = (s.q || "").trim();
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var per =
      PERIODS.filter(function (x) {
        return x.id === (s.period || "day");
      })[0] || PERIODS[0];
    var minP = typeof s.minP === "number" ? s.minP : 0;
    var maxP = typeof s.maxP === "number" ? s.maxP : PMAX;
    var set = function (o) {
      return function () {
        self.setState(o);
      };
    };

    var showRentFor = function (p) {
      var cm = (s.cardMode || {})[p.id];
      return !!p.rent && (!!p.rentOnly || (cm ? cm === "rent" : shop === "rent"));
    };
    var rentFor = function (p) {
      return rentalBasePrice(p.rent, p.plans || [], per.mult);
    };
    var priceOf = function (p) {
      return showRentFor(p) ? rentFor(p) : p.buy;
    };

    // skip: 'cats' | 'brands' | null — used for facet counts
    var match = function (p, skip) {
      if (terms.length) {
        var t = searchText(p);
        for (var i = 0; i < terms.length; i++) if (t.indexOf(terms[i]) < 0) return false;
      }
      if (shop === "buy" && p.rentOnly) return false;
      if (shop === "rent" && !p.rent) return false;
      if (deals && !p.was) return false;
      if (skip !== "cats" && anyOn(cats) && !cats[p.dept] && !cats[p.cat]) return false;
      if (skip !== "brands" && anyOn(brands) && !brands[p.brand]) return false;
      if ((s.rating || 0) > 0 && parseFloat(p.rating) < s.rating) return false;
      if (s.availNow && !p.avail) return false;
      if (s.freeDel && !p.free) return false;
      var pr = priceOf(p);
      if (pr < minP || (maxP < PMAX && pr > maxP)) return false;
      return true;
    };

    var res = P.filter(function (p) {
      return match(p, null);
    });
    var sort = s.sort || "featured";
    if (sort === "price-asc")
      res = res.slice().sort(function (a, b) {
        return priceOf(a) - priceOf(b);
      });
    else if (sort === "price-desc")
      res = res.slice().sort(function (a, b) {
        return priceOf(b) - priceOf(a);
      });
    else if (sort === "rating")
      res = res.slice().sort(function (a, b) {
        return parseFloat(b.rating) - parseFloat(a.rating);
      });

    var card = function (p) {
      var showRent = showRentFor(p);
      var w = wishlist.has(shopS, p.id);
      var busy = !!(s.busy || {})[p.id];
      var done = !!(s.done || {})[p.id];
      var err = (s.errs || {})[p.id];
      var setCard = function (m) {
        return function () {
          var n = Object.assign({}, self.state.cardMode);
          n[p.id] = m;
          self.setState({ cardMode: n });
        };
      };
      var tag = p.rent ? (p.rentOnly ? "For rent" : "Buy or rent") : p.was ? "Sale" : "Buy";
      var sub;
      if (showRent) {
        var plan = (p.plans || []).some(function (pl) {
          return pl.days === per.mult;
        });
        sub =
          per.id !== "day"
            ? plan
              ? fmt(p.rent) + "/day · " + per.mult + "-day rate"
              : fmt(p.rent) + "/day × " + per.mult + " days"
            : p.rentOnly
              ? "Deposit " + fmt(p.deposit || 0)
              : "or buy " + fmt(p.buy);
      } else
        sub = p.rent
          ? "or rent " + fmt(p.rent) + "/day"
          : p.was
            ? "was " + fmt(p.was)
            : p.free
              ? "Free delivery"
              : p.avail
                ? "In stock"
                : p.shipsInDays
                  ? "Ships in " + p.shipsInDays + " days"
                  : "Out of stock";
      if (err) sub = err;
      var href = "/product/" + encodeURIComponent(p.id);
      return Object.assign({}, p, {
        href: href,
        canToggle: !!p.rent && !p.rentOnly,
        pickBuy: setCard("buy"),
        pickRent: setCard("rent"),
        buyAria: showRent ? "false" : "true",
        rentAria: showRent ? "true" : "false",
        buyBg: showRent ? "transparent" : "#FFFFFF",
        buyFg: showRent ? "#5E6470" : "#0D4F8B",
        rentBg: showRent ? "#2F7A3C" : "transparent",
        rentFg: showRent ? "#FFFFFF" : "#5E6470",
        main: fmt(priceOf(p)),
        unit: showRent ? per.unit : "",
        sub: sub,
        tag: tag,
        tagBg: tag === "Sale" ? "#C42A1C" : p.rent ? "#2F7A3C" : "#FFFFFF",
        tagFg: tag === "Sale" || p.rent ? "#FFFFFF" : "#111318",
        cta: showRent ? "Rent" : busy ? "Adding…" : done ? "Added" : "Add",
        ctaBg: showRent ? "#2F7A3C" : "#0D4F8B",
        ctaClass: showRent ? "btn-y" : "btn-t",
        addLabel: (showRent ? "Rent " : "Add to cart: ") + p.name,
        addDisabled: busy,
        add: function () {
          if (showRent) {
            navigate(href);
            return;
          }
          if (self.state.busy[p.id]) return;
          self.patchMap("errs", p.id, undefined);
          self.patchMap("busy", p.id, true);
          cart
            .add({ productId: p.id, mode: "buy", qty: 1 })
            .then(function () {
              self.patchMap("busy", p.id, undefined);
              self.patchMap("done", p.id, true);
              self.timers.push(
                setTimeout(function () {
                  self.patchMap("done", p.id, undefined);
                }, 1500),
              );
            })
            .catch(function (e) {
              self.patchMap("busy", p.id, undefined);
              self.patchMap("errs", p.id, (e && e.message) || "Could not add to cart");
            });
        },
        heartFill: w ? "#E0522B" : "none",
        heartStroke: w ? "#E0522B" : "#111318",
        wishAria: w ? "true" : "false",
        wishLabel: (w ? "Remove from" : "Save to") + " wishlist: " + p.name,
        toggleWish: function () {
          self.patchMap("errs", p.id, undefined);
          Promise.resolve(wishlist.toggle(p.id)).catch(function (e) {
            self.patchMap("errs", p.id, (e && e.message) || "Could not update wishlist");
          });
        },
      });
    };

    // pagination: PAGE_SIZE per page; "Load more" appends the following pages
    var count = res.length;
    var totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
    var page = Math.min(s.page || 1, totalPages);
    var lastShown = Math.min(totalPages, page + (s.more || 0));
    var cards = res.slice((page - 1) * PAGE_SIZE, lastShown * PAGE_SIZE).map(card);
    var canLoad = lastShown < totalPages;

    // header search toggle
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
        pick: set({ mode: m.id }),
      };
    });

    var toggleIn = function (key, val) {
      return function () {
        var n = Object.assign({}, self.state[key]);
        n[val] = !n[val];
        var o = { page: 1, more: 0 };
        o[key] = n;
        self.setState(o);
      };
    };
    var onlyCats = Object.keys(cats).filter(function (k) {
      return cats[k];
    });

    var chips = CHIPS.map(function (c) {
      var on = !!cats[c];
      return {
        label: c,
        aria: on ? "true" : "false",
        bg: on ? "#0D4F8B" : "#FFFFFF",
        fg: on ? "#FFFFFF" : "#111318",
        border: on ? "#0D4F8B" : "#D6E8F7",
        pick: function () {
          var sole = onlyCats.length === 1 && onlyCats[0] === c;
          var n = {};
          if (!sole) n[c] = true;
          self.setState({ cats: n, page: 1, more: 0 });
        },
      };
    });

    // departments, plus any selected category that is not a department (e.g. "Phones" from the nav)
    var catKeys = DEPTS.concat(
      onlyCats.filter(function (c) {
        return DEPTS.indexOf(c) < 0;
      }),
    );
    var catOpts = catKeys.map(function (d) {
      return {
        label: d,
        checked: !!cats[d],
        count: P.filter(function (p) {
          return (p.dept === d || p.cat === d) && match(p, "cats");
        }).length,
        toggle: toggleIn("cats", d),
      };
    });
    var selBrands = Object.keys(brands).filter(function (k) {
      return brands[k];
    });
    var brandOpts = BRANDS.concat(
      selBrands.filter(function (b) {
        return BRANDS.indexOf(b) < 0;
      }),
    ).map(function (b) {
      return {
        label: b,
        checked: !!brands[b],
        count: P.filter(function (p) {
          return p.brand === b && match(p, "brands");
        }).length,
        toggle: toggleIn("brands", b),
      };
    });
    var ratingOpts = RATINGS.map(function (r) {
      return { label: r.label, checked: (s.rating || 0) === r.v, pick: set({ rating: r.v, page: 1, more: 0 }) };
    });
    var periods = PERIODS.map(function (x) {
      var on = x.id === per.id;
      return {
        label: x.label,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#2F7A3C" : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        pick: set({ period: x.id }),
      };
    });
    var switches = [
      { key: "availNow", label: "Available now", sub: "Ready to deliver today" },
      { key: "freeDel", label: "Free delivery", sub: "No delivery fee" },
    ].map(function (x) {
      var on = !!s[x.key];
      return {
        label: x.label,
        sub: x.sub,
        aria: on ? "true" : "false",
        track: on ? "#2F7A3C" : "#C9C6BE",
        knob: on ? "21px" : "3px",
        toggle: function () {
          var o = { page: 1, more: 0 };
          o[x.key] = !self.state[x.key];
          self.setState(o);
        },
      };
    });
    var shopModes = SHOP.map(function (t) {
      var on = t.id === shop;
      var fgOn = t.id === "rent" ? "#2F7A3C" : "#0D4F8B";
      return {
        label: t.label,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? fgOn : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        pick: set({ shop: t.id, cardMode: {}, page: 1, more: 0 }),
      };
    });

    // active filter chips
    var BLUE = { bg: "#EAF3FA", fg: "#0D4F8B" },
      GREEN = { bg: "#E4F2E6", fg: "#2F7A3C" };
    var active = [];
    var chip = function (label, tone, remove) {
      active.push({ label: label, bg: tone.bg, fg: tone.fg, remove: remove });
    };
    if (q)
      chip("“" + q + "”", BLUE, function () {
        self.setState({ q: "" });
        navigate(shopHref("", self.state.shop, self.state.cats, self.state.brands, self.state.deals));
      });
    if (deals)
      chip("Deals", { bg: "#FBE9E6", fg: "#C42A1C" }, function () {
        self.setState({ deals: false, page: 1, more: 0 });
        navigate(shopHref(self.state.q, self.state.shop, self.state.cats, self.state.brands, false));
      });
    if (shop !== "all") chip(shop === "rent" ? "For rent" : "To buy", shop === "rent" ? GREEN : BLUE, set({ shop: "all", cardMode: {} }));
    onlyCats.forEach(function (c) {
      chip(c, BLUE, toggleIn("cats", c));
    });
    selBrands.forEach(function (b) {
      chip(b, BLUE, toggleIn("brands", b));
    });
    if (minP > 0 || maxP < PMAX) chip(fmt(minP) + " – " + (maxP < PMAX ? fmt(maxP) : fmt(PMAX) + "+"), BLUE, set({ minP: 0, maxP: PMAX }));
    if (per.id !== "day") chip(per.word, GREEN, set({ period: "day" }));
    if ((s.rating || 0) > 0) chip("Rated " + s.rating + "+", BLUE, set({ rating: 0 }));
    if (s.availNow) chip("Available now", BLUE, set({ availNow: false }));
    if (s.freeDel) chip("Free delivery", BLUE, set({ freeDel: false }));
    var clearAll = function () {
      self.setState({
        q: "",
        shop: "all",
        deals: false,
        cats: {},
        brands: {},
        rating: 0,
        minP: 0,
        maxP: PMAX,
        period: "day",
        availNow: false,
        freeDel: false,
        cardMode: {},
        page: 1,
        more: 0,
      });
      navigate("/shop");
    };

    var clamp = function (v) {
      return Math.max(0, Math.min(PMAX, v));
    };
    var lo = clamp(Math.min(minP, maxP)),
      hi = clamp(Math.max(minP, maxP));
    var num = function (e) {
      var v = parseInt(String(e && e.target ? e.target.value : "").replace(/[^0-9]/g, ""), 10);
      return isNaN(v) ? 0 : v;
    };

    var pages = PAGE_BUTTONS.map(function (n) {
      var on = n === page;
      return {
        n: n,
        aria: on ? "page" : "false",
        bg: on ? "#0D4F8B" : "#FFFFFF",
        fg: on ? "#FFFFFF" : "#111318",
        border: on ? "#0D4F8B" : "#E6E4DE",
        disabled: n > totalPages,
        cursor: n > totalPages ? "default" : "pointer",
        pick: set({ page: n, more: 0 }),
      };
    });

    // recently viewed: localStorage ids once mounted; before that (and on the server) the first 5 products
    var byId = function (id) {
      return P.filter(function (p) {
        return p.id === id;
      })[0];
    };
    var recentProducts = (s.recentIds || []).map(byId).filter(Boolean).slice(0, 5);
    if (!recentProducts.length) recentProducts = P.slice(0, 5);
    var recent = recentProducts.map(function (p) {
      return {
        href: "/product/" + encodeURIComponent(p.id),
        name: p.name,
        kind: p.kind,
        bg: p.bg,
        price: p.rentOnly && p.rent ? fmt(p.rent) + " / day" : fmt(p.buy),
        priceFg: p.rentOnly ? "#2F7A3C" : "#0D4F8B",
      };
    });

    var scope =
      onlyCats.length === 1
        ? "in " + onlyCats[0]
        : onlyCats.length > 1
          ? "in " + onlyCats.length + " categories"
          : q
            ? ""
            : "across all departments";
    if (q) scope = "for “" + q + "”" + (scope ? " " + scope : "");
    if (deals) scope = "on sale" + (scope ? " " + scope : "");

    return {
      city: store.city,
      freeOver: "Free delivery on orders over " + fmt(FREE_DELIVERY_THRESHOLD),
      deals: deals,
      crumb: deals ? "Deals" : "Shop",
      eyebrow: deals ? "Sale prices" : "All departments",
      heroLead: deals ? "Deals & " : "Shop & ",
      heroAccent: deals ? "offers" : "rent",
      heroText: deals
        ? "Reduced prices while stock lasts. Delivered to your door, and collected when you are done renting."
        : "Buy to keep, or rent by the day. Delivered to your door, and collected when you are done.",
      modes: modes,
      placeholder: mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      searchQ: q,
      onSearch: function (e) {
        submitSearch(e, self.state.mode);
      },
      chips: chips,
      resultLabel: count + (q ? (count === 1 ? " result" : " results") : count === 1 ? " product" : " products"),
      scopeLabel: scope + (shop === "rent" ? ", for rent" : shop === "buy" ? ", to buy" : ""),
      shopModes: shopModes,
      sort: sort,
      onSort: function (e) {
        self.setState({ sort: e.target.value });
      },
      active: active,
      hasActive: active.length > 0,
      noActive: active.length === 0,
      clearAll: clearAll,
      catOpts: catOpts,
      brandOpts: brandOpts,
      ratingOpts: ratingOpts,
      periods: periods,
      switches: switches,
      minP: minP,
      maxP: maxP,
      onMin: function (e) {
        self.setState({ minP: num(e), page: 1, more: 0 });
      },
      onMax: function (e) {
        self.setState({ maxP: num(e), page: 1, more: 0 });
      },
      trackLeft: (lo / PMAX) * 100 + "%",
      trackRight: (hi / PMAX) * 100 + "%",
      trackWidth: ((hi - lo) / PMAX) * 100 + "%",
      first: cards.slice(0, 6),
      rest: cards.slice(6),
      showPromo: count > 0,
      empty: count === 0,
      count: cards.length,
      total: count,
      loadLabel: canLoad ? "Load more" : "You have seen them all",
      loadDisabled: !canLoad,
      loadCursor: canLoad ? "pointer" : "default",
      loadMore: function () {
        if (canLoad) self.setState({ more: (self.state.more || 0) + 1 });
      },
      pages: pages,
      nextDisabled: page >= totalPages,
      nextCursor: page >= totalPages ? "default" : "pointer",
      nextPage: set({ page: Math.min(totalPages, page + 1), more: 0 }),
      recent: recent,
      wishCount: hv.wishCount,
      cartCount: hv.cartCount,
      cartTotal: hv.cartTotal,
      accountHref: hv.accountHref,
      accountHello: hv.accountHello,
    };
  }
}

function deptHref(d) {
  return "/shop?dept=" + encodeURIComponent(d);
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.lift{transition:transform .2s ease, box-shadow .2s ease}\n.lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(13,79,139,.3)}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.btn-w:hover{background:#FFFFFF;color:#0D4F8B}\n.ghost:hover{background:#F1F0EC}\n.nav a:hover{color:#0D4F8B}\n.opt:hover{background:#F6F5F1}\ninput[type=checkbox],input[type=radio]{accent-color:#0D4F8B;width:18px;height:18px;margin:0;cursor:pointer;flex-shrink:0}\n@media (prefers-reduced-motion: reduce){.lift{transition:none}}\n";

export default class ShopScreen extends Component {
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
                <strong suppressHydrationWarning>{vals.city}</strong>
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
                {vals.freeOver}
              </span>
            </div>
            <nav aria-label="Utility" className="nav" style={{ display: "flex", gap: "24px" }}>
              <Link href="/p/sell-with-us" style={{ color: "#E6F0F9" }}>
                Sell or list with us
              </Link>
              <Link href="/track" style={{ color: "#E6F0F9" }}>
                Track order
              </Link>
              <Link href="/p/help" style={{ color: "#E6F0F9" }}>
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
            <CategoryMenu />
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
                defaultValue={vals.searchQ}
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
            <Link href="/shop?deals=1" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#C42A1C", fontWeight: "600" }}>
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
            style={{ padding: "20px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "16px" }}
            data-sec="breadcrumb-hero-strip"
          >
            <nav aria-label="Breadcrumb" style={{ fontSize: "13px", color: "#5E6470" }}>
              {" "}
              <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                <li>
                  <Link href="/" style={{ color: "#5E6470" }}>
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg
                    width="12"
                    height="12"
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
                <li aria-current="page" style={{ fontWeight: "600", color: "#111318" }} suppressHydrationWarning>
                  {vals.crumb}
                </li>
              </ol>{" "}
            </nav>
            <div
              style={{ position: "relative", height: "288px", background: "#EAF3FA", borderRadius: "32px", overflow: "hidden" }}
              data-banner
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  right: "150px",
                  top: "-110px",
                  width: "440px",
                  height: "440px",
                  borderRadius: "999px",
                  background: "#D6E8F7",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{
                  position: "absolute",
                  left: "48px",
                  top: "40px",
                  width: "780px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
                data-abs="text"
                data-w
              >
                <span
                  style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                  suppressHydrationWarning
                >
                  {vals.eyebrow}
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
                  suppressHydrationWarning
                >
                  {vals.heroLead}
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontWeight: "400",
                      letterSpacing: "-0.02em",
                      color: "#2F7A3C",
                    }}
                  >
                    {vals.heroAccent}
                  </span>
                </h1>
                <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "#3A3F4A" }} suppressHydrationWarning>
                  {vals.heroText}
                </p>
                <div
                  role="group"
                  aria-label="Quick category filter"
                  style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "6px" }}
                >
                  {(vals.chips || []).map((c, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        onClick={c.pick}
                        aria-pressed={c.aria}
                        style={{
                          height: "40px",
                          padding: "0 16px",
                          border: `1.5px solid ${c.border}`,
                          borderRadius: "999px",
                          background: c.bg,
                          color: c.fg,
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                        suppressHydrationWarning
                      >
                        {c.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>{" "}
              <div
                style={{ position: "absolute", right: "190px", top: "22px", zoom: "1.05", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"camera"} />
              </div>{" "}
              <div
                style={{ position: "absolute", right: "24px", bottom: "6px", zoom: "0.95", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"tent"} />
              </div>{" "}
              <div
                style={{ position: "absolute", right: "290px", bottom: "-8px", zoom: "0.7", width: "200px", height: "200px" }}
                data-abs="art"
              >
                <Render kind={"headphones"} />
              </div>{" "}
            </div>
          </section>
          <section style={{ padding: "36px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "16px" }} data-sec="toolbar">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "30px",
                    fontWeight: "700",
                    letterSpacing: "-0.035em",
                  }}
                  aria-live="polite"
                  suppressHydrationWarning
                >
                  {vals.resultLabel}
                </h2>
                <span style={{ fontSize: "14px", color: "#5E6470" }} suppressHydrationWarning>
                  {vals.scopeLabel}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  role="group"
                  aria-label="Show items to buy, rent or both"
                  style={{ display: "flex", gap: "4px", padding: "4px", background: "#F3F2EE", borderRadius: "14px" }}
                >
                  {(vals.shopModes || []).map((t, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        onClick={t.pick}
                        aria-pressed={t.aria}
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
                <label htmlFor="sort" style={{ fontSize: "14px", color: "#5E6470" }}>
                  Sort by
                </label>
                <select
                  id="sort"
                  value={vals.sort}
                  onChange={vals.onSort}
                  style={{
                    height: "48px",
                    padding: "0 14px",
                    border: "1px solid #E6E4DE",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    font: "inherit",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111318",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  <option value="featured">Featured</option> <option value="price-asc">Price: low to high</option>{" "}
                  <option value="price-desc">Price: high to low</option> <option value="rating">Top rated</option>{" "}
                </select>
              </div>
            </div>
            <div style={{ minHeight: "44px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              {vals.hasActive ? (
                <>
                  {(vals.active || []).map((a, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        onClick={a.remove}
                        aria-label={`Remove filter: ${a.label}`}
                        style={{
                          height: "36px",
                          padding: "0 8px 0 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          border: "none",
                          borderRadius: "999px",
                          background: a.bg,
                          color: a.fg,
                          font: "inherit",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                        suppressHydrationWarning
                      >
                        {a.label}
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
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </Fragment>
                  ))}
                  <button
                    type="button"
                    onClick={vals.clearAll}
                    style={{
                      height: "44px",
                      padding: "0 10px",
                      border: "none",
                      background: "transparent",
                      font: "inherit",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0D4F8B",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Clear all
                  </button>
                </>
              ) : null}
              {vals.noActive ? (
                <>
                  <span style={{ fontSize: "14px", color: "#5E6470" }}>
                    No filters applied. Use the chips above or the filters on the left to narrow things down.
                  </span>
                </>
              ) : null}
            </div>
          </section>
          <section
            style={{ padding: "16px var(--gutter) 0", display: "flex", gap: "40px", alignItems: "flex-start" }}
            data-row
            data-sec="sidebar-grid"
          >
            <MobileFilters>
              <aside
                aria-label="Filters"
                style={{
                  width: "280px",
                  flexShrink: "0",
                  boxSizing: "border-box",
                  border: "1px solid #EFEDE8",
                  borderRadius: "24px",
                  padding: "8px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <fieldset
                  style={{
                    margin: "0",
                    padding: "18px 0",
                    border: "none",
                    borderBottom: "1px solid #EFEDE8",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <legend
                    style={{
                      padding: "0 0 10px",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      letterSpacing: "-0.02em",
                      float: "left",
                      width: "100%",
                    }}
                  >
                    Category
                  </legend>
                  {(vals.catOpts || []).map((c, i0) => (
                    <Fragment key={i0}>
                      <label
                        className="opt"
                        style={{
                          height: "44px",
                          margin: "0 -8px",
                          padding: "0 8px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <input type="checkbox" checked={c.checked} onChange={c.toggle} />
                        <span style={{ flexGrow: "1", fontWeight: "500" }} suppressHydrationWarning>
                          {c.label}
                        </span>
                        <span style={{ fontSize: "13px", color: "#5E6470", fontVariantNumeric: "tabular-nums" }} suppressHydrationWarning>
                          {c.count}
                        </span>
                      </label>
                    </Fragment>
                  ))}
                </fieldset>
                <fieldset
                  style={{
                    margin: "0",
                    padding: "18px 0 22px",
                    border: "none",
                    borderBottom: "1px solid #EFEDE8",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <legend
                    style={{
                      padding: "0",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      letterSpacing: "-0.02em",
                      float: "left",
                      width: "100%",
                    }}
                  >
                    Price (ETB)
                  </legend>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#5E6470" }}>
                      Min
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={vals.minP}
                        onChange={vals.onMin}
                        style={{
                          height: "44px",
                          boxSizing: "border-box",
                          width: "100%",
                          padding: "0 12px",
                          border: "1px solid #E6E4DE",
                          borderRadius: "12px",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111318",
                        }}
                        suppressHydrationWarning
                      />
                    </label>
                    <span aria-hidden="true" style={{ paddingTop: "18px", color: "#5E6470" }}>
                      –
                    </span>
                    <label style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#5E6470" }}>
                      Max
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={vals.maxP}
                        onChange={vals.onMax}
                        style={{
                          height: "44px",
                          boxSizing: "border-box",
                          width: "100%",
                          padding: "0 12px",
                          border: "1px solid #E6E4DE",
                          borderRadius: "12px",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111318",
                        }}
                        suppressHydrationWarning
                      />
                    </label>
                  </div>
                  <div aria-hidden="true" style={{ position: "relative", height: "20px", margin: "0 9px" }}>
                    {" "}
                    <div
                      style={{
                        position: "absolute",
                        left: "-9px",
                        right: "-9px",
                        top: "8px",
                        height: "4px",
                        borderRadius: "999px",
                        background: "#EFEDE8",
                      }}
                      data-abs="deco"
                    />{" "}
                    <div
                      style={{
                        position: "absolute",
                        left: vals.trackLeft,
                        width: vals.trackWidth,
                        top: "8px",
                        height: "4px",
                        borderRadius: "999px",
                        background: "#0D4F8B",
                      }}
                      data-abs="deco"
                    />{" "}
                    <div
                      style={{
                        position: "absolute",
                        left: vals.trackLeft,
                        top: "1px",
                        marginLeft: "-9px",
                        width: "18px",
                        height: "18px",
                        boxSizing: "border-box",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        border: "3px solid #0D4F8B",
                      }}
                      data-abs="deco"
                    />{" "}
                    <div
                      style={{
                        position: "absolute",
                        left: vals.trackRight,
                        top: "1px",
                        marginLeft: "-9px",
                        width: "18px",
                        height: "18px",
                        boxSizing: "border-box",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        border: "3px solid #0D4F8B",
                      }}
                      data-abs="deco"
                    />{" "}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#5E6470" }}>
                    <span>ETB 0</span>
                    <span>ETB 150,000+</span>
                  </div>
                </fieldset>
                <fieldset
                  style={{
                    margin: "0",
                    padding: "18px 0 22px",
                    border: "none",
                    borderBottom: "1px solid #EFEDE8",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <legend
                    style={{
                      padding: "0",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      letterSpacing: "-0.02em",
                      float: "left",
                      width: "100%",
                    }}
                  >
                    Rental period
                  </legend>
                  <div
                    role="group"
                    aria-label="Rental period"
                    style={{ display: "flex", gap: "4px", padding: "4px", background: "#F3F2EE", borderRadius: "14px" }}
                  >
                    {(vals.periods || []).map((r, i0) => (
                      <Fragment key={i0}>
                        <button
                          type="button"
                          onClick={r.pick}
                          aria-pressed={r.aria}
                          style={{
                            flex: "1",
                            height: "40px",
                            border: "none",
                            borderRadius: "11px",
                            background: r.bg,
                            color: r.fg,
                            font: "inherit",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: r.shadow,
                          }}
                          suppressHydrationWarning
                        >
                          {r.label}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", lineHeight: "1.5", color: "#5E6470" }}>
                    Changes how rental prices are shown. Each item shows its refundable deposit.
                  </span>
                </fieldset>
                <fieldset
                  style={{
                    margin: "0",
                    padding: "18px 0",
                    border: "none",
                    borderBottom: "1px solid #EFEDE8",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <legend
                    style={{
                      padding: "0 0 10px",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      letterSpacing: "-0.02em",
                      float: "left",
                      width: "100%",
                    }}
                  >
                    Brand
                  </legend>
                  {(vals.brandOpts || []).map((b, i0) => (
                    <Fragment key={i0}>
                      <label
                        className="opt"
                        style={{
                          height: "44px",
                          margin: "0 -8px",
                          padding: "0 8px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <input type="checkbox" checked={b.checked} onChange={b.toggle} />
                        <span style={{ flexGrow: "1", fontWeight: "500" }} suppressHydrationWarning>
                          {b.label}
                        </span>
                        <span style={{ fontSize: "13px", color: "#5E6470", fontVariantNumeric: "tabular-nums" }} suppressHydrationWarning>
                          {b.count}
                        </span>
                      </label>
                    </Fragment>
                  ))}
                </fieldset>
                <fieldset
                  style={{
                    margin: "0",
                    padding: "18px 0",
                    border: "none",
                    borderBottom: "1px solid #EFEDE8",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <legend
                    style={{
                      padding: "0 0 10px",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      letterSpacing: "-0.02em",
                      float: "left",
                      width: "100%",
                    }}
                  >
                    Rating
                  </legend>
                  {(vals.ratingOpts || []).map((r, i0) => (
                    <Fragment key={i0}>
                      <label
                        className="opt"
                        style={{
                          height: "44px",
                          margin: "0 -8px",
                          padding: "0 8px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <input type="radio" name="rating" checked={r.checked} onChange={r.pick} />
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }} suppressHydrationWarning>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true">
                            <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" />
                          </svg>
                          {r.label}
                        </span>
                      </label>
                    </Fragment>
                  ))}
                </fieldset>
                <div style={{ padding: "14px 0 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(vals.switches || []).map((w, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={w.aria}
                        onClick={w.toggle}
                        style={{
                          height: "48px",
                          padding: "0",
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          color: "#111318",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700" }} suppressHydrationWarning>
                            {w.label}
                          </span>
                          <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                            {w.sub}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          style={{
                            position: "relative",
                            width: "44px",
                            height: "26px",
                            flexShrink: "0",
                            borderRadius: "999px",
                            background: w.track,
                            transition: "background-color .2s ease",
                          }}
                        >
                          {" "}
                          <span
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: w.knob,
                              width: "20px",
                              height: "20px",
                              borderRadius: "999px",
                              background: "#FFFFFF",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              transition: "left .2s ease",
                            }}
                            data-abs="deco"
                          />{" "}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </aside>
            </MobileFilters>
            <div style={{ flexGrow: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "36px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }} data-cols="3">
                {(vals.first || []).map((p, i0) => (
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
                          <span suppressHydrationWarning>
                            {p.brand}
                            {" · "}
                            {p.cat}
                          </span>
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
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            gap: "10px",
                            paddingTop: "6px",
                          }}
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
                            className={p.ctaClass}
                            onClick={p.add}
                            disabled={p.addDisabled}
                            aria-label={p.addLabel}
                            style={{
                              height: "42px",
                              padding: "0 14px",
                              border: "none",
                              borderRadius: "12px",
                              background: p.ctaBg,
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
                {vals.showPromo ? (
                  <>
                    <Link
                      href="/shop?mode=rent"
                      className="lift"
                      style={{
                        gridColumn: "span 3",
                        position: "relative",
                        height: "210px",
                        background: "#1F5E33",
                        borderRadius: "28px",
                        overflow: "hidden",
                        color: "#FFFFFF",
                      }}
                      data-span="3"
                      data-banner
                    >
                      {" "}
                      <div
                        style={{
                          position: "absolute",
                          right: "80px",
                          top: "-120px",
                          width: "400px",
                          height: "400px",
                          borderRadius: "999px",
                          background: "#2F7A3C",
                        }}
                        data-abs="deco"
                        data-w
                      />{" "}
                      <div
                        style={{
                          position: "absolute",
                          left: "40px",
                          top: "36px",
                          bottom: "36px",
                          width: "520px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                        data-abs="text"
                        data-w
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#8FD19A",
                            }}
                          >
                            Rental bundles
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
                            {"Garden party bundle from "}
                            <span
                              style={{
                                fontFamily: "'Instrument Serif', serif",
                                fontStyle: "italic",
                                fontWeight: "400",
                                letterSpacing: "-0.02em",
                                color: "#8FD19A",
                              }}
                            >
                              ETB 6,500 / day
                            </span>
                          </span>
                          <span style={{ fontSize: "15px", color: "#D5E9D8" }}>
                            Canopy tent, 20 chairs, speaker and string lights. Set up and collected.
                          </span>
                        </div>
                        <span
                          className="btn-w"
                          style={{
                            alignSelf: "flex-start",
                            height: "44px",
                            padding: "0 18px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            borderRadius: "12px",
                            background: "#FFFFFF",
                            color: "#1F5E33",
                            fontSize: "14px",
                            fontWeight: "700",
                          }}
                        >
                          See the bundle
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
                        style={{ position: "absolute", right: "60px", bottom: "-12px", zoom: "1.15", width: "200px", height: "200px" }}
                        data-abs="art"
                      >
                        <Render kind={"tent"} />
                      </div>{" "}
                    </Link>
                  </>
                ) : null}
                {(vals.rest || []).map((p, i0) => (
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
                          <span suppressHydrationWarning>
                            {p.brand}
                            {" · "}
                            {p.cat}
                          </span>
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
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            gap: "10px",
                            paddingTop: "6px",
                          }}
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
                            className={p.ctaClass}
                            onClick={p.add}
                            disabled={p.addDisabled}
                            aria-label={p.addLabel}
                            style={{
                              height: "42px",
                              padding: "0 14px",
                              border: "none",
                              borderRadius: "12px",
                              background: p.ctaBg,
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
                {vals.empty ? (
                  <>
                    <div
                      style={{
                        gridColumn: "span 3",
                        height: "320px",
                        borderRadius: "28px",
                        background: "#F6F5F1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        textAlign: "center",
                      }}
                      data-span="3"
                    >
                      <span
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "28px",
                          fontWeight: "700",
                          letterSpacing: "-0.035em",
                        }}
                      >
                        Nothing matches those filters
                      </span>
                      <span style={{ fontSize: "15px", color: "#5E6470" }}>Try removing a filter or widening the price range.</span>
                      <button
                        type="button"
                        className="btn-t"
                        onClick={vals.clearAll}
                        style={{
                          height: "48px",
                          padding: "0 22px",
                          border: "none",
                          borderRadius: "14px",
                          background: "#0D4F8B",
                          color: "#FFFFFF",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  paddingTop: "28px",
                  borderTop: "1px solid #EFEDE8",
                }}
                data-sec="pagination"
              >
                <span style={{ fontSize: "14px", color: "#5E6470" }}>
                  {"Showing "}
                  <strong style={{ color: "#111318" }} suppressHydrationWarning>
                    {vals.count}
                  </strong>
                  {" of " + vals.total + " products"}
                </span>
                <button
                  type="button"
                  onClick={vals.loadMore}
                  disabled={vals.loadDisabled}
                  style={{
                    height: "52px",
                    padding: "0 28px",
                    border: "1.5px solid #0D4F8B",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    font: "inherit",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#0D4F8B",
                    cursor: vals.loadCursor,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  suppressHydrationWarning
                >
                  {vals.loadLabel}
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
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </button>
                <nav aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {(vals.pages || []).map((pg, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        onClick={pg.pick}
                        disabled={pg.disabled}
                        aria-label={`Page ${pg.n}`}
                        aria-current={pg.aria}
                        style={{
                          width: "44px",
                          height: "44px",
                          border: `1px solid ${pg.border}`,
                          borderRadius: "12px",
                          background: pg.bg,
                          color: pg.fg,
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: pg.cursor,
                        }}
                        suppressHydrationWarning
                      >
                        {pg.n}
                      </button>
                    </Fragment>
                  ))}
                  <button
                    type="button"
                    onClick={vals.nextPage}
                    disabled={vals.nextDisabled}
                    aria-label="Next page"
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "1px solid #E6E4DE",
                      borderRadius: "12px",
                      background: "#FFFFFF",
                      color: "#111318",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: vals.nextCursor,
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
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </section>
          <section
            style={{ padding: "96px var(--gutter) 0", display: "flex", flexDirection: "column", gap: "24px" }}
            data-sec="recently-viewed"
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                  Pick up where you left off
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "32px",
                    lineHeight: "1",
                    fontWeight: "700",
                    letterSpacing: "-0.035em",
                  }}
                >
                  Recently viewed
                </h2>
              </div>
              <Link
                href="/account"
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
                View history
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
              {(vals.recent || []).map((r, i0) => (
                <Fragment key={i0}>
                  <Link
                    href={r.href}
                    className="lift"
                    style={{
                      height: "104px",
                      boxSizing: "border-box",
                      padding: "10px",
                      border: "1px solid #EFEDE8",
                      borderRadius: "22px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "#FFFFFF",
                      color: "#111318",
                    }}
                  >
                    <span
                      style={{
                        width: "84px",
                        height: "84px",
                        flexShrink: "0",
                        borderRadius: "16px",
                        background: r.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ zoom: "0.4", width: "200px", height: "200px" }}>
                        <Render kind={r.kind} />
                      </div>
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                      <span
                        style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "-0.01em", lineHeight: "1.25" }}
                        suppressHydrationWarning
                      >
                        {r.name}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: r.priceFg }} suppressHydrationWarning>
                        {r.price}
                      </span>
                    </span>
                  </Link>
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

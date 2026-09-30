"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import SiteFooter from "@/components/SiteFooter";
import {
  shopState,
  connectShop,
  headerVals,
  submitSearch,
  navigate,
  storeVals,
  cart,
  wishlist,
  auth,
  notifications,
  paymentMethods,
  payments,
  api,
} from "@/lib/client/store";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";
import PhoneInput from "@/components/PhoneInput";
import { isCompletePhone } from "@/lib/phone";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var DAY = 86400000;
var TZ_OFFSET = 3 * 3600000; // Addis Ababa (UTC+3, no DST): day math and dates render the same on server and client
var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var WDL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var MOL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var ST = {
  out: { label: "Out for delivery", bg: "#EAF3FA", fg: "#0D4F8B", dot: "#1679BE" },
  processing: { label: "Processing", bg: "#FFF0E0", fg: "#9A4A06", dot: "#F08A24" },
  delivered: { label: "Delivered", bg: "#E4F2E6", fg: "#2F7A3C", dot: "#418D4D" },
  cancelled: { label: "Cancelled", bg: "#FDECEA", fg: "#B02418", dot: "#C42A1C" },
};
var STATUS_KEY = { PLACED: "processing", PACKED: "processing", OUT_FOR_DELIVERY: "out", DELIVERED: "delivered", CANCELLED: "cancelled" };
var TRACK = [
  { status: "PLACED", label: "Ordered" },
  { status: "PACKED", label: "Packed" },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { status: "DELIVERED", label: "Delivered" },
];
var METHOD = { telebirr: "Telebirr", card: "card", cod: "cash on delivery" };
var ORDER_TABS = [
  {
    id: "all",
    label: "All",
    test: function () {
      return true;
    },
  },
  {
    id: "way",
    label: "On the way",
    test: function (o) {
      return o.status === "PACKED" || o.status === "OUT_FOR_DELIVERY";
    },
  },
  {
    id: "delivered",
    label: "Delivered",
    test: function (o) {
      return o.status === "DELIVERED";
    },
  },
  {
    id: "cancelled",
    label: "Cancelled",
    test: function (o) {
      return o.status === "CANCELLED";
    },
  },
];
var NAV = ["overview", "orders", "rentals", "wishlist", "addresses", "payment", "settings"];
var NOTIF = [
  { id: "sms", label: "SMS updates", sub: "Delivery and pickup times" },
  { id: "email", label: "Email receipts", sub: "Orders, rentals and refunds" },
  { id: "remind", label: "Return reminders", sub: "A day before each rental ends" },
  { id: "deals", label: "Deals and offers", sub: "Members-only prices" },
];
var EMPTY_ADDR = { label: "", line1: "", area: "", city: "", phone: "", notes: "", isDefault: false };
var EMPTY_PM = { kind: "telebirr", phone: "", brand: "Visa", last4: "", expiry: "", holder: "" };
var EMPTY_PW = { current: "", password: "", confirm: "" };
var NOTIF_DEFAULT = { sms: true, email: true, remind: true, deals: false };
var PAY_STATUS = {
  paid: { label: "Paid", bg: "#E4F2E6", fg: "#2F7A3C", dot: "#418D4D" },
  pending: { label: "Payment pending", bg: "#FFF0E0", fg: "#9A4A06", dot: "#F08A24" },
  failed: { label: "Payment failed", bg: "#FDECEA", fg: "#B02418", dot: "#C42A1C" },
  refunded: { label: "Refunded", bg: "#EAF3FA", fg: "#0D4F8B", dot: "#1679BE" },
};
var CARD_NOTE =
  "We only keep the card's brand, last four digits and expiry so you can pick it at checkout — the full number is never stored.";
function fmt(n) {
  return (
    "ETB " +
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
// Local (Addis) calendar day number of an ISO timestamp.
function dayNo(iso) {
  return Math.floor((Date.parse(iso) + TZ_OFFSET) / DAY);
}
// A Date whose UTC fields are the local calendar day of `iso` (read with getUTC*).
function local(iso) {
  return new Date(Date.parse(iso) + TZ_OFFSET);
}
function dFmt(iso) {
  var d = local(iso);
  return WD[d.getUTCDay()] + " " + d.getUTCDate() + " " + MO[d.getUTCMonth()];
}
function dShort(iso) {
  var d = local(iso);
  return d.getUTCDate() + " " + MO[d.getUTCMonth()];
}
function dLong(iso) {
  var d = local(iso);
  return d.getUTCDate() + " " + MO[d.getUTCMonth()] + " " + d.getUTCFullYear();
}
function stamp(iso) {
  var d = local(iso);
  var hh = d.getUTCHours();
  var mm = d.getUTCMinutes();
  return dShort(iso) + ", " + (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
}
function plural(n, w) {
  return n + " " + w + (n === 1 ? "" : "s");
}
function errText(err) {
  return (err && err.message) || "Something went wrong. Please try again.";
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    var init = props.initial || {};
    var orders = init.orders || [];
    var user = init.user || {};
    this.state = {
      section: NAV.indexOf(init.tab) >= 0 ? init.tab : "overview", // /account?tab=…
      mode: "buy",
      pickup: {},
      orderTab: "all",
      openOrder: orders.length ? orders[0].id : null,
      rentTab: "active",
      notif: Object.assign({}, NOTIF_DEFAULT, init.notifications || {}),
      notifError: "",
      orders: orders,
      addresses: init.addresses || [],
      extBusy: null,
      extError: null,
      payBusy: null, // order id being sent to the gateway
      payError: null, // { id, message }
      adding: {},
      addErr: {},
      addrEdit: null, // address id being edited, or "new"
      addrForm: EMPTY_ADDR,
      addrBusy: false,
      addrError: "",
      // Payment methods
      pm: init.paymentMethods || [],
      pmAdding: false,
      pmForm: EMPTY_PM,
      pmBusy: false,
      pmError: "", // list-level error
      pmFieldError: null, // { field, message } inside the add form
      // Settings: profile
      profile: { name: user.name || "", phone: user.phone || "", email: user.email || "" },
      profileBusy: false,
      profileDone: false,
      profileError: null, // { field, message }
      // Settings: password
      pw: EMPTY_PW,
      pwBusy: false,
      pwDone: false,
      pwError: null, // { field, message }
    };
  }
  componentDidMount() {
    this.unsubShop = connectShop(this);
  }
  componentWillUnmount() {
    this.unsubShop && this.unsubShop();
    Object.keys(this.addT || {}).forEach((k) => clearTimeout(this.addT[k]));
    clearTimeout(this.profileT);
    clearTimeout(this.pwT);
  }
  payNow(order) {
    var self = this;
    if (this.state.payBusy) return;
    this.setState({ payBusy: order.id, payError: null });
    payments.payNow(order.id).catch(function (err) {
      self.setState({ payBusy: null, payError: { id: order.id, message: errText(err) } });
    });
  }
  toggleNotif(id) {
    var self = this;
    var before = this.state.notif;
    var next = Object.assign({}, before);
    next[id] = !before[id];
    this.setState({ notif: next, notifError: "" }); // optimistic
    var patch = {};
    patch[id] = next[id];
    notifications
      .update(patch)
      .then(function (res) {
        self.setState({ notif: Object.assign({}, self.state.notif, res || {}) });
      })
      .catch(function (err) {
        var reverted = Object.assign({}, self.state.notif);
        reverted[id] = before[id];
        self.setState({ notif: reverted, notifError: errText(err) });
      });
  }
  pmAction(promise) {
    var self = this;
    if (this.state.pmBusy) return;
    this.setState({ pmBusy: true, pmError: "", pmFieldError: null });
    promise()
      .then(function (methods) {
        self.setState({ pm: methods || [], pmBusy: false, pmAdding: false, pmForm: EMPTY_PM });
      })
      .catch(function (err) {
        self.setState({ pmBusy: false, pmError: errText(err) });
      });
  }
  savePaymentMethod() {
    var self = this;
    var f = this.state.pmForm;
    if (this.state.pmBusy) return;
    var fail = function (field, message) {
      self.setState({ pmFieldError: { field: field, message: message } });
    };
    var body;
    if (f.kind === "telebirr") {
      if (!isCompletePhone(f.phone)) return fail("phone", "Enter the 9 digits after +251, starting with 9 or 7 (e.g. 911 234 567).");
      body = { kind: "telebirr", phone: f.phone.trim() };
    } else {
      if (!/^\d{4}$/.test(f.last4.trim())) return fail("last4", "Enter the last four digits of the card.");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry.trim())) return fail("expiry", "Enter the expiry as MM/YY.");
      body = { kind: "card", brand: f.brand, last4: f.last4.trim(), expiry: f.expiry.trim(), holder: f.holder.trim() || undefined };
    }
    this.setState({ pmBusy: true, pmError: "", pmFieldError: null });
    paymentMethods
      .add(body)
      .then(function (methods) {
        self.setState({ pm: methods || [], pmBusy: false, pmAdding: false, pmForm: EMPTY_PM });
      })
      .catch(function (err) {
        if (err && err.field) self.setState({ pmBusy: false, pmFieldError: { field: err.field, message: errText(err) } });
        else self.setState({ pmBusy: false, pmFieldError: { field: "", message: errText(err) } });
      });
  }
  saveProfile() {
    var self = this;
    var p = this.state.profile;
    if (this.state.profileBusy) return;
    if (!p.name.trim()) {
      this.setState({ profileError: { field: "name", message: "Enter your name." } });
      return;
    }
    if (p.phone.trim() && !isCompletePhone(p.phone)) {
      this.setState({
        profileError: { field: "phone", message: "Enter the 9 digits after +251, starting with 9 or 7 (e.g. 911 234 567)." },
      });
      return;
    }
    this.setState({ profileBusy: true, profileDone: false, profileError: null });
    auth
      .updateProfile({ name: p.name.trim(), email: p.email.trim(), phone: p.phone.trim() })
      .then(function (user) {
        self.setState({
          profileBusy: false,
          profileDone: true,
          profile: { name: user.name || "", phone: user.phone || "", email: user.email || "" },
        });
        clearTimeout(self.profileT);
        self.profileT = setTimeout(function () {
          self.setState({ profileDone: false });
        }, 2000);
      })
      .catch(function (err) {
        self.setState({ profileBusy: false, profileError: { field: (err && err.field) || "", message: errText(err) } });
      });
  }
  savePassword(hasPassword) {
    var self = this;
    var f = this.state.pw;
    if (this.state.pwBusy) return;
    var fail = function (field, message) {
      self.setState({ pwError: { field: field, message: message } });
    };
    if (hasPassword && !f.current) return fail("current", "Enter your current password.");
    if (f.password.length < 8) return fail("password", "Use at least 8 characters.");
    if (f.password !== f.confirm) return fail("confirm", "The passwords don't match.");
    this.setState({ pwBusy: true, pwDone: false, pwError: null });
    auth
      .changePassword(hasPassword ? f.current : "", f.password)
      .then(function () {
        self.setState({ pwBusy: false, pwDone: true, pw: EMPTY_PW });
        clearTimeout(self.pwT);
        self.pwT = setTimeout(function () {
          self.setState({ pwDone: false });
        }, 2500);
      })
      .catch(function (err) {
        var field = (err && err.field) || "";
        if (field === "new" || field === "newPassword") field = "password";
        self.setState({ pwBusy: false, pwError: { field: field, message: errText(err) } });
      });
  }
  extendItem(item) {
    var self = this;
    if (this.state.extBusy) return;
    this.setState({ extBusy: item.id, extError: null });
    api("POST", "/api/rentals/" + item.id + "/extend", { days: 1 })
      .then(function (res) {
        var charge = (res && res.charge) || 0;
        var orders = self.state.orders.map(function (o) {
          if (
            !o.items.some(function (i) {
              return i.id === item.id;
            })
          )
            return o;
          return Object.assign({}, o, {
            totals: Object.assign({}, o.totals, { rentals: o.totals.rentals + charge, total: o.totals.total + charge }),
            items: o.items.map(function (i) {
              if (i.id !== item.id) return i;
              return Object.assign({}, i, {
                rentEnd: i.rentEnd ? new Date(Date.parse(i.rentEnd) + DAY).toISOString() : i.rentEnd,
                rentDays: (i.rentDays || 0) + 1,
                extendedDays: (i.extendedDays || 0) + 1,
                extraCharge: (i.extraCharge || 0) + charge,
              });
            }),
          });
        });
        self.setState({ orders: orders, extBusy: null });
      })
      .catch(function (err) {
        self.setState({ extBusy: null, extError: { id: item.id, message: errText(err) } });
      });
  }
  addToCart(p) {
    var self = this;
    if (this.state.adding[p.id]) return;
    if (p.rentOnly) {
      navigate("/product/" + p.id);
      return;
    }
    var set = function (k, v, e) {
      var adding = Object.assign({}, self.state.adding);
      var addErr = Object.assign({}, self.state.addErr);
      adding[k] = v;
      addErr[k] = e || "";
      self.setState({ adding: adding, addErr: addErr });
    };
    set(p.id, "pending");
    cart
      .add({ productId: p.id, mode: "buy", qty: 1 })
      .then(function () {
        set(p.id, "added");
        self.addT = self.addT || {};
        clearTimeout(self.addT[p.id]);
        self.addT[p.id] = setTimeout(function () {
          set(p.id, null);
        }, 1500);
      })
      .catch(function (err) {
        set(p.id, null, errText(err));
      });
  }
  saveAddress() {
    var self = this;
    var s = this.state;
    if (s.addrBusy) return;
    var f = s.addrForm;
    var body = {
      label: f.label,
      line1: f.line1,
      area: f.area,
      city: f.city,
      phone: f.phone,
      notes: f.notes || undefined,
      isDefault: !!f.isDefault,
    };
    if (!isCompletePhone(f.phone)) {
      this.setState({ addrError: "Enter the 9 digits after +251, starting with 9 or 7 (e.g. 911 234 567)." });
      return;
    }
    this.setState({ addrBusy: true, addrError: "" });
    var req = s.addrEdit === "new" ? api("POST", "/api/addresses", body) : api("PATCH", "/api/addresses/" + s.addrEdit, body);
    req
      .then(function (res) {
        self.setState({ addresses: res.addresses, addrBusy: false, addrEdit: null, addrForm: EMPTY_ADDR });
      })
      .catch(function (err) {
        self.setState({ addrBusy: false, addrError: errText(err) });
      });
  }
  addressAction(method, id, body) {
    var self = this;
    if (this.state.addrBusy) return;
    this.setState({ addrBusy: true, addrError: "" });
    api(method, "/api/addresses/" + id, body)
      .then(function (res) {
        self.setState({ addresses: res.addresses, addrBusy: false, addrEdit: null, addrForm: EMPTY_ADDR });
      })
      .catch(function (err) {
        self.setState({ addrBusy: false, addrError: errText(err) });
      });
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var init = this.props.initial || {};
    var shop = shopState(init);
    var hv = headerVals(shop);
    var user = shop.user || init.user || { name: "", phone: null, email: null, createdAt: init.today };
    var firstName = (user.name || "").trim().split(/\s+/)[0] || "there";
    var today = dayNo(init.today);
    var set = function (o) {
      return function () {
        self.setState(o);
      };
    };
    var section = s.section || "overview";

    var products = init.products || [];
    var store = storeVals(shop);
    // Order items carry the product slug and the day rate they were booked at.
    var hrefOf = function (item) {
      return item && item.productSlug ? "/product/" + item.productSlug : "/shop";
    };

    var is = {};
    var nv = {};
    NAV.forEach(function (id) {
      var on = id === section;
      is[id] = on;
      nv[id] = {
        aria: on ? "page" : "false",
        bg: on ? "#EAF3FA" : "transparent",
        fg: on ? "#0D4F8B" : "#3A3F4A",
        pick: set({ section: id }),
      };
    });

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

    // Rentals (items with mode "rent" on orders that weren't cancelled)
    var orders = s.orders || [];
    var rentalItems = [];
    orders.forEach(function (o) {
      if (o.status === "CANCELLED") return;
      o.items.forEach(function (i) {
        if (i.mode === "rent" && i.rentStart && i.rentEnd) rentalItems.push({ item: i, order: o });
      });
    });
    var pickup = s.pickup || {};
    var decorateRental = function (x) {
      var r = x.item;
      var rate = r.rentRate || (r.extendedDays ? Math.round((r.extraCharge || 0) / r.extendedDays) : 0);
      var start = dayNo(r.rentStart);
      var end = dayNo(r.rentEnd);
      var total = Math.max(1, end - start);
      var started = today >= start;
      var left = Math.max(0, end - today);
      var elapsed = started ? Math.min(total, Math.max(1, today - start + 1)) : 0;
      var pctNum = Math.round((elapsed / total) * 100);
      var booked = !!pickup[r.id];
      var busy = s.extBusy === r.id;
      var err = s.extError && s.extError.id === r.id ? s.extError.message : "";
      return {
        id: r.id,
        orderId: x.order.id,
        name: r.name,
        kind: r.kind,
        bg: r.bg,
        href: hrefOf(r),
        end: end,
        startDay: start,
        started: started,
        status: r.rentalStatus,
        rateFmt: rate ? fmt(rate) : "day rate",
        startFmt: dFmt(r.rentStart),
        endFmt: dFmt(r.rentEnd),
        endShort: dShort(r.rentEnd),
        total: total,
        elapsed: elapsed,
        pct: pctNum + "%",
        pctNum: pctNum,
        leftLabel: !started ? "Starts " + dShort(r.rentStart) : left === 0 ? "Due today" : plural(left, "day") + " left",
        leftFg: left <= 2 ? "#9A4A06" : "#2F7A3C",
        extended: (r.extendedDays || 0) > 0 || !!err,
        extLabel: plural(r.extendedDays || 0, "day"),
        extraFmt: fmt(r.extraCharge || 0),
        extMsg: err ? err : "Extended by " + plural(r.extendedDays || 0, "day") + " · " + fmt(r.extraCharge || 0) + " added to your bill",
        cost: r.lineTotal + (r.extraCharge || 0),
        costFmt: fmt(r.lineTotal + (r.extraCharge || 0)),
        deposit: r.deposit || 0,
        depositFmt: fmt(r.deposit || 0),
        booked: booked,
        notBooked: !booked,
        busy: busy,
        extendText: busy ? "Extending… · " : "Extend +1 day · ",
        extendShort: busy ? "Extending…" : "Extend +1 day",
        window: x.order.deliveryWindow,
        pickupTime: x.order.deliveryWindow || "9am – 8pm",
        extend: function () {
          self.extendItem(r);
        },
        togglePickup: function () {
          var n = Object.assign({}, self.state.pickup);
          n[r.id] = !n[r.id];
          self.setState({ pickup: n });
        },
      };
    };
    var rentals = rentalItems.map(decorateRental);
    var byEnd = function (a, b) {
      return a.end - b.end;
    };
    // Overview: everything not yet returned (scheduled or active).
    var current = rentals
      .filter(function (r) {
        return r.status === "scheduled" || r.status === "active";
      })
      .sort(byEnd);
    // Rentals tab: active = started, upcoming = not started yet, past = returned.
    var active = current.filter(function (r) {
      return r.status === "active" || r.started;
    });
    var upcoming = current
      .filter(function (r) {
        return r.status !== "active" && !r.started;
      })
      .sort(function (a, b) {
        return a.startDay - b.startDay;
      });
    var past = rentals
      .filter(function (r) {
        return r.status === "returned";
      })
      .sort(function (a, b) {
        return b.end - a.end;
      });
    var nextEnd = current[0];
    var depositsHeld = current.reduce(function (t, r) {
      return t + r.deposit;
    }, 0);

    // Orders
    var openOrder = s.openOrder;
    var orderTab = s.orderTab || "all";
    var decorate = function (o) {
      var open = o.id === openOrder;
      var at = {};
      (o.events || []).forEach(function (e) {
        at[e.status] = e.at;
      });
      var cancelled = o.status === "CANCELLED";
      var raw;
      if (cancelled) {
        raw = [{ label: "Ordered", time: stamp(o.createdAt), state: "done" }];
        raw.push({ label: "Cancelled", time: at.CANCELLED ? stamp(at.CANCELLED) : "", state: "cancel" });
        if (o.payment.status === "refunded") raw.push({ label: "Refund issued", time: "Refunded", state: "done" });
      } else {
        var reached = o.step || 0;
        raw = TRACK.map(function (t, i) {
          var state = i <= reached ? "done" : i === reached + 1 ? "current" : "todo";
          var time = at[t.status]
            ? stamp(at[t.status])
            : state === "current"
              ? "In progress"
              : i === 3 && o.deliveryDate
                ? "Expected " + dFmt(o.deliveryDate)
                : "Pending";
          return { label: i === 1 && state === "current" ? "Packing" : t.label, time: time, state: state };
        });
      }
      var lastDone = -1;
      raw.forEach(function (x, i) {
        if (x.state !== "todo") lastDone = i;
      });
      var steps = raw.map(function (x, i) {
        var done = x.state === "done";
        var cancel = x.state === "cancel";
        var cur = x.state === "current";
        var col = cancel ? "#C42A1C" : "#0D4F8B";
        return {
          label: x.label,
          time: x.time,
          done: done || cancel,
          dotBg: done || cancel ? col : "#FFFFFF",
          dotBorder: done || cancel ? col : cur ? "#1679BE" : "#C9C6BE",
          ring: cur ? "0 0 0 5px rgba(22,121,190,0.18)" : "none",
          lineBg: i === raw.length - 1 ? "transparent" : i < lastDone ? "#0D4F8B" : "#D9D6CE",
          labelFg: x.state === "todo" ? "#5E6470" : cancel ? "#B02418" : "#111318",
        };
      });
      var key = STATUS_KEY[o.status] || "processing";
      var pickupOrder = o.fulfilment === "pickup";
      var slot = o.deliveryDate ? dFmt(o.deliveryDate) + (o.deliveryWindow ? ", " + o.deliveryWindow : "") : "";
      var headline =
        key === "cancelled"
          ? "Cancelled" + (o.payment.status === "refunded" ? " · refunded" : "")
          : key === "delivered"
            ? (pickupOrder ? "Collected " : "Delivered ") + dFmt(at.DELIVERED || o.createdAt)
            : key === "out"
              ? "Arriving " + (slot || "soon")
              : pickupOrder
                ? "Ready for pickup " + (slot || "soon")
                : slot
                  ? "Expected by " + dFmt(o.deliveryDate)
                  : "Being packed";
      var n = o.items.length;
      var first = o.items[0];
      var inProgress = key === "out" || key === "processing";
      var pay = o.payment || {};
      var payKey = PAY_STATUS[pay.status] ? pay.status : "pending";
      var payStatus =
        payKey === "pending" && pay.method === "cod"
          ? Object.assign({}, PAY_STATUS.pending, { label: "Pay on delivery" })
          : PAY_STATUS[payKey];
      var paying = s.payBusy === o.id;
      var payErr = s.payError && s.payError.id === o.id ? s.payError.message : "";
      return {
        id: o.id,
        no: o.number,
        date: dLong(o.createdAt),
        st: ST[key],
        thumbs: o.items.map(function (i) {
          return { kind: i.kind, bg: i.bg, name: i.name };
        }),
        itemCount: plural(n, "item"),
        names: o.items
          .map(function (i) {
            return i.name;
          })
          .join(", "),
        totalFmt: fmt(o.totals.total),
        open: open,
        aria: open ? "true" : "false",
        chev: open ? "rotate(180deg)" : "none",
        border: open ? "#BFD8EE" : "#EFEDE8",
        headline: headline,
        trackingNo: "Tracking no. " + o.number,
        where:
          (o.address ? o.address.line1 + ", " + o.address.city : "Pick up in store") +
          " · " +
          (o.payment.status === "paid" ? "Paid with " : "Paying with ") +
          (METHOD[o.payment.method] || o.payment.method),
        steps: steps,
        cta: key === "delivered" || key === "cancelled" ? "Buy again" : "View items",
        ctaHref: key === "delivered" || key === "cancelled" ? hrefOf(first) : "/order-confirmed/" + o.id,
        trackText: inProgress ? "Track" : "Details",
        trackLabel: (inProgress ? "Track order " : "Order details ") + o.number,
        payStatus: payStatus,
        payable: !!pay.payable && !cancelled,
        paying: paying,
        payLabel: paying ? "Opening payment…" : "Pay now",
        payError: payErr,
        payNow: function () {
          self.payNow(o);
        },
        toggle: function () {
          self.setState({ openOrder: self.state.openOrder === o.id ? null : o.id });
        },
        track: function () {
          navigate("/order-confirmed/" + o.id);
        },
      };
    };
    var recent = orders.slice(0, 4).map(decorate);
    var tabDef =
      ORDER_TABS.filter(function (t) {
        return t.id === orderTab;
      })[0] || ORDER_TABS[0];
    var orderList = orders.filter(tabDef.test).map(decorate);
    var orderTabs = ORDER_TABS.map(function (t) {
      var on = t.id === orderTab;
      return {
        label: t.label,
        count: orders.filter(t.test).length,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#111318" : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        countBg: on ? "#0D4F8B" : "#E6E4DE",
        countFg: on ? "#FFFFFF" : "#3A3F4A",
        pick: set({ orderTab: t.id }),
      };
    });
    var onTheWay = orders.filter(ORDER_TABS[1].test).length;
    var outToday = orders.filter(function (o) {
      return o.status === "OUT_FOR_DELIVERY";
    }).length;

    // Rental tabs
    var rentTab = s.rentTab || "active";
    var rentDefs = [
      { id: "active", label: "Active", count: active.length },
      { id: "upcoming", label: "Upcoming", count: upcoming.length },
      { id: "past", label: "Past", count: past.length },
    ];
    var rentTabs = rentDefs.map(function (t) {
      var on = t.id === rentTab;
      return {
        label: t.label,
        count: t.count,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#111318" : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        countBg: on ? "#2F7A3C" : "#E6E4DE",
        countFg: on ? "#FFFFFF" : "#3A3F4A",
        pick: set({ rentTab: t.id }),
      };
    });
    var isPast = rentTab === "past";
    var rentOther = (isPast ? past : upcoming).map(function (r) {
      return {
        name: r.name,
        kind: r.kind,
        bg: r.bg,
        hasK2: false,
        k2: r.kind,
        costFmt: r.costFmt,
        dates: r.startFmt + " to " + r.endFmt + " · " + plural(r.total, "day"),
        costSub: isPast ? "Deposit refunded" : "+ deposit " + r.depositFmt,
        note: isPast ? "Returned " + r.endShort + " · deposit refunded" : "Delivery " + r.startFmt + (r.window ? ", " + r.window : ""),
        pill: isPast ? "Returned" : "Upcoming",
        cta1: isPast ? "Leave a review" : "Change dates",
        cta2: isPast ? "Rent again" : "View booking",
        href1: isPast ? r.href : "/order-confirmed/" + r.orderId,
        href2: isPast ? r.href : "/order-confirmed/" + r.orderId,
        pillFg: isPast ? "#3A3F4A" : "#0D4F8B",
        pillDot: isPast ? "#8A8F99" : "#1679BE",
      };
    });

    // Deposit refunds: returned rentals are refunded, everything else is held.
    var deposits = rentals
      .filter(function (r) {
        return r.deposit > 0;
      })
      .slice(0, 4)
      .map(function (r) {
        var refunded = r.status === "returned";
        return {
          name: r.name,
          kind: r.kind,
          bg: r.bg,
          sub: (refunded ? "Returned " + r.endShort + " · refunded" : "Refund after inspection on return") + " · " + r.depositFmt,
          badge: refunded ? "Refunded" : "Held",
          badgeBg: refunded ? "#E4F2E6" : "#FFF4C7",
          badgeFg: refunded ? "#2F7A3C" : "#7A5700",
        };
      });

    // Wishlist
    var wish = shop.wishlist || [];
    var wishProducts = wish
      .map(function (id) {
        return products.filter(function (p) {
          return p.id === id;
        })[0];
      })
      .filter(Boolean);
    var wishList = wishProducts.map(function (p) {
      var st = s.adding[p.id];
      var err = s.addErr[p.id];
      return {
        name: p.name,
        cat: p.cat,
        kind: p.kind,
        bg: p.bg,
        href: "/product/" + p.id,
        onSale: !!p.was,
        priceFmt: p.rentOnly && p.rent ? fmt(p.rent) + "/day" : fmt(p.buy),
        priceFg: p.was ? "#C42A1C" : "#111318",
        sub: err ? err : p.was ? "was " + fmt(p.was) : p.rent ? "or rent " + fmt(p.rent) + "/day" : "Free delivery",
        addLabel: st === "pending" ? "Adding…" : st === "added" ? "Added" : p.rentOnly ? "Rent" : "Add",
        busy: st === "pending",
        add: function () {
          self.addToCart(p);
        },
        remove: function () {
          wishlist.toggle(p.id).catch(function () {});
        },
      };
    });

    // Addresses
    var editing = s.addrEdit;
    var form = s.addrForm || EMPTY_ADDR;
    var field = function (k) {
      return function (e) {
        var f = Object.assign({}, self.state.addrForm);
        f[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        self.setState({ addrForm: f, addrError: "" });
      };
    };
    var addrForm = {
      label: form.label,
      line1: form.line1,
      area: form.area,
      city: form.city,
      phone: form.phone,
      notes: form.notes || "",
      isDefault: !!form.isDefault,
      on: field,
      error: s.addrError || "",
      busy: !!s.addrBusy,
      saveLabel: s.addrBusy ? "Saving…" : "Save address",
      save: function (e) {
        if (e) e.preventDefault();
        self.saveAddress();
      },
      cancel: set({ addrEdit: null, addrForm: EMPTY_ADDR, addrError: "" }),
    };
    var addresses = (s.addresses || []).map(function (a) {
      var d = !!a.isDefault;
      return {
        id: a.id,
        label: a.label,
        lines: [user.name, a.line1, a.area + ", " + a.city, a.phone].concat(a.notes ? [a.notes] : []).join("\n"),
        isDefault: d,
        notDefault: !d,
        border: d ? "#1679BE" : "#EFEDE8",
        editing: editing === a.id,
        viewing: editing !== a.id,
        edit: set({
          addrEdit: a.id,
          addrError: "",
          addrForm: { label: a.label, line1: a.line1, area: a.area, city: a.city, phone: a.phone, notes: a.notes || "", isDefault: d },
        }),
        makeDefault: function () {
          self.addressAction("PATCH", a.id, { isDefault: true });
        },
        remove: function () {
          self.addressAction("DELETE", a.id);
        },
      };
    });
    var defaultAddr = (s.addresses || []).filter(function (a) {
      return a.isDefault;
    })[0];

    // Settings: notifications (saved on each toggle)
    var nstate = s.notif || {};
    var notif = NOTIF.map(function (n) {
      var on = !!nstate[n.id];
      return {
        label: n.label,
        sub: n.sub,
        aria: on ? "true" : "false",
        track: on ? "#2F7A3C" : "#C9C6BE",
        knob: on ? "25px" : "3px",
        toggle: function () {
          self.toggleNotif(n.id);
        },
      };
    });

    // Settings: profile
    var prof = s.profile || { name: "", phone: "", email: "" };
    var profErr = s.profileError || null;
    var profField = function (k) {
      return function (e) {
        var p = Object.assign({}, self.state.profile);
        p[k] = e.target.value;
        self.setState({ profile: p, profileError: null, profileDone: false });
      };
    };
    var profileForm = {
      name: prof.name,
      phone: prof.phone,
      email: prof.email,
      on: profField,
      busy: !!s.profileBusy,
      saveLabel: s.profileBusy ? "Saving…" : s.profileDone ? "Saved" : "Save changes",
      saveBg: s.profileDone ? "#276833" : "#2F7A3C",
      errorFor: function (k) {
        return profErr && profErr.field === k ? profErr.message : "";
      },
      error: profErr && ["name", "phone", "email"].indexOf(profErr.field) < 0 ? profErr.message : "",
      save: function (e) {
        if (e) e.preventDefault();
        self.saveProfile();
      },
    };

    // Settings: password
    var hasPassword = !!user.hasPassword;
    var pw = s.pw || EMPTY_PW;
    var pwErr = s.pwError || null;
    var pwField = function (k) {
      return function (e) {
        var p = Object.assign({}, self.state.pw);
        p[k] = e.target.value;
        self.setState({ pw: p, pwError: null, pwDone: false });
      };
    };
    var passwordForm = {
      hasPassword: hasPassword,
      title: hasPassword ? "Change password" : "Set a password",
      intro: hasPassword
        ? "Use at least 8 characters."
        : (user.google ? "You sign in with Google" : "You sign in with a code sent to your phone") +
          ". Add a password to sign in with your email or phone too.",
      current: pw.current,
      password: pw.password,
      confirm: pw.confirm,
      on: pwField,
      busy: !!s.pwBusy,
      saveLabel: s.pwBusy
        ? "Saving…"
        : s.pwDone
          ? hasPassword
            ? "Password updated"
            : "Password set"
          : hasPassword
            ? "Update password"
            : "Set password",
      saveBg: s.pwDone ? "#276833" : "#2F7A3C",
      errorFor: function (k) {
        return pwErr && pwErr.field === k ? pwErr.message : "";
      },
      error: pwErr && ["current", "password", "confirm"].indexOf(pwErr.field) < 0 ? pwErr.message : "",
      save: function (e) {
        if (e) e.preventDefault();
        self.savePassword(hasPassword);
      },
    };

    // Payment methods
    var pmForm = s.pmForm || EMPTY_PM;
    var pmFieldErr = s.pmFieldError || null;
    var pmField = function (k) {
      return function (e) {
        var f = Object.assign({}, self.state.pmForm);
        f[k] = e.target.value;
        self.setState({ pmForm: f, pmFieldError: null });
      };
    };
    var pmKinds = [
      { id: "telebirr", label: "Telebirr" },
      { id: "card", label: "Card" },
    ].map(function (k) {
      var on = pmForm.kind === k.id;
      return {
        label: k.label,
        aria: on ? "true" : "false",
        bg: on ? "#0D4F8B" : "transparent",
        fg: on ? "#FFFFFF" : "#0D4F8B",
        pick: function () {
          self.setState({ pmForm: Object.assign({}, self.state.pmForm, { kind: k.id }), pmFieldError: null });
        },
      };
    });
    var pmBrands = ["Visa", "Mastercard"].map(function (b) {
      var on = pmForm.brand === b;
      return {
        label: b,
        aria: on ? "true" : "false",
        bg: on ? "#0D4F8B" : "transparent",
        fg: on ? "#FFFFFF" : "#0D4F8B",
        pick: function () {
          self.setState({ pmForm: Object.assign({}, self.state.pmForm, { brand: b }), pmFieldError: null });
        },
      };
    });
    var pmAddForm = {
      isTelebirr: pmForm.kind === "telebirr",
      isCard: pmForm.kind === "card",
      kinds: pmKinds,
      brands: pmBrands,
      phone: pmForm.phone,
      last4: pmForm.last4,
      expiry: pmForm.expiry,
      holder: pmForm.holder,
      on: pmField,
      busy: !!s.pmBusy,
      cardNote: CARD_NOTE,
      saveLabel: s.pmBusy ? "Saving…" : pmForm.kind === "telebirr" ? "Save Telebirr number" : "Save card",
      errorFor: function (k) {
        return pmFieldErr && pmFieldErr.field === k ? pmFieldErr.message : "";
      },
      error: pmFieldErr && ["phone", "last4", "expiry", "holder", "brand"].indexOf(pmFieldErr.field) < 0 ? pmFieldErr.message : "",
      save: function (e) {
        if (e) e.preventDefault();
        self.savePaymentMethod();
      },
      cancel: set({ pmAdding: false, pmForm: EMPTY_PM, pmFieldError: null }),
    };
    var pmList = (s.pm || []).map(function (m) {
      var tele = m.kind === "telebirr";
      var d = !!m.isDefault;
      var brand = (m.brand || "Card").toUpperCase();
      return {
        id: m.id,
        isTelebirr: tele,
        isCard: !tele,
        brand: brand,
        brandFg: brand === "VISA" ? "#1A1F71" : brand === "MASTERCARD" ? "#EB001B" : "#0D4F8B",
        brandItalic: brand === "VISA" ? "italic" : "normal",
        sub: tele ? "Mobile money" : "Expires " + (m.expiry || "—"),
        main: tele ? m.phone || "" : "•••• " + (m.last4 || "····"),
        holder: !tele && m.holder ? m.holder : "",
        isDefault: d,
        notDefault: !d,
        makeDefault: function () {
          self.pmAction(function () {
            return paymentMethods.update(m.id, { isDefault: true });
          });
        },
        remove: function () {
          self.pmAction(function () {
            return paymentMethods.remove(m.id);
          });
        },
      };
    });

    var td = local(init.today);
    return {
      is: is,
      nv: nv,
      modes: modes,
      search: function (e) {
        submitSearch(e, self.state.mode);
      },
      placeholder: mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more",
      userName: user.name,
      firstName: firstName,
      initials: hv.userInitials,
      memberSince: "Member since " + local(user.createdAt || init.today).getUTCFullYear(),
      refundTo: user.phone ? "To Telebirr " + user.phone : "To your payment method",
      storeCity: store.city,
      storePhone: store.phone,
      storeTel: "tel:" + String(store.phone || "").replace(/[^\d+]/g, ""),
      depositDays: plural(store.depositRefundDays, "working day"),
      freeOver: fmt(FREE_DELIVERY_THRESHOLD),
      signOut: function (e) {
        if (e) e.preventDefault();
        auth
          .signOut()
          .then(function () {
            navigate("/");
          })
          .catch(function () {
            navigate("/");
          });
      },
      todayLabel: WDL[td.getUTCDay()] + ", " + td.getUTCDate() + " " + MOL[td.getUTCMonth()],
      active: current,
      noActive: current.length === 0,
      rentActive: active,
      noRentActive: active.length === 0,
      activeCount: current.length,
      nextReturn: nextEnd ? nextEnd.endFmt : "none",
      depositsHeldFmt: fmt(depositsHeld),
      onTheWay: onTheWay,
      outToday: outToday,
      recent: recent,
      orderList: orderList,
      orderTabs: orderTabs,
      noOrders: orderList.length === 0,
      goOrdersWay: set({ section: "orders", orderTab: "way" }),
      rentTabs: rentTabs,
      rt: { active: rentTab === "active", other: rentTab !== "active" },
      rentOther: rentOther,
      noRentOther: rentTab !== "active" && rentOther.length === 0,
      deposits: deposits,
      noDeposits: deposits.length === 0,
      wishList: wishList,
      wishCount: hv.wishCount,
      noWish: wishList.length === 0,
      wishOnSale: wishProducts.filter(function (p) {
        return !!p.was;
      }).length,
      goWish: set({ section: "wishlist" }),
      addresses: addresses,
      addrForm: addrForm,
      addingAddr: editing === "new",
      notAddingAddr: editing !== "new",
      addrListError: editing ? "" : s.addrError || "",
      newAddress: set({
        addrEdit: "new",
        addrError: "",
        addrForm: Object.assign({}, EMPTY_ADDR, { phone: user.phone || "", city: defaultAddr ? defaultAddr.city : "" }),
      }),
      profileForm: profileForm,
      passwordForm: passwordForm,
      notif: notif,
      notifError: s.notifError || "",
      pmList: pmList,
      noPm: pmList.length === 0,
      pmAdding: !!s.pmAdding,
      notPmAdding: !s.pmAdding,
      pmBusy: !!s.pmBusy,
      pmError: s.pmError || "",
      pmAddForm: pmAddForm,
      startPm: set({ pmAdding: true, pmForm: Object.assign({}, EMPTY_PM, { phone: user.phone || "" }), pmFieldError: null, pmError: "" }),
      cardNote: CARD_NOTE,
      cartCount: hv.cartCount,
      cartTotal: hv.cartTotal,
    };
  }
}

var FIELD = {
  height: "50px",
  boxSizing: "border-box",
  padding: "0 16px",
  border: "1px solid #E6E4DE",
  borderRadius: "14px",
  font: "inherit",
  fontSize: "15px",
  color: "#111318",
};
var FIELD_LABEL = { display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" };

// Inline add/edit form for an address card (reuses the Settings form field styles).
function AddressForm({ f, idp }) {
  return (
    <form onSubmit={f.save} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label htmlFor={idp + "-label"} style={FIELD_LABEL}>
        Label
        <input id={idp + "-label"} type="text" placeholder="Home, Work…" value={f.label} onChange={f.on("label")} style={FIELD} />
      </label>
      <label htmlFor={idp + "-line1"} style={FIELD_LABEL}>
        Street and house
        <input id={idp + "-line1"} type="text" value={f.line1} onChange={f.on("line1")} style={FIELD} />
      </label>
      <label htmlFor={idp + "-area"} style={FIELD_LABEL}>
        Area / sub-city
        <input id={idp + "-area"} type="text" value={f.area} onChange={f.on("area")} style={FIELD} />
      </label>
      <label htmlFor={idp + "-city"} style={FIELD_LABEL}>
        City
        <input id={idp + "-city"} type="text" value={f.city} onChange={f.on("city")} style={FIELD} />
      </label>
      <label htmlFor={idp + "-phone"} style={FIELD_LABEL}>
        Phone
        <PhoneInput id={idp + "-phone"} value={f.phone} onChange={f.on("phone")} height={50} radius={14} border="1px solid #E6E4DE" />
      </label>
      <label htmlFor={idp + "-notes"} style={FIELD_LABEL}>
        Notes for the driver
        <input id={idp + "-notes"} type="text" value={f.notes} onChange={f.on("notes")} style={FIELD} />
      </label>
      <label
        htmlFor={idp + "-default"}
        style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#3A3F4A", cursor: "pointer" }}
      >
        <input id={idp + "-default"} type="checkbox" checked={f.isDefault} onChange={f.on("isDefault")} />
        Use as my default address
      </label>
      {f.error ? (
        <span role="alert" style={{ fontSize: "12px", color: "#B02418" }}>
          {f.error}
        </span>
      ) : null}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="submit"
          className="btn-y"
          disabled={f.busy}
          style={{
            height: "44px",
            padding: "0 14px",
            border: "none",
            borderRadius: "12px",
            background: "#2F7A3C",
            color: "#FFFFFF",
            font: "inherit",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {f.saveLabel}
        </button>
        <button
          type="button"
          onClick={f.cancel}
          style={{
            height: "44px",
            padding: "0 14px",
            border: "none",
            borderRadius: "12px",
            background: "transparent",
            font: "inherit",
            fontSize: "13px",
            fontWeight: "700",
            color: "#0D4F8B",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

var FIELD_ERR = { fontSize: "12px", color: "#B02418" };
var SEG_WRAP = { display: "flex", gap: "2px", padding: "3px", background: "#EAF3FA", borderRadius: "12px", alignSelf: "flex-start" };
function segStyle(x) {
  return {
    height: "30px",
    padding: "0 14px",
    border: "none",
    borderRadius: "9px",
    background: x.bg,
    color: x.fg,
    font: "inherit",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  };
}
function FieldError({ text }) {
  return text ? (
    <span role="alert" style={FIELD_ERR}>
      {text}
    </span>
  ) : null;
}

// Inline form for a new Telebirr number or card reminder (same field styles as the address form).
function PaymentMethodForm({ f, idp }) {
  return (
    <form onSubmit={f.save} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div role="group" aria-label="Payment method type" style={SEG_WRAP}>
        {(f.kinds || []).map((k, i0) => (
          <Fragment key={i0}>
            <button type="button" onClick={k.pick} aria-pressed={k.aria} style={segStyle(k)}>
              {k.label}
            </button>
          </Fragment>
        ))}
      </div>
      {f.isTelebirr ? (
        <label htmlFor={idp + "-phone"} style={FIELD_LABEL}>
          Telebirr phone number
          <PhoneInput
            id={idp + "-phone"}
            value={f.phone}
            onChange={f.on("phone")}
            invalid={!!f.errorFor("phone")}
            height={50}
            radius={14}
            border="1px solid #E6E4DE"
          />
          <FieldError text={f.errorFor("phone")} />
        </label>
      ) : null}
      {f.isCard ? (
        <>
          <span style={FIELD_LABEL}>
            Card brand
            <span role="group" aria-label="Card brand" style={SEG_WRAP}>
              {(f.brands || []).map((b, i0) => (
                <Fragment key={i0}>
                  <button type="button" onClick={b.pick} aria-pressed={b.aria} style={segStyle(b)}>
                    {b.label}
                  </button>
                </Fragment>
              ))}
            </span>
          </span>
          <label htmlFor={idp + "-last4"} style={FIELD_LABEL}>
            Last 4 digits
            <input
              id={idp + "-last4"}
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={f.last4}
              onChange={f.on("last4")}
              style={FIELD}
            />
            <FieldError text={f.errorFor("last4")} />
          </label>
          <label htmlFor={idp + "-expiry"} style={FIELD_LABEL}>
            Expiry (MM/YY)
            <input
              id={idp + "-expiry"}
              type="text"
              maxLength={5}
              placeholder="MM/YY"
              value={f.expiry}
              onChange={f.on("expiry")}
              style={FIELD}
            />
            <FieldError text={f.errorFor("expiry")} />
          </label>
          <label htmlFor={idp + "-holder"} style={FIELD_LABEL}>
            Name on card
            <input id={idp + "-holder"} type="text" value={f.holder} onChange={f.on("holder")} style={FIELD} />
            <FieldError text={f.errorFor("holder")} />
          </label>
          <span style={{ fontSize: "12px", lineHeight: "1.5", color: "#5E6470" }}>{f.cardNote}</span>
        </>
      ) : null}
      <FieldError text={f.error} />
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="submit"
          className="btn-y"
          disabled={f.busy}
          style={{
            height: "44px",
            padding: "0 14px",
            border: "none",
            borderRadius: "12px",
            background: "#2F7A3C",
            color: "#FFFFFF",
            font: "inherit",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {f.saveLabel}
        </button>
        <button
          type="button"
          onClick={f.cancel}
          style={{
            height: "44px",
            padding: "0 14px",
            border: "none",
            borderRadius: "12px",
            background: "transparent",
            font: "inherit",
            fontSize: "13px",
            fontWeight: "700",
            color: "#0D4F8B",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.lift{transition:transform .2s ease, box-shadow .2s ease}\n.lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(13,79,139,.3)}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.btn-w:hover{background:#FFFFFF;color:#0D4F8B}\n.btn-og:hover{background:#E4F2E6}\n.ghost:hover{background:#F1F0EC}\n.side a:hover,.side button:hover{background:#F6F5F1}\n.row:hover{background:#FAFAF8}\n.nav a:hover{color:#0D4F8B}\ninput[type=checkbox]{accent-color:#2F7A3C}\n@media (prefers-reduced-motion: reduce){.lift{transition:none}}\n";

export default class AccountScreen extends Component {
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
                <strong>{vals.storeCity}</strong>
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
                {"Free delivery on orders over "}
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
              onSubmit={vals.search}
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
              <label htmlFor="a-search" className="sr-only">
                Search Simbatech
              </label>
              <input
                id="a-search"
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
            <Link
              href="/account"
              aria-current="page"
              style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0", height: "52px" }}
            >
              <span
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "999px",
                  background: "#0D4F8B",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
                suppressHydrationWarning
              >
                {vals.initials}
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
                <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                  {"Hi, " + vals.firstName}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>Account</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={vals.goWish}
              aria-label={`Wishlist, ${vals.wishCount} saved`}
              style={{
                position: "relative",
                width: "44px",
                height: "44px",
                flexShrink: "0",
                padding: "0",
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
            </button>
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
            <Link href="/shop?dept=Electronics">Electronics</Link>
            <Link href="/shop?dept=Phones">Phones</Link>
            <Link href="/shop?dept=Home%20%26%20Living">{"Home & Living"}</Link>
            <Link href="/shop?dept=Kitchen">Kitchen</Link>
            <Link href="/shop?dept=Fashion">Fashion</Link>
            <Link href="/shop?dept=Beauty">Beauty</Link>
            <Link href="/shop?dept=Tools%20%26%20DIY">{"Tools & DIY"}</Link>
            <Link href="/shop?dept=Baby%20%26%20Kids">{"Baby & Kids"}</Link>
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
          <main
            style={{
              padding: "40px var(--gutter) 0",
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: "24px",
              alignItems: "start",
            }}
            data-cols="12"
            data-sec="account-body"
          >
            <aside style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: "20px" }} data-span="3" data-sec="sidebar">
              <div
                style={{
                  border: "1px solid #EFEDE8",
                  borderRadius: "28px",
                  padding: "24px 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 8px" }}>
                  <span
                    style={{
                      width: "60px",
                      height: "60px",
                      flexShrink: "0",
                      borderRadius: "999px",
                      background: "#0D4F8B",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      boxShadow: "0 0 0 4px #EAF3FA",
                    }}
                    suppressHydrationWarning
                  >
                    {vals.initials}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "21px",
                        fontWeight: "700",
                        letterSpacing: "-0.03em",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.userName}
                    </span>
                    <span style={{ fontSize: "13px", color: "#5E6470" }}>{vals.memberSince}</span>
                  </span>
                </div>
                <nav
                  aria-label="Account"
                  className="side"
                  style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "16px", borderTop: "1px solid #EFEDE8" }}
                >
                  <button
                    type="button"
                    onClick={vals.nv.overview.pick}
                    aria-current={vals.nv.overview.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.overview.bg,
                      color: vals.nv.overview.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="4" y="4" width="7" height="7" rx="1.5" />
                      <rect x="13" y="4" width="7" height="4" rx="1.5" />
                      <rect x="13" y="10" width="7" height="10" rx="1.5" />
                      <rect x="4" y="13" width="7" height="7" rx="1.5" />
                    </svg>
                    <span style={{ flexGrow: "1" }}>Overview</span>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nv.orders.pick}
                    aria-current={vals.nv.orders.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.orders.bg,
                      color: vals.nv.orders.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                      <path d="M3 8v8l9 5 9-5V8" />
                      <path d="M12 13v8" />
                    </svg>
                    <span style={{ flexGrow: "1" }}>Orders</span>
                    <span
                      style={{
                        minWidth: "24px",
                        height: "22px",
                        padding: "0 7px",
                        boxSizing: "border-box",
                        borderRadius: "999px",
                        background: "#0D4F8B",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.onTheWay}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nv.rentals.pick}
                    aria-current={vals.nv.rentals.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.rentals.bg,
                      color: vals.nv.rentals.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
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
                    <span style={{ flexGrow: "1" }}>Rentals</span>
                    <span
                      style={{
                        minWidth: "24px",
                        height: "22px",
                        padding: "0 7px",
                        boxSizing: "border-box",
                        borderRadius: "999px",
                        background: "#2F7A3C",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      suppressHydrationWarning
                    >
                      {vals.activeCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nv.wishlist.pick}
                    aria-current={vals.nv.wishlist.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.wishlist.bg,
                      color: vals.nv.wishlist.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                    </svg>
                    <span style={{ flexGrow: "1" }}>Wishlist</span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#5E6470" }} suppressHydrationWarning>
                      {vals.wishCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nv.addresses.pick}
                    aria-current={vals.nv.addresses.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.addresses.bg,
                      color: vals.nv.addresses.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                      <circle cx="12" cy="9.5" r="2.5" />
                    </svg>
                    <span style={{ flexGrow: "1" }}>Addresses</span>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nv.payment.pick}
                    aria-current={vals.nv.payment.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.payment.bg,
                      color: vals.nv.payment.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2.5" />
                      <path d="M3 10h18M7 15h4" />
                    </svg>
                    <span style={{ flexGrow: "1" }}>Payment methods</span>
                  </button>
                  <button
                    type="button"
                    onClick={vals.nv.settings.pick}
                    aria-current={vals.nv.settings.aria}
                    style={{
                      height: "48px",
                      padding: "0 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: vals.nv.settings.bg,
                      color: vals.nv.settings.fg,
                      font: "inherit",
                      fontSize: "15px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
                    </svg>
                    <span style={{ flexGrow: "1" }}>Settings</span>
                  </button>
                  <Link
                    href="/"
                    onClick={vals.signOut}
                    style={{
                      height: "48px",
                      marginTop: "8px",
                      padding: "0 12px",
                      borderRadius: "14px",
                      borderTop: "1px solid #EFEDE8",
                      color: "#B02418",
                      fontSize: "15px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                      <path d="M10 16l-4-4 4-4M6 12h10" />
                    </svg>
                    Sign out
                  </Link>
                </nav>
              </div>
              <div
                style={{
                  borderRadius: "24px",
                  background: "#F6F5F1",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "#FFFFFF",
                    color: "#0D4F8B",
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 13a8 8 0 0 1 16 0" />
                    <rect x="3" y="13" width="4" height="6" rx="1.5" />
                    <rect x="17" y="13" width="4" height="6" rx="1.5" />
                  </svg>
                </span>
                <span style={{ fontSize: "16px", fontWeight: "700" }}>Need a hand?</span>
                <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#5E6470" }}>
                  {"Our team can change a delivery, extend a rental or sort a return. Call "}
                  <a href={vals.storeTel} style={{ color: "#0D4F8B", fontWeight: "700" }}>
                    {vals.storePhone}
                  </a>
                  .
                </span>
                <Link
                  href="/p/contact"
                  style={{ fontSize: "14px", fontWeight: "700", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "4px" }}
                >
                  Chat with support
                </Link>
              </div>
            </aside>
            <section
              aria-live="polite"
              style={{ gridColumn: "span 9", display: "flex", flexDirection: "column", gap: "40px", minWidth: "0" }}
              data-span="9"
              data-sec="main-panel"
            >
              {vals.is.overview ? (
                <>
                  <div
                    style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}
                    data-sec="overview"
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                        {vals.todayLabel}
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
                        {"Welcome back, " + vals.firstName + ". "}
                        <span
                          style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontStyle: "italic",
                            fontWeight: "400",
                            letterSpacing: "-0.02em",
                            color: "#2F7A3C",
                          }}
                        >
                          {"Here's your week."}
                        </span>
                      </h1>
                    </div>
                    <Link
                      href="/shop"
                      className="btn-t"
                      style={{
                        flexShrink: "0",
                        height: "48px",
                        padding: "0 20px",
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
                      Continue shopping
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
                  <div
                    style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" }}
                    data-cols="4"
                    data-sec="stat-tiles"
                  >
                    <button
                      type="button"
                      onClick={vals.nv.rentals.pick}
                      className="lift"
                      style={{
                        height: "136px",
                        boxSizing: "border-box",
                        padding: "20px",
                        border: "none",
                        borderRadius: "24px",
                        background: "#E4F2E6",
                        color: "#111318",
                        font: "inherit",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#2F7A3C" }}>Active rentals</span>
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "11px",
                            background: "#FFFFFF",
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
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M3 10h18M8 3v4M16 3v4" />
                          </svg>
                        </span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "38px",
                            lineHeight: "1",
                            fontWeight: "700",
                            letterSpacing: "-0.04em",
                          }}
                          suppressHydrationWarning
                        >
                          {vals.activeCount}
                        </span>
                        <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                          {"Next return "}
                          {vals.nextReturn}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={vals.goOrdersWay}
                      className="lift"
                      style={{
                        height: "136px",
                        boxSizing: "border-box",
                        padding: "20px",
                        border: "none",
                        borderRadius: "24px",
                        background: "#EAF3FA",
                        color: "#111318",
                        font: "inherit",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#0D4F8B" }}>Orders on the way</span>
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "11px",
                            background: "#FFFFFF",
                            color: "#0D4F8B",
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
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "38px",
                            lineHeight: "1",
                            fontWeight: "700",
                            letterSpacing: "-0.04em",
                          }}
                          suppressHydrationWarning
                        >
                          {vals.onTheWay}
                        </span>
                        <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                          {vals.outToday}
                          {" arriving today"}
                        </span>
                      </span>
                    </button>
                    <div
                      style={{
                        height: "136px",
                        boxSizing: "border-box",
                        padding: "20px",
                        borderRadius: "24px",
                        background: "#FFF4C7",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#7A5700" }}>Deposits held</span>
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "11px",
                            background: "#FFFFFF",
                            color: "#7A5700",
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
                            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                            <path d="M9 12l2 2 4-4" />
                          </svg>
                        </span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "34px",
                            lineHeight: "1",
                            fontWeight: "700",
                            letterSpacing: "-0.04em",
                          }}
                          suppressHydrationWarning
                        >
                          {vals.depositsHeldFmt}
                        </span>
                        <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                          {"Across "}
                          {vals.activeCount}
                          {" rentals, refundable"}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={vals.nv.wishlist.pick}
                      className="lift"
                      style={{
                        height: "136px",
                        boxSizing: "border-box",
                        padding: "20px",
                        border: "none",
                        borderRadius: "24px",
                        background: "#FFE4EF",
                        color: "#111318",
                        font: "inherit",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#9A1F52" }}>Saved items</span>
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "11px",
                            background: "#FFFFFF",
                            color: "#9A1F52",
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
                            <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                          </svg>
                        </span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "38px",
                            lineHeight: "1",
                            fontWeight: "700",
                            letterSpacing: "-0.04em",
                          }}
                          suppressHydrationWarning
                        >
                          {vals.wishCount}
                        </span>
                        <span style={{ fontSize: "13px", color: "#3A3F4A" }} suppressHydrationWarning>
                          {vals.wishOnSale}
                          {" on sale now"}
                        </span>
                      </span>
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} data-sec="active-rentals">
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#2F7A3C",
                          }}
                        >
                          Renting now
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
                          Active rentals
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={vals.nv.rentals.pick}
                        style={{
                          height: "44px",
                          padding: "0",
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#2F7A3C",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        All rentals
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
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "20px" }} data-cols="2">
                      {(vals.active || []).map((r, i0) => (
                        <Fragment key={i0}>
                          <article
                            style={{
                              border: "1px solid #EFEDE8",
                              borderRadius: "28px",
                              padding: "16px 16px 20px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "18px",
                              background: "#FFFFFF",
                            }}
                          >
                            <div style={{ display: "flex", gap: "18px" }}>
                              <Link
                                href={r.href}
                                aria-label={r.name}
                                style={{
                                  width: "136px",
                                  height: "136px",
                                  flexShrink: "0",
                                  borderRadius: "22px",
                                  background: r.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div style={{ zoom: "0.62", width: "200px", height: "200px" }}>
                                  <Render kind={r.kind} />
                                </div>
                              </Link>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px", minWidth: "0" }}>
                                <span
                                  style={{
                                    alignSelf: "flex-start",
                                    height: "26px",
                                    padding: "0 10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    borderRadius: "999px",
                                    background: "#E4F2E6",
                                    color: "#2F7A3C",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                  suppressHydrationWarning
                                >
                                  <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#418D4D" }} />
                                  {"Renting · "}
                                  {r.rateFmt}
                                  {" / day"}
                                </span>
                                <Link
                                  href={r.href}
                                  style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.02em" }}
                                  suppressHydrationWarning
                                >
                                  {r.name}
                                </Link>
                                <span style={{ fontSize: "14px", color: "#3A3F4A" }}>
                                  {"Return by "}
                                  <strong style={{ color: "#111318" }} suppressHydrationWarning>
                                    {r.endFmt}
                                  </strong>
                                </span>
                                <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                  {"Deposit " + r.depositFmt + " · "}
                                  {r.startFmt}
                                  {" start"}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                <span style={{ fontWeight: "600" }} suppressHydrationWarning>
                                  {"Day "}
                                  {r.elapsed}
                                  {" of "}
                                  {r.total}
                                </span>
                                <span style={{ fontWeight: "700", color: r.leftFg }} suppressHydrationWarning>
                                  {r.leftLabel}
                                </span>
                              </div>
                              <div
                                role="progressbar"
                                aria-label={`${r.name} rental progress`}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                aria-valuenow={r.pctNum}
                                style={{ height: "10px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}
                              >
                                <div
                                  style={{
                                    height: "10px",
                                    width: r.pct,
                                    borderRadius: "999px",
                                    background: "#418D4D",
                                    transition: "width .3s ease",
                                  }}
                                />
                              </div>
                              {r.extended ? (
                                <>
                                  <span style={{ fontSize: "13px", color: "#2F7A3C", fontWeight: "600" }} suppressHydrationWarning>
                                    {r.extMsg}
                                  </span>
                                </>
                              ) : null}
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                type="button"
                                className="btn-og"
                                onClick={r.extend}
                                disabled={r.busy}
                                aria-label={`Extend ${r.name} by one day`}
                                style={{
                                  flex: "1",
                                  height: "46px",
                                  border: "1.5px solid #2F7A3C",
                                  borderRadius: "12px",
                                  background: "#FFFFFF",
                                  color: "#2F7A3C",
                                  font: "inherit",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px",
                                }}
                                suppressHydrationWarning
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
                                {r.extendText}
                                {r.rateFmt}
                              </button>
                              {r.notBooked ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn-y"
                                    onClick={r.togglePickup}
                                    style={{
                                      flex: "1",
                                      height: "46px",
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
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                                      <circle cx="7" cy="17.5" r="1.8" />
                                      <circle cx="17" cy="17.5" r="1.8" />
                                    </svg>
                                    Schedule pickup
                                  </button>
                                </>
                              ) : null}
                              {r.booked ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={r.togglePickup}
                                    aria-label={`Pickup booked for ${r.endFmt}. Select to cancel`}
                                    style={{
                                      flex: "1",
                                      height: "46px",
                                      border: "1.5px solid #CFE6D3",
                                      borderRadius: "12px",
                                      background: "#E4F2E6",
                                      color: "#2F7A3C",
                                      font: "inherit",
                                      fontSize: "14px",
                                      fontWeight: "700",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "8px",
                                    }}
                                    suppressHydrationWarning
                                  >
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
                                    {"Pickup "}
                                    {r.endShort}, {r.pickupTime}
                                  </button>
                                </>
                              ) : null}
                            </div>
                          </article>
                        </Fragment>
                      ))}
                    </div>
                    {vals.noActive ? (
                      <>
                        <div
                          style={{
                            height: "200px",
                            border: "1.5px dashed #E6E4DE",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            color: "#5E6470",
                            fontSize: "15px",
                          }}
                        >
                          <span style={{ fontSize: "17px", fontWeight: "700", color: "#111318" }}>No active rentals</span>
                          Rentals you book will show up here.
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div
                    style={{ border: "1px solid #EFEDE8", borderRadius: "28px", overflow: "hidden", background: "#FFFFFF" }}
                    data-sec="recent-orders"
                  >
                    {" "}
                    <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h2
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "26px",
                          fontWeight: "700",
                          letterSpacing: "-0.035em",
                        }}
                      >
                        Recent orders
                      </h2>
                      <button
                        type="button"
                        onClick={vals.nv.orders.pick}
                        style={{
                          height: "44px",
                          padding: "0",
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#0D4F8B",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        All orders
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
                    </div>{" "}
                    <div role="table" aria-label="Recent orders">
                      {" "}
                      <div
                        role="row"
                        style={{
                          height: "44px",
                          padding: "0 28px",
                          display: "grid",
                          gridTemplateColumns: "150px 120px 1fr 130px 170px 90px",
                          alignItems: "center",
                          background: "#F6F5F1",
                          fontSize: "12px",
                          fontWeight: "700",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#5E6470",
                        }}
                        data-cols="t6"
                      >
                        <span role="columnheader">Order</span>
                        <span role="columnheader">Date</span>
                        <span role="columnheader">Items</span>
                        <span role="columnheader">Total</span>
                        <span role="columnheader">Status</span>
                        <span role="columnheader" className="sr-only">
                          Action
                        </span>
                      </div>{" "}
                      {(vals.recent || []).map((o, i0) => (
                        <Fragment key={i0}>
                          {" "}
                          <div
                            role="row"
                            className="row"
                            style={{
                              height: "80px",
                              padding: "0 28px",
                              display: "grid",
                              gridTemplateColumns: "150px 120px 1fr 130px 170px 90px",
                              alignItems: "center",
                              borderTop: "1px solid #EFEDE8",
                              fontSize: "14px",
                            }}
                            data-cols="t6"
                          >
                            <span role="cell" style={{ fontWeight: "700" }} suppressHydrationWarning>
                              {o.no}
                            </span>
                            <span role="cell" style={{ color: "#3A3F4A" }} suppressHydrationWarning>
                              {o.date}
                            </span>
                            <span role="cell" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {(o.thumbs || []).map((t, i1) => (
                                <Fragment key={i1}>
                                  <span
                                    title={t.name}
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                      borderRadius: "12px",
                                      background: t.bg,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span style={{ display: "block", zoom: "0.22", width: "200px", height: "200px" }}>
                                      <Render kind={t.kind} />
                                    </span>
                                  </span>
                                </Fragment>
                              ))}
                              <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                {o.itemCount}
                              </span>
                            </span>
                            <span role="cell" style={{ fontWeight: "700" }} suppressHydrationWarning>
                              {o.totalFmt}
                            </span>
                            <span role="cell">
                              <span
                                style={{
                                  height: "28px",
                                  padding: "0 11px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "7px",
                                  borderRadius: "999px",
                                  background: o.st.bg,
                                  color: o.st.fg,
                                  fontSize: "12px",
                                  fontWeight: "700",
                                }}
                                suppressHydrationWarning
                              >
                                <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: o.st.dot }} />
                                {o.st.label}
                              </span>
                            </span>
                            <span role="cell" style={{ display: "flex", justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                onClick={o.track}
                                aria-label={o.trackLabel}
                                style={{
                                  height: "44px",
                                  padding: "0 14px",
                                  border: "1px solid #E6E4DE",
                                  borderRadius: "12px",
                                  background: "#FFFFFF",
                                  color: "#0D4F8B",
                                  font: "inherit",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                }}
                                suppressHydrationWarning
                              >
                                {o.trackText}
                              </button>
                            </span>
                          </div>{" "}
                        </Fragment>
                      ))}{" "}
                    </div>{" "}
                  </div>
                  <div
                    style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "20px" }}
                    data-cols="12"
                    data-sec="deposits-promo"
                  >
                    <div
                      style={{
                        gridColumn: "span 5",
                        border: "1px solid #EFEDE8",
                        borderRadius: "28px",
                        padding: "26px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                      }}
                      data-span="5"
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2
                          style={{
                            margin: "0",
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "22px",
                            fontWeight: "700",
                            letterSpacing: "-0.03em",
                          }}
                        >
                          Deposit refunds
                        </h2>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#5E6470" }}>{vals.refundTo}</span>
                      </div>
                      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                        {(vals.deposits || []).map((d, i0) => (
                          <Fragment key={i0}>
                            <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  flexShrink: "0",
                                  borderRadius: "12px",
                                  background: d.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span style={{ display: "block", zoom: "0.18", width: "200px", height: "200px" }}>
                                  <Render kind={d.kind} />
                                </span>
                              </span>
                              <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontSize: "14px", fontWeight: "700" }}>{d.name}</span>
                                <span style={{ fontSize: "12px", color: "#5E6470" }}>{d.sub}</span>
                              </span>
                              <span
                                style={{
                                  height: "26px",
                                  padding: "0 10px",
                                  display: "flex",
                                  alignItems: "center",
                                  borderRadius: "999px",
                                  background: d.badgeBg,
                                  color: d.badgeFg,
                                  fontSize: "12px",
                                  fontWeight: "700",
                                }}
                              >
                                {d.badge}
                              </span>
                            </li>
                          </Fragment>
                        ))}
                        {vals.noDeposits ? (
                          <li style={{ fontSize: "12px", color: "#5E6470" }}>No deposits yet. Deposits on rentals show up here.</li>
                        ) : null}
                      </ul>
                      <span style={{ fontSize: "12px", lineHeight: "1.5", color: "#5E6470" }}>
                        {"Deposits are returned within "}
                        {vals.depositDays}
                        {" of the item passing inspection."}
                      </span>
                    </div>
                    <Link
                      href="/shop"
                      className="lift"
                      style={{
                        gridColumn: "span 7",
                        position: "relative",
                        minHeight: "300px",
                        borderRadius: "28px",
                        background: "#0D4F8B",
                        color: "#FFFFFF",
                        overflow: "hidden",
                      }}
                      data-span="7"
                      data-banner
                    >
                      {" "}
                      <div
                        style={{
                          position: "absolute",
                          right: "-60px",
                          top: "-60px",
                          width: "300px",
                          height: "300px",
                          borderRadius: "999px",
                          background: "#1A62A8",
                        }}
                        data-abs="deco"
                        data-w
                      />{" "}
                      <div
                        style={{
                          position: "absolute",
                          left: "32px",
                          top: "32px",
                          bottom: "32px",
                          width: "290px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                        data-abs="text"
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#8FD19A",
                            }}
                          >
                            Rental bundles
                          </span>
                          <span
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "32px",
                              lineHeight: "1",
                              fontWeight: "700",
                              letterSpacing: "-0.04em",
                            }}
                          >
                            {"Hosting soon? "}
                            <span
                              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: "400", color: "#8FD19A" }}
                            >
                              One booking.
                            </span>
                          </span>
                          <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#CFE2F3" }}>
                            Garden party bundle: tent, 20 chairs, speaker and lights from ETB 6,500 a day.
                          </span>
                        </div>
                        <span
                          className="btn-y"
                          style={{
                            alignSelf: "flex-start",
                            height: "46px",
                            padding: "0 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            borderRadius: "12px",
                            background: "#2F7A3C",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontWeight: "700",
                          }}
                        >
                          Book a bundle
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
                        style={{ position: "absolute", right: "20px", bottom: "10px", zoom: "1.1", width: "200px", height: "200px" }}
                        data-abs="art"
                      >
                        <Render kind={"tent"} />
                      </div>{" "}
                      <div
                        style={{ position: "absolute", right: "200px", bottom: "6px", zoom: "0.55", width: "200px", height: "200px" }}
                        data-abs="art"
                      >
                        <Render kind={"headphones"} />
                      </div>{" "}
                    </Link>
                  </div>
                </>
              ) : null}
              {vals.is.orders ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }} data-sec="orders">
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#0D4F8B",
                        }}
                      >
                        Purchases
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
                        My orders
                      </h1>
                    </div>
                    <div
                      role="tablist"
                      aria-label="Filter orders"
                      style={{ display: "flex", gap: "4px", padding: "4px", background: "#F3F2EE", borderRadius: "14px" }}
                    >
                      {(vals.orderTabs || []).map((t, i0) => (
                        <Fragment key={i0}>
                          <button
                            type="button"
                            role="tab"
                            onClick={t.pick}
                            aria-selected={t.aria}
                            style={{
                              height: "44px",
                              padding: "0 16px",
                              border: "none",
                              borderRadius: "11px",
                              background: t.bg,
                              color: t.fg,
                              font: "inherit",
                              fontSize: "14px",
                              fontWeight: "600",
                              cursor: "pointer",
                              boxShadow: t.shadow,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            suppressHydrationWarning
                          >
                            {t.label}
                            <span
                              style={{
                                minWidth: "20px",
                                height: "20px",
                                padding: "0 6px",
                                boxSizing: "border-box",
                                borderRadius: "999px",
                                background: t.countBg,
                                color: t.countFg,
                                fontSize: "11px",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              suppressHydrationWarning
                            >
                              {t.count}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {(vals.orderList || []).map((o, i0) => (
                      <Fragment key={i0}>
                        <article
                          style={{ border: `1px solid ${o.border}`, borderRadius: "24px", overflow: "hidden", background: "#FFFFFF" }}
                        >
                          {" "}
                          <button
                            type="button"
                            onClick={o.toggle}
                            aria-expanded={o.aria}
                            className="row"
                            style={{
                              width: "100%",
                              minHeight: "92px",
                              padding: "16px 24px",
                              border: "none",
                              background: "transparent",
                              font: "inherit",
                              color: "#111318",
                              textAlign: "left",
                              cursor: "pointer",
                              display: "grid",
                              gridTemplateColumns: "180px 1fr 130px 180px 44px",
                              alignItems: "center",
                              gap: "12px",
                            }}
                            data-cols="t5"
                          >
                            <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontSize: "16px", fontWeight: "700" }} suppressHydrationWarning>
                                {o.no}
                              </span>
                              <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                {"Placed "}
                                {o.date}
                              </span>
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                              {(o.thumbs || []).map((t, i1) => (
                                <Fragment key={i1}>
                                  <span
                                    style={{
                                      width: "56px",
                                      height: "56px",
                                      flexShrink: "0",
                                      borderRadius: "14px",
                                      background: t.bg,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span style={{ display: "block", zoom: "0.26", width: "200px", height: "200px" }}>
                                      <Render kind={t.kind} />
                                    </span>
                                  </span>
                                </Fragment>
                              ))}
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "#3A3F4A",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                suppressHydrationWarning
                              >
                                {o.names}
                              </span>
                            </span>
                            <span style={{ fontSize: "16px", fontWeight: "700" }} suppressHydrationWarning>
                              {o.totalFmt}
                            </span>
                            <span>
                              <span
                                style={{
                                  height: "28px",
                                  padding: "0 11px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "7px",
                                  borderRadius: "999px",
                                  background: o.st.bg,
                                  color: o.st.fg,
                                  fontSize: "12px",
                                  fontWeight: "700",
                                }}
                                suppressHydrationWarning
                              >
                                <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: o.st.dot }} />
                                {o.st.label}
                              </span>
                            </span>
                            <span
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "999px",
                                background: "#F3F2EE",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transform: o.chev,
                                transition: "transform .2s ease",
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
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </span>
                          </button>{" "}
                          {o.open ? (
                            <>
                              {" "}
                              <div
                                style={{
                                  margin: "0 24px 24px",
                                  padding: "24px",
                                  borderRadius: "20px",
                                  background: "#F6F5F1",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "22px",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: "15px", fontWeight: "700" }} suppressHydrationWarning>
                                      {o.headline}
                                    </span>
                                    <span
                                      style={{
                                        height: "28px",
                                        padding: "0 11px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "7px",
                                        borderRadius: "999px",
                                        background: o.payStatus.bg,
                                        color: o.payStatus.fg,
                                        fontSize: "12px",
                                        fontWeight: "700",
                                      }}
                                      suppressHydrationWarning
                                    >
                                      <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: o.payStatus.dot }} />
                                      {o.payStatus.label}
                                    </span>
                                  </span>
                                  <span style={{ fontSize: "13px", color: "#5E6470" }}>{o.trackingNo}</span>
                                </div>
                                <ol
                                  aria-label={`Tracking timeline for ${o.no}`}
                                  style={{
                                    margin: "0",
                                    padding: "0",
                                    listStyle: "none",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                                    gap: "0",
                                  }}
                                  data-cols="4"
                                >
                                  {(o.steps || []).map((s, i1) => (
                                    <Fragment key={i1}>
                                      <li style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                          <span
                                            style={{
                                              width: "22px",
                                              height: "22px",
                                              flexShrink: "0",
                                              boxSizing: "border-box",
                                              borderRadius: "999px",
                                              background: s.dotBg,
                                              border: `2px solid ${s.dotBorder}`,
                                              boxShadow: s.ring,
                                              color: "#FFFFFF",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            {s.done ? (
                                              <>
                                                <svg
                                                  width="12"
                                                  height="12"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="3"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  aria-hidden="true"
                                                >
                                                  <path d="M5 12l5 5 9-10" />
                                                </svg>
                                              </>
                                            ) : null}
                                          </span>
                                          <span
                                            style={{
                                              flexGrow: "1",
                                              height: "3px",
                                              margin: "0 8px",
                                              borderRadius: "999px",
                                              background: s.lineBg,
                                            }}
                                          />
                                        </div>
                                        <span style={{ display: "flex", flexDirection: "column", gap: "2px", paddingRight: "16px" }}>
                                          <span style={{ fontSize: "14px", fontWeight: "700", color: s.labelFg }} suppressHydrationWarning>
                                            {s.label}
                                          </span>
                                          <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                                            {s.time}
                                          </span>
                                        </span>
                                      </li>
                                    </Fragment>
                                  ))}
                                </ol>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    paddingTop: "18px",
                                    borderTop: "1px solid #E6E4DE",
                                  }}
                                >
                                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3A3F4A" }}>
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#0D4F8B"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                                      <circle cx="12" cy="9.5" r="2.5" />
                                    </svg>
                                    {o.where}
                                  </span>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    {o.payError ? (
                                      <span role="alert" style={{ fontSize: "12px", color: "#B02418", alignSelf: "center" }}>
                                        {o.payError}
                                      </span>
                                    ) : null}
                                    {o.payable ? (
                                      <button
                                        type="button"
                                        className="btn-y"
                                        onClick={o.payNow}
                                        disabled={o.paying}
                                        style={{
                                          height: "44px",
                                          padding: "0 16px",
                                          display: "flex",
                                          alignItems: "center",
                                          border: "none",
                                          borderRadius: "12px",
                                          background: "#2F7A3C",
                                          color: "#FFFFFF",
                                          font: "inherit",
                                          fontSize: "13px",
                                          fontWeight: "700",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {o.payLabel}
                                      </button>
                                    ) : null}
                                    <Link
                                      href="/p/contact"
                                      style={{
                                        height: "44px",
                                        padding: "0 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid #E6E4DE",
                                        borderRadius: "12px",
                                        background: "#FFFFFF",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Get help
                                    </Link>
                                    <Link
                                      href={o.ctaHref}
                                      className="btn-t"
                                      style={{
                                        height: "44px",
                                        padding: "0 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        borderRadius: "12px",
                                        background: "#0D4F8B",
                                        color: "#FFFFFF",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                      }}
                                      suppressHydrationWarning
                                    >
                                      {o.cta}
                                    </Link>
                                  </div>
                                </div>
                              </div>{" "}
                            </>
                          ) : null}{" "}
                        </article>
                      </Fragment>
                    ))}
                    {vals.noOrders ? (
                      <>
                        <div
                          style={{
                            height: "200px",
                            border: "1.5px dashed #E6E4DE",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            color: "#5E6470",
                            fontSize: "15px",
                          }}
                        >
                          <span style={{ fontSize: "17px", fontWeight: "700", color: "#111318" }}>Nothing here yet</span>
                          Orders in this state will show up here.
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {vals.is.rentals ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }} data-sec="rentals">
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#2F7A3C",
                        }}
                      >
                        Rent by the day
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
                        My rentals
                      </h1>
                    </div>
                    <div
                      role="tablist"
                      aria-label="Filter rentals"
                      style={{ display: "flex", gap: "4px", padding: "4px", background: "#F3F2EE", borderRadius: "14px" }}
                    >
                      {(vals.rentTabs || []).map((t, i0) => (
                        <Fragment key={i0}>
                          <button
                            type="button"
                            role="tab"
                            onClick={t.pick}
                            aria-selected={t.aria}
                            style={{
                              height: "44px",
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
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            suppressHydrationWarning
                          >
                            {t.label}
                            <span
                              style={{
                                minWidth: "20px",
                                height: "20px",
                                padding: "0 6px",
                                boxSizing: "border-box",
                                borderRadius: "999px",
                                background: t.countBg,
                                color: t.countFg,
                                fontSize: "11px",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              suppressHydrationWarning
                            >
                              {t.count}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  {vals.rt.active ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "20px" }} data-cols="2">
                        {(vals.rentActive || []).map((r, i0) => (
                          <Fragment key={i0}>
                            <article
                              style={{
                                border: "1px solid #EFEDE8",
                                borderRadius: "28px",
                                padding: "16px 16px 20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                                background: "#FFFFFF",
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  height: "200px",
                                  borderRadius: "22px",
                                  background: r.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "14px",
                                    left: "14px",
                                    height: "28px",
                                    padding: "0 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    borderRadius: "999px",
                                    background: "#FFFFFF",
                                    color: "#2F7A3C",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                  data-abs="misc"
                                >
                                  <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#418D4D" }} />
                                  Active
                                </span>
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "14px",
                                    right: "14px",
                                    height: "28px",
                                    padding: "0 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "999px",
                                    background: "#111318",
                                    color: "#FFFFFF",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                  data-abs="misc"
                                  suppressHydrationWarning
                                >
                                  {r.leftLabel}
                                </span>
                                <div style={{ zoom: "0.9", width: "200px", height: "200px" }}>
                                  <Render kind={r.kind} />
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                  gap: "12px",
                                  padding: "0 4px",
                                }}
                              >
                                <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <Link
                                    href={r.href}
                                    style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.02em" }}
                                    suppressHydrationWarning
                                  >
                                    {r.name}
                                  </Link>
                                  <span style={{ fontSize: "14px", color: "#3A3F4A" }} suppressHydrationWarning>
                                    {r.startFmt}
                                    {" to "}
                                    {r.endFmt}
                                    {" · "}
                                    {r.total}
                                    {" days"}
                                  </span>
                                </span>
                                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                                  <span style={{ fontSize: "17px", fontWeight: "700" }} suppressHydrationWarning>
                                    {r.costFmt}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "#5E6470" }}>{"+ deposit " + r.depositFmt}</span>
                                </span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 4px" }}>
                                <div
                                  role="progressbar"
                                  aria-label={`${r.name} rental progress`}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                  aria-valuenow={r.pctNum}
                                  style={{ height: "10px", borderRadius: "999px", background: "#F1EEE8", overflow: "hidden" }}
                                >
                                  <div
                                    style={{
                                      height: "10px",
                                      width: r.pct,
                                      borderRadius: "999px",
                                      background: "#418D4D",
                                      transition: "width .3s ease",
                                    }}
                                  />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5E6470" }}>
                                  <span suppressHydrationWarning>
                                    {"Day "}
                                    {r.elapsed}
                                    {" of "}
                                    {r.total}
                                  </span>
                                  <span suppressHydrationWarning>
                                    {"Return by "}
                                    {r.endFmt}
                                  </span>
                                </div>
                                {r.extended ? (
                                  <>
                                    <span style={{ fontSize: "13px", color: "#2F7A3C", fontWeight: "600" }} suppressHydrationWarning>
                                      {r.extMsg}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  type="button"
                                  className="btn-og"
                                  onClick={r.extend}
                                  disabled={r.busy}
                                  aria-label={`Extend ${r.name} by one day`}
                                  style={{
                                    flex: "1",
                                    height: "46px",
                                    border: "1.5px solid #2F7A3C",
                                    borderRadius: "12px",
                                    background: "#FFFFFF",
                                    color: "#2F7A3C",
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
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                  >
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                  {r.extendShort}
                                </button>
                                {r.notBooked ? (
                                  <>
                                    <button
                                      type="button"
                                      className="btn-y"
                                      onClick={r.togglePickup}
                                      style={{
                                        flex: "1",
                                        height: "46px",
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
                                      Schedule pickup
                                    </button>
                                  </>
                                ) : null}
                                {r.booked ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={r.togglePickup}
                                      aria-label={`Pickup booked for ${r.endFmt}. Select to cancel`}
                                      style={{
                                        flex: "1",
                                        height: "46px",
                                        border: "1.5px solid #CFE6D3",
                                        borderRadius: "12px",
                                        background: "#E4F2E6",
                                        color: "#2F7A3C",
                                        font: "inherit",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                      }}
                                      suppressHydrationWarning
                                    >
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
                                      {"Pickup "}
                                      {r.endShort}, {r.pickupTime}
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </article>
                          </Fragment>
                        ))}
                      </div>
                      {vals.noRentActive ? (
                        <>
                          <div
                            style={{
                              height: "200px",
                              border: "1.5px dashed #E6E4DE",
                              borderRadius: "24px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              color: "#5E6470",
                              fontSize: "15px",
                            }}
                          >
                            <span style={{ fontSize: "17px", fontWeight: "700", color: "#111318" }}>Nothing here yet</span>
                            Rentals in this state will show up here.
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {vals.rt.other ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "20px" }} data-cols="2">
                        {(vals.rentOther || []).map((r, i0) => (
                          <Fragment key={i0}>
                            <article
                              style={{
                                border: "1px solid #EFEDE8",
                                borderRadius: "28px",
                                padding: "16px 16px 20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                                background: "#FFFFFF",
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  height: "200px",
                                  borderRadius: "22px",
                                  background: r.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "14px",
                                    left: "14px",
                                    height: "28px",
                                    padding: "0 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    borderRadius: "999px",
                                    background: "#FFFFFF",
                                    color: r.pillFg,
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                  data-abs="misc"
                                  suppressHydrationWarning
                                >
                                  <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: r.pillDot }} />
                                  {r.pill}
                                </span>
                                <div style={{ zoom: "0.9", width: "200px", height: "200px" }}>
                                  <Render kind={r.kind} />
                                </div>
                                {r.hasK2 ? (
                                  <>
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "8px",
                                        bottom: "6px",
                                        zoom: "0.5",
                                        width: "200px",
                                        height: "200px",
                                      }}
                                      data-abs="art"
                                    >
                                      <Render kind={r.k2} />
                                    </div>
                                  </>
                                ) : null}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                  gap: "12px",
                                  padding: "0 4px",
                                }}
                              >
                                <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <span style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.02em" }} suppressHydrationWarning>
                                    {r.name}
                                  </span>
                                  <span style={{ fontSize: "14px", color: "#3A3F4A" }} suppressHydrationWarning>
                                    {r.dates}
                                  </span>
                                </span>
                                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                                  <span style={{ fontSize: "17px", fontWeight: "700" }} suppressHydrationWarning>
                                    {r.costFmt}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                                    {r.costSub}
                                  </span>
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "12px 14px",
                                  borderRadius: "14px",
                                  background: "#F6F5F1",
                                  fontSize: "13px",
                                  color: "#3A3F4A",
                                }}
                                suppressHydrationWarning
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#2F7A3C"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                                  <circle cx="7" cy="17.5" r="1.8" />
                                  <circle cx="17" cy="17.5" r="1.8" />
                                </svg>
                                {r.note}
                              </div>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Link
                                  href={r.href1}
                                  className="btn-og"
                                  style={{
                                    flex: "1",
                                    height: "46px",
                                    boxSizing: "border-box",
                                    border: "1.5px solid #2F7A3C",
                                    borderRadius: "12px",
                                    color: "#2F7A3C",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  suppressHydrationWarning
                                >
                                  {r.cta1}
                                </Link>
                                <Link
                                  href={r.href2}
                                  className="btn-y"
                                  style={{
                                    flex: "1",
                                    height: "46px",
                                    borderRadius: "12px",
                                    background: "#2F7A3C",
                                    color: "#FFFFFF",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  suppressHydrationWarning
                                >
                                  {r.cta2}
                                </Link>
                              </div>
                            </article>
                          </Fragment>
                        ))}
                      </div>
                      {vals.noRentOther ? (
                        <>
                          <div
                            style={{
                              height: "200px",
                              border: "1.5px dashed #E6E4DE",
                              borderRadius: "24px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              color: "#5E6470",
                              fontSize: "15px",
                            }}
                          >
                            <span style={{ fontSize: "17px", fontWeight: "700", color: "#111318" }}>Nothing here yet</span>
                            Rentals in this state will show up here.
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      padding: "22px 26px",
                      borderRadius: "24px",
                      background: "#E4F2E6",
                    }}
                  >
                    <span
                      style={{
                        width: "48px",
                        height: "48px",
                        flexShrink: "0",
                        borderRadius: "14px",
                        background: "#FFFFFF",
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
                        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <span style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700" }}>How rentals work</span>
                      <span style={{ fontSize: "14px", color: "#3A3F4A" }}>
                        We deliver, you use it, we collect. Extend anytime before your return date; deposits come back after inspection.
                      </span>
                    </span>
                    <a
                      href="#"
                      style={{
                        flexShrink: "0",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#2F7A3C",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                      }}
                    >
                      Rental terms
                    </a>
                  </div>
                </>
              ) : null}
              {vals.is.wishlist ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} data-sec="wishlist">
                    <span
                      style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                    >
                      Saved for later
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
                      Wishlist
                    </h1>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }} data-cols="3">
                    {(vals.wishList || []).map((p, i0) => (
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
                          <div
                            style={{
                              position: "relative",
                              height: "220px",
                              borderRadius: "20px",
                              background: p.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Link
                              href={p.href}
                              aria-label={p.name}
                              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <div style={{ zoom: "0.95", width: "200px", height: "200px" }}>
                                <Render kind={p.kind} />
                              </div>
                            </Link>
                            {p.onSale ? (
                              <>
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
                                    background: "#C42A1C",
                                    color: "#FFFFFF",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                  data-abs="misc"
                                >
                                  Sale
                                </span>
                              </>
                            ) : null}
                            <button
                              type="button"
                              onClick={p.remove}
                              aria-label={`Remove ${p.name} from wishlist`}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
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
                              data-abs="misc"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="#E0522B"
                                stroke="#E0522B"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                              </svg>
                            </button>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "0 6px" }}>
                            <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
                              {p.cat}
                            </span>
                            <Link
                              href={p.href}
                              style={{ fontSize: "17px", fontWeight: "700", letterSpacing: "-0.015em" }}
                              suppressHydrationWarning
                            >
                              {p.name}
                            </Link>
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
                                <span style={{ fontSize: "18px", fontWeight: "700", color: p.priceFg }} suppressHydrationWarning>
                                  {p.priceFmt}
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
                                aria-label={`Add to cart: ${p.name}`}
                                style={{
                                  height: "44px",
                                  padding: "0 14px",
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
                                {p.addLabel}
                              </button>
                            </div>
                          </div>
                        </article>
                      </Fragment>
                    ))}
                  </div>
                  {vals.noWish ? (
                    <>
                      <div
                        style={{
                          height: "220px",
                          border: "1.5px dashed #E6E4DE",
                          borderRadius: "24px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                          color: "#5E6470",
                          fontSize: "15px",
                        }}
                      >
                        <span style={{ fontSize: "17px", fontWeight: "700", color: "#111318" }}>Your wishlist is empty</span>
                        <Link
                          href="/shop"
                          className="btn-t"
                          style={{
                            height: "44px",
                            padding: "0 18px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "12px",
                            background: "#0D4F8B",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontWeight: "700",
                          }}
                        >
                          Browse products
                        </Link>
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}
              {vals.is.addresses ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} data-sec="addresses">
                    <span
                      style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                    >
                      {"Delivery & pickup"}
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
                      Addresses
                    </h1>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }} data-cols="3">
                    {(vals.addresses || []).map((a, i0) => (
                      <Fragment key={i0}>
                        <div
                          style={{
                            minHeight: "220px",
                            boxSizing: "border-box",
                            border: `1.5px solid ${a.border}`,
                            borderRadius: "24px",
                            padding: "24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            background: "#FFFFFF",
                          }}
                        >
                          {a.viewing ? (
                            <>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "16px", fontWeight: "700" }} suppressHydrationWarning>
                                  {a.label}
                                </span>
                                {a.isDefault ? (
                                  <>
                                    <span
                                      style={{
                                        height: "26px",
                                        padding: "0 10px",
                                        display: "flex",
                                        alignItems: "center",
                                        borderRadius: "999px",
                                        background: "#EAF3FA",
                                        color: "#0D4F8B",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Default
                                    </span>
                                  </>
                                ) : null}
                              </div>
                              <span
                                style={{ fontSize: "14px", lineHeight: "1.6", color: "#3A3F4A", whiteSpace: "pre-line" }}
                                suppressHydrationWarning
                              >
                                {a.lines}
                              </span>
                              <div style={{ flexGrow: "1" }} />
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  type="button"
                                  onClick={a.edit}
                                  style={{
                                    height: "44px",
                                    padding: "0 14px",
                                    border: "1px solid #E6E4DE",
                                    borderRadius: "12px",
                                    background: "#FFFFFF",
                                    font: "inherit",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#111318",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                                {a.notDefault ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={a.makeDefault}
                                      style={{
                                        height: "44px",
                                        padding: "0 14px",
                                        border: "none",
                                        borderRadius: "12px",
                                        background: "transparent",
                                        font: "inherit",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        color: "#0D4F8B",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Set as default
                                    </button>
                                  </>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={a.remove}
                                  aria-label={`Delete ${a.label} address`}
                                  style={{
                                    height: "44px",
                                    padding: "0 14px",
                                    border: "none",
                                    borderRadius: "12px",
                                    background: "transparent",
                                    font: "inherit",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#B02418",
                                    cursor: "pointer",
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          ) : null}
                          {a.editing ? <AddressForm f={vals.addrForm} idp={"ad-" + i0} /> : null}
                        </div>
                      </Fragment>
                    ))}
                    {vals.addingAddr ? (
                      <div
                        style={{
                          minHeight: "220px",
                          boxSizing: "border-box",
                          border: "1.5px solid #1679BE",
                          borderRadius: "24px",
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          background: "#FFFFFF",
                        }}
                      >
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>New address</span>
                        <AddressForm f={vals.addrForm} idp="ad-new" />
                      </div>
                    ) : null}
                    {vals.notAddingAddr ? (
                      <button
                        type="button"
                        onClick={vals.newAddress}
                        style={{
                          minHeight: "220px",
                          border: "1.5px dashed #C9C6BE",
                          borderRadius: "24px",
                          background: "#F6F5F1",
                          font: "inherit",
                          color: "#0D4F8B",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          fontSize: "15px",
                          fontWeight: "700",
                        }}
                      >
                        <span
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "999px",
                            background: "#FFFFFF",
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
                        Add a new address
                      </button>
                    ) : null}
                  </div>
                  {vals.addrListError ? (
                    <span role="alert" style={{ fontSize: "12px", color: "#B02418" }}>
                      {vals.addrListError}
                    </span>
                  ) : null}
                </>
              ) : null}
              {vals.is.payment ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} data-sec="payment">
                    <span
                      style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                    >
                      Secure checkout
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
                      Payment methods
                    </h1>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }} data-cols="3">
                    {(vals.pmList || []).map((m, i0) => (
                      <Fragment key={i0}>
                        <div
                          style={{
                            height: "200px",
                            boxSizing: "border-box",
                            borderRadius: "24px",
                            padding: "24px",
                            background: m.isTelebirr ? "#1F7A45" : "#0D4F8B",
                            color: "#FFFFFF",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span
                              style={{
                                height: "30px",
                                padding: "0 12px",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "8px",
                                background: "#FFFFFF",
                                color: m.isTelebirr ? "#1F7A45" : m.brandFg,
                                fontSize: "12px",
                                fontWeight: "800",
                                fontStyle: m.isTelebirr ? "normal" : m.brandItalic,
                              }}
                              suppressHydrationWarning
                            >
                              {m.isTelebirr ? "TELEBIRR" : m.brand}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {m.isDefault ? (
                                <span
                                  style={{
                                    height: "26px",
                                    padding: "0 10px",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.18)",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Default
                                </span>
                              ) : null}
                              {m.notDefault ? (
                                <button
                                  type="button"
                                  onClick={m.makeDefault}
                                  disabled={vals.pmBusy}
                                  style={{
                                    height: "44px",
                                    padding: "0 12px",
                                    border: "1px solid rgba(255,255,255,0.35)",
                                    borderRadius: "12px",
                                    background: "transparent",
                                    color: "#FFFFFF",
                                    font: "inherit",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                  }}
                                >
                                  Set as default
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={m.remove}
                                disabled={vals.pmBusy}
                                aria-label={`Remove ${m.isTelebirr ? "Telebirr " + m.main : m.brand + " " + m.main}`}
                                style={{
                                  height: "44px",
                                  padding: "0 12px",
                                  border: "1px solid rgba(255,255,255,0.35)",
                                  borderRadius: "12px",
                                  background: "transparent",
                                  color: "#FFFFFF",
                                  font: "inherit",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                }}
                              >
                                Remove
                              </button>
                            </span>
                          </div>
                          <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "13px", color: m.isTelebirr ? "#D5F0DE" : "#CFE2F3" }} suppressHydrationWarning>
                              {m.sub}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: "24px",
                                fontWeight: "700",
                                letterSpacing: m.isTelebirr ? "-0.02em" : "0.04em",
                              }}
                              suppressHydrationWarning
                            >
                              {m.main}
                            </span>
                            {m.holder ? (
                              <span style={{ fontSize: "13px", color: "#CFE2F3" }} suppressHydrationWarning>
                                {m.holder}
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {vals.noPm && vals.notPmAdding ? (
                      <div
                        style={{
                          height: "200px",
                          boxSizing: "border-box",
                          borderRadius: "24px",
                          padding: "24px",
                          border: "1.5px dashed #E6E4DE",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          color: "#5E6470",
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "17px", fontWeight: "700", color: "#111318" }}>No saved payment methods</span>
                        Save a Telebirr number or a card reminder to pick it at checkout.
                      </div>
                    ) : null}
                    {vals.pmAdding ? (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          border: "1px solid #BFD8EE",
                          borderRadius: "24px",
                          padding: "24px",
                          background: "#FFFFFF",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>Add card or Telebirr number</span>
                        <PaymentMethodForm f={vals.pmAddForm} idp="pm-new" />
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={vals.startPm}
                      disabled={vals.pmAdding}
                      style={{
                        height: "200px",
                        border: "1.5px dashed #C9C6BE",
                        borderRadius: "24px",
                        background: "#F6F5F1",
                        font: "inherit",
                        color: "#0D4F8B",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        fontSize: "15px",
                        fontWeight: "700",
                      }}
                    >
                      <span
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "999px",
                          background: "#FFFFFF",
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
                      Add card or Telebirr number
                    </button>
                  </div>
                  {vals.pmError ? (
                    <span role="alert" style={{ fontSize: "12px", color: "#B02418" }}>
                      {vals.pmError}
                    </span>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "20px 24px",
                      border: "1px solid #EFEDE8",
                      borderRadius: "20px",
                      fontSize: "14px",
                      color: "#3A3F4A",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0D4F8B"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                    {vals.cardNote}
                  </div>
                </>
              ) : null}
              {vals.is.settings ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} data-sec="settings">
                    <span
                      style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}
                    >
                      Your details
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
                      Settings
                    </h1>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "20px" }} data-cols="2">
                    <form
                      style={{
                        border: "1px solid #EFEDE8",
                        borderRadius: "28px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                      onSubmit={vals.profileForm.save}
                    >
                      <h2
                        style={{
                          margin: "0 0 4px",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "22px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        Profile
                      </h2>
                      <label
                        htmlFor="s-name"
                        style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                      >
                        Full name
                        <input
                          id="s-name"
                          type="text"
                          placeholder="Full name"
                          value={vals.profileForm.name}
                          onChange={vals.profileForm.on("name")}
                          style={{
                            height: "50px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            font: "inherit",
                            fontSize: "15px",
                            color: "#111318",
                          }}
                        />
                        <FieldError text={vals.profileForm.errorFor("name")} />
                      </label>
                      <label
                        htmlFor="s-phone"
                        style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                      >
                        Phone
                        <PhoneInput
                          id="s-phone"
                          value={vals.profileForm.phone}
                          onChange={vals.profileForm.on("phone")}
                          invalid={!!vals.profileForm.errorFor("phone")}
                          height={50}
                          radius={14}
                          border="1px solid #E6E4DE"
                        />
                        <FieldError text={vals.profileForm.errorFor("phone")} />
                      </label>
                      <label
                        htmlFor="s-email"
                        style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                      >
                        Email
                        <input
                          id="s-email"
                          type="email"
                          placeholder="you@example.com"
                          value={vals.profileForm.email}
                          onChange={vals.profileForm.on("email")}
                          style={{
                            height: "50px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            font: "inherit",
                            fontSize: "15px",
                            color: "#111318",
                          }}
                        />
                        <FieldError text={vals.profileForm.errorFor("email")} />
                      </label>
                      <button
                        type="submit"
                        className="btn-y"
                        disabled={vals.profileForm.busy}
                        style={{
                          alignSelf: "flex-start",
                          height: "48px",
                          padding: "0 22px",
                          border: "none",
                          borderRadius: "14px",
                          background: vals.profileForm.saveBg,
                          color: "#FFFFFF",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                        suppressHydrationWarning
                      >
                        {vals.profileForm.saveLabel}
                      </button>
                      <FieldError text={vals.profileForm.error} />
                    </form>
                    <div
                      style={{
                        border: "1px solid #EFEDE8",
                        borderRadius: "28px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <h2
                        style={{
                          margin: "0 0 8px",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "22px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        Notifications
                      </h2>
                      {(vals.notif || []).map((n, i0) => (
                        <Fragment key={i0}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "16px",
                              padding: "12px 0",
                              borderBottom: "1px solid #EFEDE8",
                            }}
                          >
                            <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ fontSize: "15px", fontWeight: "600" }} suppressHydrationWarning>
                                {n.label}
                              </span>
                              <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                                {n.sub}
                              </span>
                            </span>
                            <button
                              type="button"
                              role="switch"
                              onClick={n.toggle}
                              aria-checked={n.aria}
                              aria-label={n.label}
                              style={{
                                width: "52px",
                                height: "44px",
                                flexShrink: "0",
                                padding: "0",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  position: "relative",
                                  display: "block",
                                  width: "52px",
                                  height: "30px",
                                  borderRadius: "999px",
                                  background: n.track,
                                  transition: "background .2s ease",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "3px",
                                    left: n.knob,
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "999px",
                                    background: "#FFFFFF",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                    transition: "left .2s ease",
                                  }}
                                  data-abs="deco"
                                />
                              </span>
                            </button>
                          </div>
                        </Fragment>
                      ))}
                      <FieldError text={vals.notifError} />
                    </div>
                    <form
                      style={{
                        border: "1px solid #EFEDE8",
                        borderRadius: "28px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                      onSubmit={vals.passwordForm.save}
                    >
                      <h2
                        style={{
                          margin: "0 0 4px",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "22px",
                          fontWeight: "700",
                          letterSpacing: "-0.03em",
                        }}
                        suppressHydrationWarning
                      >
                        {vals.passwordForm.title}
                      </h2>
                      <span style={{ fontSize: "13px", color: "#5E6470" }} suppressHydrationWarning>
                        {vals.passwordForm.intro}
                      </span>
                      {vals.passwordForm.hasPassword ? (
                        <label
                          htmlFor="s-pw-current"
                          style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                        >
                          Current password
                          <input
                            id="s-pw-current"
                            type="password"
                            autoComplete="current-password"
                            value={vals.passwordForm.current}
                            onChange={vals.passwordForm.on("current")}
                            style={{
                              height: "50px",
                              boxSizing: "border-box",
                              padding: "0 16px",
                              border: "1px solid #E6E4DE",
                              borderRadius: "14px",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                          <FieldError text={vals.passwordForm.errorFor("current")} />
                        </label>
                      ) : null}
                      <label
                        htmlFor="s-pw-new"
                        style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                      >
                        New password
                        <input
                          id="s-pw-new"
                          type="password"
                          autoComplete="new-password"
                          value={vals.passwordForm.password}
                          onChange={vals.passwordForm.on("password")}
                          style={{
                            height: "50px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            font: "inherit",
                            fontSize: "15px",
                            color: "#111318",
                          }}
                        />
                        <FieldError text={vals.passwordForm.errorFor("password")} />
                      </label>
                      <label
                        htmlFor="s-pw-confirm"
                        style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                      >
                        Confirm new password
                        <input
                          id="s-pw-confirm"
                          type="password"
                          autoComplete="new-password"
                          value={vals.passwordForm.confirm}
                          onChange={vals.passwordForm.on("confirm")}
                          style={{
                            height: "50px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            font: "inherit",
                            fontSize: "15px",
                            color: "#111318",
                          }}
                        />
                        <FieldError text={vals.passwordForm.errorFor("confirm")} />
                      </label>
                      <button
                        type="submit"
                        className="btn-y"
                        disabled={vals.passwordForm.busy}
                        style={{
                          alignSelf: "flex-start",
                          height: "48px",
                          padding: "0 22px",
                          border: "none",
                          borderRadius: "14px",
                          background: vals.passwordForm.saveBg,
                          color: "#FFFFFF",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                        suppressHydrationWarning
                      >
                        {vals.passwordForm.saveLabel}
                      </button>
                      <FieldError text={vals.passwordForm.error} />
                    </form>
                  </div>
                </>
              ) : null}
            </section>
          </main>
          <SiteFooter />
        </div>
      </>
    );
  }
}

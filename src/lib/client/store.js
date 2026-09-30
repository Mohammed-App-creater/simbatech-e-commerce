/*
 * Client-side session store shared by every screen: the signed-in user, the cart, the wishlist,
 * the store's details and which sign-in methods are available. Screens are React class
 * components, so they read it with `shopState(props.initial)` in renderVals() and re-render via
 * `connectShop(this)` in componentDidMount.
 *
 * The server passes each page an `initial` snapshot ({ user, cart, wishlist, store, auth, ... }).
 * On the server the store is never mutated (it would leak between requests); rendering uses the
 * props directly. In the browser the first page load hydrates the store from those props, and
 * later client-side navigations keep the store, which actions have kept up to date.
 */
import { api, ApiError } from "./api";
import { formatETB } from "../pricing";

const isBrowser = typeof window !== "undefined";

let state = null; // { user, cart, wishlist: string[], store, auth }
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn(state));
}

function set(patch) {
  state = { ...state, ...patch };
  emit();
}

function fromInitial(initial) {
  return {
    user: (initial && initial.user) || null,
    cart: (initial && initial.cart) || null,
    wishlist: (initial && initial.wishlist) || [],
    store: (initial && initial.store) || null,
    auth: (initial && initial.auth) || null,
  };
}

/** Current state: the client store once hydrated, otherwise the page's server snapshot. */
export function shopState(initial) {
  if (isBrowser && !state && initial) state = fromInitial(initial);
  if (isBrowser && state && initial) {
    // a full page load after a server-side change (e.g. Google sign-in redirect) refreshes the user
    if (initial.user && (!state.user || state.user.id !== initial.user.id)) state = { ...state, user: initial.user, cart: initial.cart, wishlist: initial.wishlist };
    if (!state.store && initial.store) state = { ...state, store: initial.store, auth: initial.auth };
  }
  return state || fromInitial(initial);
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Call from a class component's componentDidMount; returns the unsubscribe function. */
export function connectShop(component) {
  return subscribe(() => component.forceUpdate());
}

// ── Navigation (registered by <RouterBridge/> in the root layout) ──
let router = null;
export function registerRouter(r) {
  router = r;
}
export function navigate(href, { replace = false } = {}) {
  if (isBrowser) window.dispatchEvent(new Event("nav:start")); // top progress bar (NavProgress)
  if (router) (replace ? router.replace : router.push)(href);
  else if (isBrowser) window.location.assign(href);
}
export function refreshServerData() {
  if (router) router.refresh();
}

// ── Store details (from StoreSettings in the admin) with safe fallbacks ──
const STORE_DEFAULTS = {
  name: "Simbatech",
  city: "Addis Ababa",
  address: "Bole Road, Addis Ababa",
  phone: "0911 000 000",
  whatsapp: "0911 000 000",
  email: "hello@simbatech.et",
  hours: "Mon–Sat, 8am–7pm",
  sameDayCutoffHour: 16,
  pickupReadyHours: 2,
  returnDays: 7,
  depositRefundDays: 3,
  warranty: "12-month manufacturer's warranty",
  damagePolicy: "Normal wear is fine. Damage beyond that is charged from the deposit.",
  payOnDeliveryTerms: "Pay the driver by Telebirr or card when your order arrives.",
};
export function storeVals(s) {
  return { ...STORE_DEFAULTS, ...((s && s.store) || {}) };
}
export function authConfig(s) {
  return { google: false, otp: true, otpDevMode: false, passwordReset: true, ...((s && s.auth) || {}) };
}

// ── Header values every screen shows ──
export function headerVals(s) {
  const cart = s.cart;
  const first = s.user ? s.user.name.split(" ")[0] : null;
  return {
    cartCount: cart ? cart.count : 0,
    cartTotal: formatETB(cart ? cart.totals.total : 0),
    wishCount: s.wishlist.length,
    signedIn: !!s.user,
    userName: s.user ? s.user.name : "",
    userInitials: s.user
      ? s.user.name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "",
    accountHref: s.user ? "/account" : "/signin",
    accountHello: first ? "Hello, " + first : "Hello, sign in",
  };
}

/** Submit handler for the header search form (reads the input and the Buy/Rent toggle). */
export function submitSearch(e, mode) {
  e.preventDefault();
  const input = e.currentTarget.querySelector('input[type="search"]');
  const q = input ? input.value.trim() : "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (mode === "rent") params.set("mode", "rent");
  const qs = params.toString();
  navigate("/shop" + (qs ? "?" + qs : ""));
}

// ── Cart ──
function setCart(cart) {
  set({ cart });
  return cart;
}

export const cart = {
  /** input: { productId, mode: "buy"|"rent", qty?, variant?, rentStart?: "yyyy-mm-dd", rentDays?, addOns?: string[] } */
  add: (input) => api("POST", "/api/cart", input).then(setCart),
  /** Books every rentable product in a bundle: { bundleId, rentStart?, rentDays? } */
  addBundle: (input) => api("POST", "/api/cart/bundle", input).then(setCart),
  update: (lineId, patch) => api("PATCH", "/api/cart/items/" + lineId, patch).then(setCart),
  remove: (lineId) => api("DELETE", "/api/cart/items/" + lineId).then(setCart),
  applyPromo: (code) => api("POST", "/api/cart/promo", { code }).then(setCart),
  removePromo: () => api("DELETE", "/api/cart/promo").then(setCart),
  reload: () => api("GET", "/api/cart").then(setCart),
};

// ── Wishlist ──
export const wishlist = {
  has: (s, productId) => s.wishlist.includes(productId),
  /** Toggles a product; guests are sent to sign in first. */
  toggle: async (productId) => {
    if (!state || !state.user) {
      navigate("/signin?next=" + encodeURIComponent(isBrowser ? window.location.pathname : "/"));
      return;
    }
    const saved = !state.wishlist.includes(productId);
    set({ wishlist: saved ? [...state.wishlist, productId] : state.wishlist.filter((id) => id !== productId) }); // optimistic
    try {
      const res = await api("POST", "/api/wishlist", { productId, saved });
      set({ wishlist: res.ids });
    } catch (e) {
      set({ wishlist: saved ? state.wishlist.filter((id) => id !== productId) : [...state.wishlist, productId] });
      throw e;
    }
  },
};

// ── Auth ──
async function afterAuth(user) {
  const [cartRes, wishRes] = await Promise.all([api("GET", "/api/cart"), api("GET", "/api/wishlist")]);
  set({ user, cart: cartRes, wishlist: wishRes.ids });
  return user;
}

export const auth = {
  signIn: async (identifier, password, remember) => afterAuth((await api("POST", "/api/auth/signin", { identifier, password, remember })).user),
  signUp: async (name, identifier, password) => afterAuth((await api("POST", "/api/auth/signup", { name, identifier, password })).user),
  signOut: async () => {
    await api("POST", "/api/auth/signout");
    set({ user: null, wishlist: [], cart: await api("GET", "/api/cart") });
  },
  /** Phone sign-in step 1 → { sent, phone, newAccount, expiresInMinutes, resendInSeconds, devCode? } */
  otpSend: (phone) => api("POST", "/api/auth/otp/send", { phone }),
  /** Step 2. `name` is required when `newAccount` was true (the API answers 422 field "name" otherwise). */
  otpVerify: async (phone, code, name, remember) => afterAuth((await api("POST", "/api/auth/otp/verify", { phone, code, name, remember })).user),
  /** Full-page redirect to Google (only when authConfig(s).google is true). */
  googleStartUrl: (next) => "/api/auth/google/start?next=" + encodeURIComponent(next || "/account"),
  /** → { via: "email", sent, devLink? } or { via: "sms", sent, devCode?, resendInSeconds } */
  forgotPassword: (identifier) => api("POST", "/api/auth/password/forgot", { identifier }),
  /** Either { uid, token, password } (email link) or { phone, code, password } (SMS). Signs the user in. */
  resetPassword: async (payload) => afterAuth((await api("POST", "/api/auth/password/reset", payload)).user),
  /** `current` may be empty when the account has no password yet (Google / OTP accounts). */
  changePassword: async (current, password) => {
    const { user } = await api("POST", "/api/auth/password/change", { current, password });
    set({ user });
    return user;
  },
  updateProfile: async (patch) => {
    const { user } = await api("PATCH", "/api/auth/me", patch);
    set({ user });
    return user;
  },
};

// ── Notification preferences: { sms, email, remind, deals } ──
export const notifications = {
  get: () => api("GET", "/api/auth/notifications"),
  update: (patch) => api("PATCH", "/api/auth/notifications", patch),
};

// ── Saved payment methods: { id, kind: "telebirr"|"card", label, phone, brand, last4, expiry, holder, isDefault } ──
export const paymentMethods = {
  list: () => api("GET", "/api/payment-methods").then((r) => r.methods),
  /** { kind: "telebirr", phone } or { kind: "card", brand: "Visa"|"Mastercard", last4, expiry: "MM/YY", holder? }, plus label?, isDefault? */
  add: (data) => api("POST", "/api/payment-methods", data).then((r) => r.methods),
  update: (id, patch) => api("PATCH", "/api/payment-methods/" + id, patch).then((r) => r.methods),
  remove: (id) => api("DELETE", "/api/payment-methods/" + id).then((r) => r.methods),
};

// ── Reviews: { rating, count, distribution: [{stars, count, percent}], items: [{id, rating, title, body, author, createdAt}], mine } ──
export const reviews = {
  list: (productId) => api("GET", "/api/products/" + productId + "/reviews"),
  write: (productId, data) => api("POST", "/api/products/" + productId + "/reviews", data),
  remove: (productId) => api("DELETE", "/api/products/" + productId + "/reviews"),
};

// ── Checkout & payments ──
/** Places the order. Returns { orderId, number, payment: { status: "paid"|"pending", method, redirectUrl?, simulated? } } */
export async function placeOrder(payload) {
  const res = await api("POST", "/api/checkout", payload);
  await cart.reload();
  return res;
}

/** After placeOrder: go to the gateway if the order needs paying online, otherwise to the confirmation page. */
export function finishCheckout(res) {
  if (res.payment && res.payment.redirectUrl) window.location.assign(res.payment.redirectUrl);
  else navigate("/order-confirmed/" + res.orderId);
}

export const payments = {
  /** (Re)start online payment for an unpaid Telebirr / card order; sends the browser to the gateway. */
  payNow: async (orderId) => {
    const { redirectUrl } = await api("POST", "/api/payments/start", { orderId });
    window.location.assign(redirectUrl);
  },
};

/** Public order lookup for the Track order page. */
export const trackOrder = (number, phone) => api("GET", "/api/orders/track?number=" + encodeURIComponent(number) + "&phone=" + encodeURIComponent(phone));

/** { topic: "support"|"sell"|"careers"|"other", name, contact, message } */
export const sendContact = (data) => api("POST", "/api/contact", data);

export async function subscribeNewsletter(email) {
  return api("POST", "/api/newsletter", { email });
}

export { api, ApiError, formatETB };

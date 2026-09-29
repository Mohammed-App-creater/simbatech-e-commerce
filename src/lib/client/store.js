/*
 * Client-side session store shared by every screen: the signed-in user, the cart and the
 * wishlist. Screens are React class components, so they read it with `shopState(props.initial)`
 * in renderVals() and re-render via `subscribe()` (see connectShop below).
 *
 * The server passes each page an `initial` snapshot ({ user, cart, wishlist }). On the server the
 * store is never mutated (it would leak between requests); rendering uses the props directly.
 * In the browser the first page load hydrates the store from those props, and later client-side
 * navigations keep the store, which actions have kept up to date.
 */
import { api, ApiError } from "./api";
import { formatETB } from "../pricing";

const isBrowser = typeof window !== "undefined";

let state = null; // { user, cart, wishlist: string[] }
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn(state));
}

function set(patch) {
  state = { ...state, ...patch };
  emit();
}

/** Current state: the client store once hydrated, otherwise the page's server snapshot. */
export function shopState(initial) {
  if (isBrowser && !state && initial) state = { user: initial.user || null, cart: initial.cart || null, wishlist: initial.wishlist || [] };
  return state || { user: (initial && initial.user) || null, cart: (initial && initial.cart) || null, wishlist: (initial && initial.wishlist) || [] };
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
  if (router) (replace ? router.replace : router.push)(href);
  else if (isBrowser) window.location.assign(href);
}
export function refreshServerData() {
  if (router) router.refresh();
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
  /** input: { productId, mode: "buy"|"rent", qty?, rentStart?: "yyyy-mm-dd", rentDays?, addOns?: string[] } */
  add: (input) => api("POST", "/api/cart", input).then(setCart),
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
}

export const auth = {
  signIn: async (identifier, password, remember) => {
    const { user } = await api("POST", "/api/auth/signin", { identifier, password, remember });
    await afterAuth(user);
    return user;
  },
  signUp: async (name, identifier, password) => {
    const { user } = await api("POST", "/api/auth/signup", { name, identifier, password });
    await afterAuth(user);
    return user;
  },
  signOut: async () => {
    await api("POST", "/api/auth/signout");
    set({ user: null, wishlist: [], cart: await api("GET", "/api/cart") });
  },
};

// ── Checkout ──
export async function placeOrder(payload) {
  const res = await api("POST", "/api/checkout", payload);
  await cart.reload();
  return res;
}

export async function subscribeNewsletter(email) {
  return api("POST", "/api/newsletter", { email });
}

export { api, ApiError, formatETB };

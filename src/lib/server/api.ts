import "server-only";
import { headers } from "next/headers";

/*
 * Server-side access to the Django API (used by the page loaders in src/app). The visitor's
 * cookies are forwarded so the API sees the same session the browser has.
 */

const API_URL = process.env.API_URL || "http://localhost:8000";

export class ApiRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** GET a JSON endpoint. Returns null for 401/404 so pages can redirect or show not-found. */
export async function apiGet<T>(path: string): Promise<T | null> {
  const cookie = (await headers()).get("cookie") ?? "";
  const res = await fetch(`${API_URL}/api${path}`, { headers: { cookie, accept: "application/json" }, cache: "no-store" });
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiRequestError(res.status, body?.error || `API request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

/*
 * GET a public endpoint whose response is the same for every visitor (catalog, store settings, content
 * pages). No cookies are sent, so Next.js can cache it: pages render from the cache and refresh it in
 * the background at most once a minute, instead of waiting on the API for every page view.
 */
const PUBLIC_REVALIDATE_SECONDS = 60;
async function apiGetPublic<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { accept: "application/json" },
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiRequestError(res.status, body?.error || `API request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// ── Shapes the pages pass to the screens (the API defines them; see simbatech-api) ──

export type ProductDTO = {
  id: string;
  name: string;
  description: string;
  cat: string;
  dept: string;
  brand: string;
  kind: string;
  bg: string;
  sku: string | null;
  buy: number;
  was?: number;
  rent?: number;
  rentOnly: boolean;
  deposit: number;
  rating: string;
  reviews: number;
  avail: boolean;
  left: number;
  sold: number;
  free: boolean;
  shipsInDays?: number;
  warranty: string | null;
  specs: [string, string][];
  inTheBox: string[];
  plans: { days: number; price: number }[];
  addOns: { key: string; label: string; note?: string; perDay: number }[];
  variants: { key: string; label: string; extra: number }[];
};

export type CartLineDTO = {
  id: number;
  product: ProductDTO;
  variant: { key: string; label: string; extra: number } | null;
  mode: "buy" | "rent";
  qty: number;
  rentStart: string | null;
  rentEnd: string | null;
  rentDays: number | null;
  addOns: string[];
  unitPrice: number;
  lineTotal: number;
  deposit: number;
  savedForLater: boolean;
};

export type CartDTO = {
  id: string | null;
  lines: CartLineDTO[];
  saved: CartLineDTO[];
  promo: { code: string; percentOff: number } | null;
  totals: Record<string, number>;
  count: number;
};

export type StoreDTO = {
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  sameDayCutoffHour: number;
  pickupReadyHours: number;
  returnDays: number;
  depositRefundDays: number;
  warranty: string;
  damagePolicy: string;
  payOnDeliveryTerms: string;
};

export type AuthConfig = { google: boolean; otp: boolean; otpDevMode: boolean; passwordReset: boolean };

export type Shell = {
  user: { id: number; name: string; email: string | null; phone: string | null; createdAt: string; hasPassword: boolean; google: boolean } | null;
  cart: CartDTO;
  wishlist: string[];
  store: StoreDTO;
  auth: AuthConfig;
};

export type OrderDTO = { id: string; number: string; [key: string]: unknown };
export type PageDTO = { slug: string; title: string; summary: string; body: string; updatedAt: string };

export const getShell = () => apiGet<Shell>("/shell") as Promise<Shell>;
export const getStore = () => apiGetPublic<StoreDTO>("/settings") as Promise<StoreDTO>;
export const listProducts = async () => (await apiGetPublic<{ items: ProductDTO[] }>("/products"))?.items ?? [];
export const getProduct = (slug: string) => apiGetPublic<ProductDTO>(`/products/${encodeURIComponent(slug)}`);
export const getReviews = (slug: string) => apiGet<Record<string, unknown>>(`/products/${encodeURIComponent(slug)}/reviews`);
export const listCategories = async () => (await apiGetPublic<{ items: unknown[] }>("/categories"))?.items ?? [];
export const listBrands = async () => (await apiGetPublic<{ items: unknown[] }>("/brands"))?.items ?? [];
export const listBundles = async () => (await apiGetPublic<{ items: unknown[] }>("/bundles"))?.items ?? [];
export const listOrders = async () => (await apiGet<{ orders: OrderDTO[] }>("/orders"))?.orders ?? [];
export const getOrder = (id: string) => apiGet<OrderDTO>(`/orders/${encodeURIComponent(id)}`);
export const listAddresses = async () => (await apiGet<{ addresses: unknown[] }>("/addresses"))?.addresses ?? [];
export const listPaymentMethods = async () => (await apiGet<{ methods: unknown[] }>("/payment-methods"))?.methods ?? [];
export const getNotifications = () => apiGet<Record<string, boolean>>("/auth/notifications");
export const listPages = async () => (await apiGetPublic<{ items: { slug: string; title: string; summary: string }[] }>("/pages"))?.items ?? [];
export const getPage = (slug: string) => apiGetPublic<PageDTO>(`/pages/${encodeURIComponent(slug)}`);

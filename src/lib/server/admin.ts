import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ApiRequestError } from "./api";

/*
 * Server-side access to the API's staff endpoints (/api/admin/*), for the pages under src/app/admin.
 * The API decides who is staff: a signed-out visitor is sent to sign in, and a customer gets the
 * site's not-found page, the same as for any address that doesn't exist.
 */

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function adminGet<T = Record<string, unknown>>(path: string): Promise<T> {
  const cookie = (await headers()).get("cookie") ?? "";
  const res = await fetch(`${API_URL}/api/admin${path}`, { headers: { cookie, accept: "application/json" }, cache: "no-store" });
  if (res.status === 401) redirect("/signin?next=/admin");
  if (res.status === 403 || res.status === 404) notFound();
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiRequestError(res.status, body?.error || `API request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

/** "?a=1&b=2" from the filters a page received (empty values left out). */
export function query(params: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) q.set(key, value);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export type AdminCounts = { openOrders: number; pendingReviews: number; openMessages: number };
export type AdminMe = { user: { id: number; name: string; email: string | null; phone: string | null }; counts: AdminCounts };

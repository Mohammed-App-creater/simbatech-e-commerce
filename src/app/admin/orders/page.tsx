import type { Metadata } from "next";
import AdminOrders from "@/screens/admin/AdminOrders";
import { adminGet, query } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Orders" };

const STATUSES = ["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && STATUSES.includes(sp.status) ? sp.status : "";
  const q = (sp.q || "").trim();
  const data = await adminGet(`/orders${query({ status, q })}`);
  return <AdminOrders initial={{ ...data, status, q }} />;
}

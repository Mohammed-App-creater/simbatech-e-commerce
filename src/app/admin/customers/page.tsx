import type { Metadata } from "next";
import AdminCustomers from "@/screens/admin/AdminCustomers";
import { adminGet, query } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Customers" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q || "").trim();
  const data = await adminGet(`/customers${query({ q })}`);
  return <AdminCustomers initial={{ ...data, q }} />;
}

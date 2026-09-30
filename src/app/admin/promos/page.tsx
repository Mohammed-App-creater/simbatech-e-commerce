import type { Metadata } from "next";
import AdminPromos from "@/screens/admin/AdminPromos";
import { adminGet } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Promo codes" };

export default async function Page() {
  return <AdminPromos initial={await adminGet("/promos")} />;
}

import type { Metadata } from "next";
import AdminReviews from "@/screens/admin/AdminReviews";
import { adminGet, query } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Reviews" };

const STATUSES = ["pending", "approved", "rejected", "all"];

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && STATUSES.includes(sp.status) ? sp.status : "pending";
  const data = await adminGet(`/reviews${query({ status })}`);
  return <AdminReviews initial={{ ...data, status }} />;
}

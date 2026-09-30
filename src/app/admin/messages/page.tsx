import type { Metadata } from "next";
import AdminMessages from "@/screens/admin/AdminMessages";
import { adminGet, query } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Messages" };

const SHOW = ["open", "handled", "all"];

export default async function Page({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const sp = await searchParams;
  const show = sp.show && SHOW.includes(sp.show) ? sp.show : "open";
  const data = await adminGet(`/messages${query({ show })}`);
  return <AdminMessages initial={{ ...data, show }} />;
}

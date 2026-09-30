import type { Metadata } from "next";
import AdminOrder from "@/screens/admin/AdminOrder";
import { adminGet } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Order" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await adminGet(`/orders/${encodeURIComponent(id)}`);
  return <AdminOrder initial={{ order }} />;
}

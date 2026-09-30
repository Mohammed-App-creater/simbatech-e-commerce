import type { Metadata } from "next";
import AdminSettings from "@/screens/admin/AdminSettings";
import { adminGet } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Store details" };

export default async function Page() {
  return <AdminSettings initial={{ store: await adminGet("/settings") }} />;
}

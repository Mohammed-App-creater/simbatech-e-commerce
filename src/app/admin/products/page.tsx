import type { Metadata } from "next";
import AdminProducts from "@/screens/admin/AdminProducts";
import { adminGet } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Products" };

export default async function Page() {
  return <AdminProducts initial={await adminGet("/products")} />;
}

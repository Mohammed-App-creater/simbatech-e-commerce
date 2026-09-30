import type { Metadata } from "next";
import AdminProductForm from "@/screens/admin/AdminProductForm";
import { adminGet } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — New product" };

export default async function Page() {
  const { options } = await adminGet<{ options: unknown }>("/products");
  return <AdminProductForm initial={{ product: null, options }} />;
}

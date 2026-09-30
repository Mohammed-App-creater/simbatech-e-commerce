import type { Metadata } from "next";
import AdminProductForm from "@/screens/admin/AdminProductForm";
import { adminGet } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech admin — Edit product" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // key: going from one product to another starts the form afresh
  return <AdminProductForm key={slug} initial={await adminGet(`/products/${encodeURIComponent(slug)}`)} />;
}

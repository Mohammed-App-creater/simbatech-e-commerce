import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductScreen from "@/screens/ProductScreen";
import { getProduct, getShell, listProducts } from "@/lib/server/api";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product ? `Simbatech — ${product.name}` : "Simbatech — Product not found" };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const [shell, product, all] = await Promise.all([getShell(), getProduct(slug), listProducts()]);
  if (!product) notFound();
  const others = all.filter((p) => p.id !== product.id);
  // "You might also need": same department first, then the rest
  const related = [...others.filter((p) => p.dept === product.dept), ...others.filter((p) => p.dept !== product.dept)].slice(0, 4);
  // "Frequently rented together": other rentable items
  const rentTogether = others.filter((p) => p.rent).slice(0, 2);
  return <ProductScreen key={slug} initial={{ ...shell, product, related, rentTogether }} />;
}

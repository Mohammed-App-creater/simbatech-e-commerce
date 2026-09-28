import type { Metadata } from "next";
import ProductScreen from "@/screens/ProductScreen";

export const metadata: Metadata = { title: "Simbatech — Lumen Z6 Camera" };

export default function Page() {
  return <ProductScreen />;
}

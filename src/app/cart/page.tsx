import type { Metadata } from "next";
import CartScreen from "@/screens/CartScreen";

export const metadata: Metadata = { title: "Simbatech — Your cart" };

export default function Page() {
  return <CartScreen />;
}

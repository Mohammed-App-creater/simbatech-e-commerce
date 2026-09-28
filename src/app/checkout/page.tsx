import type { Metadata } from "next";
import CheckoutScreen from "@/screens/CheckoutScreen";

export const metadata: Metadata = { title: "Simbatech — Checkout" };

export default function Page() {
  return <CheckoutScreen />;
}

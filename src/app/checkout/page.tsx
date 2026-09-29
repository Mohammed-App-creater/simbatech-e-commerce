import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutScreen from "@/screens/CheckoutScreen";
import { getShell, listAddresses } from "@/lib/server/api";
import { shopToday } from "@/lib/pricing";

export const metadata: Metadata = { title: "Simbatech — Checkout" };

export default async function Page({ searchParams }: { searchParams: Promise<{ fulfilment?: string }> }) {
  const { fulfilment } = await searchParams;
  const shell = await getShell();
  if (!shell.cart.lines.length) redirect("/cart");
  const addresses = shell.user ? await listAddresses() : [];
  return (
    <CheckoutScreen
      initial={{
        ...shell,
        addresses,
        today: new Date().toISOString(),
        todayLocal: shopToday(), // yyyy-mm-dd in Addis Ababa time; the API uses the same date for same-day delivery
        fulfilment: fulfilment === "pickup" ? "pickup" : "delivery",
      }}
    />
  );
}

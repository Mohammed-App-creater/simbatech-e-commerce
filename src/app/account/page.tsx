import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountScreen from "@/screens/AccountScreen";
import { getShell, listAddresses, listOrders, listProducts } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — My account" };

const TABS = ["overview", "orders", "rentals", "wishlist", "addresses", "payment", "settings"];

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const shell = await getShell();
  if (!shell.user) redirect("/signin?next=/account");
  const [orders, addresses, products] = await Promise.all([listOrders(), listAddresses(), listProducts()]);
  return (
    <AccountScreen
      initial={{
        ...shell,
        orders,
        addresses,
        products, // lets the wishlist tab render saved items from shell.wishlist ids
        today: new Date().toISOString(),
        tab: tab && TABS.includes(tab) ? tab : "overview",
      }}
    />
  );
}

import type { Metadata } from "next";
import CartScreen from "@/screens/CartScreen";
import { getShell, listAddresses, listProducts } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Your cart" };

export default async function Page() {
  const [shell, products] = await Promise.all([getShell(), listProducts()]);
  const addresses = (shell.user ? await listAddresses() : []) as { isDefault: boolean }[];
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
  const inCart = new Set([...shell.cart.lines, ...shell.cart.saved].map((l) => l.product.id));
  const recommendations = products.filter((p) => !inCart.has(p.id) && !p.rentOnly).slice(0, 4);
  return <CartScreen initial={{ ...shell, recommendations, defaultAddress }} />;
}

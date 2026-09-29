import type { Metadata } from "next";
import HomeScreen from "@/screens/HomeScreen";
import { getShell, listCategories, listProducts } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Home" };

export default async function Page() {
  const [shell, products, categories] = await Promise.all([getShell(), listProducts(), listCategories()]);
  return <HomeScreen initial={{ ...shell, products, categories }} />;
}

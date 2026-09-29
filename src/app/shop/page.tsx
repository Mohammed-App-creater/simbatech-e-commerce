import type { Metadata } from "next";
import ShopScreen from "@/screens/ShopScreen";
import { getShell, listBrands, listCategories, listProducts } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Shop and rent" };

type Search = Promise<{ q?: string; mode?: string; dept?: string | string[]; brand?: string | string[]; deals?: string }>;

const list = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const [shell, products, categories, brands] = await Promise.all([getShell(), listProducts(), listCategories(), listBrands()]);
  const query = {
    q: sp.q ?? "",
    mode: sp.mode === "rent" || sp.mode === "buy" ? sp.mode : "all",
    depts: list(sp.dept),
    brands: list(sp.brand),
    deals: sp.deals === "1" || sp.deals === "true",
  };
  // key: a new search from the header remounts the screen so its filter state starts from the URL
  return <ShopScreen key={JSON.stringify(query)} initial={{ ...shell, products, categories, brands, query }} />;
}

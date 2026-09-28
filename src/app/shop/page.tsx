import type { Metadata } from "next";
import ShopScreen from "@/screens/ShopScreen";

export const metadata: Metadata = { title: "Simbatech — Shop and rent" };

export default function Page() {
  return <ShopScreen />;
}

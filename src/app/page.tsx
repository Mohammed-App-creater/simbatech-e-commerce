import type { Metadata } from "next";
import HomeScreen from "@/screens/HomeScreen";

export const metadata: Metadata = { title: "Simbatech — Home" };

export default function Page() {
  return <HomeScreen />;
}

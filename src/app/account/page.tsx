import type { Metadata } from "next";
import AccountScreen from "@/screens/AccountScreen";

export const metadata: Metadata = { title: "Simbatech — My account" };

export default function Page() {
  return <AccountScreen />;
}

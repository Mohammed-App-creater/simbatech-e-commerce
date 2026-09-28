import type { Metadata } from "next";
import ConfirmedScreen from "@/screens/ConfirmedScreen";

export const metadata: Metadata = { title: "Simbatech — Order confirmed" };

export default function Page() {
  return <ConfirmedScreen />;
}

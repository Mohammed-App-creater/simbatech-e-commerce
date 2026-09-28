import type { Metadata } from "next";
import SignInScreen from "@/screens/SignInScreen";

export const metadata: Metadata = { title: "Simbatech — Sign in" };

export default function Page() {
  return <SignInScreen />;
}

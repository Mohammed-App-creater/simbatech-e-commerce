import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignInScreen from "@/screens/SignInScreen";
import { getShell } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Sign in" };

// Only same-site paths are allowed as a post-login destination.
const safeNext = (v?: string) => (v && v.startsWith("/") && !v.startsWith("//") ? v : null);

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; tab?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const shell = await getShell();
  // already signed in: to the page asked for, otherwise staff to the admin and customers to their account
  if (shell.user) redirect(next || (shell.user.isStaff ? "/admin" : "/account"));
  return <SignInScreen initial={{ ...shell, next, tab: sp.tab === "signup" ? "signup" : "signin", error: sp.error === "google" ? "google" : null }} />;
}

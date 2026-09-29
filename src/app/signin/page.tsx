import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignInScreen from "@/screens/SignInScreen";
import { getShell } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Sign in" };

// Only same-site paths are allowed as a post-login destination.
const safeNext = (v?: string) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/account");

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; tab?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const shell = await getShell();
  if (shell.user) redirect(next);
  return <SignInScreen initial={{ ...shell, next, tab: sp.tab === "signup" ? "signup" : "signin", error: sp.error === "google" ? "google" : null }} />;
}

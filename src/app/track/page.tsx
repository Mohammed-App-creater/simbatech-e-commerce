import type { Metadata } from "next";
import TrackScreen from "@/screens/TrackScreen";
import { getShell } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Track your order" };

export default async function Page({ searchParams }: { searchParams: Promise<{ number?: string; phone?: string }> }) {
  const [shell, sp] = await Promise.all([getShell(), searchParams]);
  return <TrackScreen initial={{ ...shell, number: sp.number ?? "", phone: sp.phone ?? "" }} />;
}

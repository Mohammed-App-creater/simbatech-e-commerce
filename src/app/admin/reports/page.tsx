import type { Metadata } from "next";
import AdminReports from "@/screens/admin/AdminReports";
import { adminGet, query } from "@/lib/server/admin";
import { shopToday } from "@/lib/pricing";

export const metadata: Metadata = { title: "Simbatech admin — Reports" };

const PRESETS = [7, 30, 90, 365];
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string; from?: string; to?: string }> }) {
  const sp = await searchParams;
  const custom = sp.from && sp.to && DAY.test(sp.from) && DAY.test(sp.to);
  const days = PRESETS.includes(Number(sp.days)) ? Number(sp.days) : 30;
  const report = await adminGet(`/reports${custom ? query({ from: sp.from, to: sp.to }) : query({ days: String(days) })}`);
  return <AdminReports initial={{ ...report, preset: custom ? null : days, today: shopToday() }} />;
}

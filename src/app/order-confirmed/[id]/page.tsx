import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConfirmedScreen from "@/screens/ConfirmedScreen";
import { getOrder, getShell } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Order confirmed" };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ payment?: string }> }) {
  const [{ id }, { payment }] = await Promise.all([params, searchParams]);
  const [shell, order] = await Promise.all([getShell(), getOrder(id)]);
  if (!order) notFound();
  const paymentResult = payment === "paid" || payment === "failed" ? payment : null;
  return <ConfirmedScreen initial={{ ...shell, order, paymentResult }} />;
}

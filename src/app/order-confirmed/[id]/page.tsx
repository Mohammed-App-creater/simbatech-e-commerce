import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConfirmedScreen from "@/screens/ConfirmedScreen";
import { getOrder, getShell } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Order confirmed" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [shell, order] = await Promise.all([getShell(), getOrder((await params).id)]);
  if (!order) notFound();
  return <ConfirmedScreen initial={{ ...shell, order }} />;
}

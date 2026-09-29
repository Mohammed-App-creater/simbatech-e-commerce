import type { Metadata } from "next";
import ResetPasswordScreen from "@/screens/ResetPasswordScreen";
import { getShell } from "@/lib/server/api";

export const metadata: Metadata = { title: "Simbatech — Reset your password" };

export default async function Page({ searchParams }: { searchParams: Promise<{ uid?: string; token?: string }> }) {
  const [shell, sp] = await Promise.all([getShell(), searchParams]);
  return <ResetPasswordScreen initial={{ ...shell, uid: sp.uid ?? "", token: sp.token ?? "" }} />;
}

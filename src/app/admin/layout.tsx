import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { adminGet, type AdminMe } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Simbatech — Admin", robots: { index: false, follow: false } };

// Staff only: adminGet() sends everyone else to sign in (or to the not-found page).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await adminGet<AdminMe>("/me");
  return (
    <AdminShell user={me.user} counts={me.counts}>
      {children}
    </AdminShell>
  );
}

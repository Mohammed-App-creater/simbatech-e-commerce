import AdminOverview from "@/screens/admin/AdminOverview";
import { adminGet } from "@/lib/server/admin";

export default async function Page() {
  const overview = await adminGet("/overview");
  return <AdminOverview initial={{ ...overview, today: new Date().toISOString() }} />;
}

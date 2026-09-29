import { redirect } from "next/navigation";
import { getShell, listOrders } from "@/lib/server/api";

// /order-confirmed without an id: show the signed-in customer's latest order.
export default async function Page() {
  const shell = await getShell();
  if (!shell.user) redirect("/signin?next=/account");
  const [latest] = await listOrders();
  redirect(latest ? `/order-confirmed/${latest.id}` : "/account");
}

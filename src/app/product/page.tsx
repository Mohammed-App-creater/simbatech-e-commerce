import { redirect } from "next/navigation";
import { listProducts } from "@/lib/server/api";

// Rendered per request, not at build time (the build must not depend on the API being awake).
export const dynamic = "force-dynamic";

// /product without a slug (old links) goes to the first product.
export default async function Page() {
  const [first] = await listProducts();
  redirect(first ? `/product/${first.id}` : "/shop");
}

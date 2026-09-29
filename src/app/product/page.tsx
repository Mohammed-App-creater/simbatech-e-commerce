import { redirect } from "next/navigation";
import { listProducts } from "@/lib/server/api";

// /product without a slug (old links) goes to the first product.
export default async function Page() {
  const [first] = await listProducts();
  redirect(first ? `/product/${first.id}` : "/shop");
}

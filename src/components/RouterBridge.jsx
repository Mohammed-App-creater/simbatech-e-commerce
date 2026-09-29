"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerRouter } from "@/lib/client/store";

/* Lets the class-component screens navigate with the Next.js router (no full page reloads). */
export default function RouterBridge() {
  const router = useRouter();
  useEffect(() => {
    registerRouter(router);
  }, [router]);
  return null;
}

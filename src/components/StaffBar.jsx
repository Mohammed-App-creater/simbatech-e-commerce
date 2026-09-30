"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api, shopState, subscribe } from "@/lib/client/store";
import "./staff-bar.css";

/*
 * An "Admin dashboard" button floating over the storefront, for staff only, so they can look at the shop
 * and return to the admin in one click.
 *
 * Who is signed in: the store's user once it has one (it follows sign-in and sign-out), and on a full
 * page load, where this can mount before the page has filled the store, one /api/auth/me call.
 */
let meRequest = null;

export default function StaffBar() {
  const pathname = usePathname() || "/";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fromStore = shopState().user;
    if (!fromStore) meRequest = meRequest || api("GET", "/api/auth/me").then((r) => r.user, () => null);
    (fromStore ? Promise.resolve(fromStore) : meRequest).then((u) => setUser((cur) => cur || u));
    // later changes (sign-in, sign-out) come from the store
    return subscribe((s) => {
      meRequest = null;
      setUser(s.user);
    });
  }, []);

  if (!user || !user.isStaff || pathname.startsWith("/admin")) return null;
  return (
    <Link href="/admin" className="staff-bar">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />
      </svg>
      Admin dashboard
    </Link>
  );
}

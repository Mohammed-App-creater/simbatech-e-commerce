"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth, navigate } from "@/lib/client/store";
import { Icon, initials } from "./ui";
import "./admin.css";

/*
 * The frame around every /admin page: the blue utility bar and logo header of the storefront, and
 * the account page's side menu. `counts` (open orders, reviews waiting, unanswered messages) comes
 * from the layout and is refreshed whenever a screen re-fetches after an action.
 */

const NAV = [
  { href: "/admin", label: "Overview", icon: ["M4 4h7v7H4z", "M13 4h7v4h-7z", "M13 10h7v10h-7z", "M4 13h7v7H4z"] },
  { href: "/admin/orders", label: "Orders", badge: "openOrders", icon: ["M21 8l-9-5-9 5 9 5 9-5z", "M3 8v8l9 5 9-5V8", "M12 13v8"] },
  { href: "/admin/reviews", label: "Reviews", badge: "pendingReviews", icon: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z" },
  { href: "/admin/products", label: "Products", icon: ["M4 7h16v13H4z", "M8 7V5a4 4 0 0 1 8 0v2"] },
  { href: "/admin/messages", label: "Messages", badge: "openMessages", icon: ["M4 5h16v12H9l-5 4z"] },
  { href: "/admin/customers", label: "Customers", icon: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"] },
  { href: "/admin/promos", label: "Promo codes", icon: ["M3 12V4h8l10 10-8 8z", "M7.5 8.5h.01"] },
  { href: "/admin/settings", label: "Store details", icon: ["M4 10l1.5-5h13L20 10", "M5 10v10h14V10", "M4 10h16", "M10 20v-5h4v5"] },
];

export default function AdminShell({ user, counts, children }) {
  const pathname = usePathname() || "/admin";
  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  async function signOut() {
    await auth.signOut().catch(() => {});
    navigate("/");
  }

  return (
    <div className="adm">
      <div className="adm-util">
        <span>
          <Icon d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" size={16} />
          Staff area — changes show on the store within a minute
        </span>
        <Link href="/">
          View the store
          <Icon d="M5 12h14M13 6l6 6-6 6" size={14} width={2} />
        </Link>
      </div>
      <header className="adm-head">
        <Link href="/admin" className="adm-logo" aria-label="Simbatech admin home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Simbatech" />
        </Link>
        <span className="adm-tag">Admin</span>
        <span className="adm-head-space" />
        <div className="adm-user">
          <span className="adm-avatar">{initials(user.name)}</span>
          <span className="adm-user-name">
            <span className="adm-clip">{user.name}</span>
            <small>Staff</small>
          </span>
        </div>
        <button type="button" className="adm-btn" onClick={signOut}>
          Sign out
        </button>
      </header>
      <div className="adm-body">
        <aside className="adm-side">
          <span className="adm-side-title">Manage</span>
          <nav className="adm-nav" aria-label="Admin">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}>
                <Icon d={n.icon} />
                <span>{n.label}</span>
                {n.badge && counts[n.badge] > 0 ? <span className="adm-badge">{counts[n.badge]}</span> : null}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { shopState, subscribe } from "@/lib/client/store";
import "./mobile-tab-bar.css";

const TABS = [
  { href: "/", label: "Home", icon: "M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" },
  { href: "/shop", label: "Shop", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/cart", label: "Cart", icon: "M5 8h14l-1.2 12H6.2L5 8zM9 8V6.5a3 3 0 0 1 6 0V8" },
  { href: "/account", label: "Account", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" },
];

// Flows that have their own call to action at the bottom of the screen.
const HIDDEN_ON = ["/checkout", "/signin"];

/* App-style bottom navigation, shown on phones only (see mobile-tab-bar.css). */
export default function MobileTabBar() {
  const pathname = usePathname() || "/";
  // cart badge: read after mount (the page fills the store) and follow later changes
  const [count, setCount] = useState(0);
  useEffect(() => {
    const read = () => setCount(shopState().cart?.count ?? 0);
    read();
    return subscribe(read);
  }, [pathname]);
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/shop" && pathname.startsWith("/product")));

  return (
    <nav className="mtb" aria-label="Primary">
      {TABS.map((t) => {
        const active = isActive(t.href);
        return (
          <Link key={t.href} href={t.href} className="mtb-item" aria-current={active ? "page" : undefined}>
            <span className="mtb-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={t.icon} />
              </svg>
              {t.href === "/cart" && count > 0 && <b className="mtb-badge">{count}</b>}
            </span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

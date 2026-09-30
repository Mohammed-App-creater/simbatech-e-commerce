"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import DeliverTo from "@/components/DeliverTo";
import CategoryMenu from "@/components/CategoryMenu";
import { shopState, subscribe, headerVals, submitSearch } from "@/lib/client/store";
import { FREE_DELIVERY_THRESHOLD, formatETB } from "@/lib/pricing";

/*
 * The site chrome shared by the content pages (/p/[slug], /track, /reset-password): the utility
 * bar, the header (logo, categories, search, account, wishlist, cart) and the department nav.
 * Markup and inline styles are the design's, copied from HomeScreen so responsive.css/mobile.css
 * apply; "All categories" opens the shared mega menu (CategoryMenu). Screens render it inside their
 * page wrapper, followed by their own content.
 */

// The base rules every generated screen ships in its <style> tag (body, links, hover states).
const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.lift{transition:transform .2s ease, box-shadow .2s ease}\n.lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(13,79,139,.3)}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.btn-t:hover{background:#1A62A8;color:#FFFFFF}\n.btn-w:hover{background:#FFFFFF;color:#0D4F8B}\n.ghost:hover{background:#F1F0EC}\n.nav a:hover{color:#0D4F8B}\n.field:focus-within{border-color:#1679BE;box-shadow:0 0 0 4px rgba(22,121,190,0.14)}\n.field input{outline:none}\ninput:focus-visible,button:focus-visible,a:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #1679BE;outline-offset:2px}\n@media (prefers-reduced-motion: reduce){.lift{transition:none}}\n";

function shopHref(params) {
  const q = Object.keys(params)
    .map((k) => k + "=" + encodeURIComponent(params[k]))
    .join("&");
  return "/shop" + (q ? "?" + q : "");
}
function deptHref(name) {
  return shopHref({ dept: name });
}

const MODES = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
];

export default function SiteHeader({ initial }) {
  const [mode, setMode] = useState("buy");
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((n) => n + 1)), []);

  const shop = shopState(initial);
  const hv = headerVals(shop);
  const wishHref = hv.signedIn ? "/account?tab=wishlist" : "/signin?next=" + encodeURIComponent("/account?tab=wishlist");
  const modes = MODES.map((m) => {
    const on = m.id === mode;
    return {
      label: m.label,
      aria: on ? "true" : "false",
      bg: on ? "#0D4F8B" : "transparent",
      fg: on ? "#FFFFFF" : "#0D4F8B",
      pick: () => setMode(m.id),
    };
  });
  const placeholder =
    mode === "rent" ? 'What do you need to rent? Try "party tent" or "camera"' : "Search phones, sofas, sneakers and more";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        style={{
          height: "40px",
          flexShrink: "0",
          boxSizing: "border-box",
          padding: "0 var(--gutter)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0D4F8B",
          color: "#E6F0F9",
          fontSize: "13px",
        }}
        data-sec="utility-bar"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <DeliverTo />
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8FD19A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
              <circle cx="7" cy="17.5" r="1.8" />
              <circle cx="17" cy="17.5" r="1.8" />
            </svg>
            Free delivery on orders over {formatETB(FREE_DELIVERY_THRESHOLD)}
          </span>
        </div>
        <nav aria-label="Utility" className="nav" style={{ display: "flex", gap: "24px" }}>
          <Link href="/p/sell-with-us" style={{ color: "#E6F0F9" }}>
            Sell or list with us
          </Link>
          <Link href="/track" style={{ color: "#E6F0F9" }}>
            Track order
          </Link>
          <Link href="/p/help" style={{ color: "#E6F0F9" }}>
            Help
          </Link>
          <a href="#" style={{ color: "#E6F0F9" }}>
            English
          </a>
        </nav>
      </div>
      <header
        style={{
          height: "92px",
          flexShrink: "0",
          boxSizing: "border-box",
          padding: "0 var(--gutter)",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
        data-sec="header"
      >
        <Link href="/" aria-label="Simbatech home" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}>
          <img src="/images/logo.png" alt="Simbatech" style={{ height: "54px", width: "auto", display: "block" }} />
        </Link>
        <CategoryMenu />
        <form
          role="search"
          style={{
            flexGrow: "1",
            height: "52px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px",
            boxSizing: "border-box",
            border: "1.5px solid #0D4F8B",
            borderRadius: "16px",
            background: "#FFFFFF",
          }}
          onSubmit={(e) => submitSearch(e, mode)}
        >
          <div
            role="group"
            aria-label="Buy or rent"
            style={{ display: "flex", gap: "2px", padding: "3px", background: "#EAF3FA", borderRadius: "12px", flexShrink: "0" }}
          >
            {modes.map((m, i0) => (
              <Fragment key={i0}>
                <button
                  type="button"
                  onClick={m.pick}
                  aria-pressed={m.aria}
                  style={{
                    height: "30px",
                    padding: "0 14px",
                    border: "none",
                    borderRadius: "9px",
                    background: m.bg,
                    color: m.fg,
                    font: "inherit",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  suppressHydrationWarning
                >
                  {m.label}
                </button>
              </Fragment>
            ))}
          </div>
          <label htmlFor="c-search" className="sr-only">
            Search Simbatech
          </label>
          <input
            id="c-search"
            type="search"
            placeholder={placeholder}
            style={{
              flexGrow: "1",
              minWidth: "0",
              height: "40px",
              border: "none",
              outline: "none",
              background: "transparent",
              font: "inherit",
              fontSize: "15px",
              color: "#111318",
              padding: "0 8px",
            }}
          />
          <button
            type="submit"
            className="btn-y"
            aria-label="Search"
            style={{
              height: "40px",
              padding: "0 20px",
              border: "none",
              borderRadius: "11px",
              background: "#2F7A3C",
              color: "#FFFFFF",
              font: "inherit",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            Search
          </button>
        </form>
        <Link href={hv.accountHref} style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0", height: "52px" }}>
          <span
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              background: "#F3F2EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
            <span style={{ fontSize: "12px", color: "#5E6470" }} suppressHydrationWarning>
              {hv.accountHello}
            </span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Account</span>
          </span>
        </Link>
        <Link
          href={wishHref}
          aria-label={`Wishlist, ${hv.wishCount} saved`}
          style={{
            position: "relative",
            width: "44px",
            height: "44px",
            flexShrink: "0",
            borderRadius: "999px",
            background: "#F3F2EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              minWidth: "18px",
              height: "18px",
              padding: "0 4px",
              boxSizing: "border-box",
              borderRadius: "999px",
              background: "#0D4F8B",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-abs="misc"
            suppressHydrationWarning
          >
            {hv.wishCount}
          </span>
        </Link>
        <Link
          href="/cart"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: "0",
            height: "52px",
            padding: "0 16px 0 6px",
            borderRadius: "16px",
            background: "#0D4F8B",
            color: "#FFFFFF",
          }}
        >
          <span
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "#1A62A8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 8h14l-1.2 12H6.2L5 8z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                minWidth: "18px",
                height: "18px",
                padding: "0 4px",
                boxSizing: "border-box",
                borderRadius: "999px",
                background: "#2F7A3C",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              data-abs="misc"
              suppressHydrationWarning
            >
              {hv.cartCount}
            </span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
            <span style={{ fontSize: "12px", color: "#BFD8EE" }}>My cart</span>
            <span style={{ fontSize: "14px", fontWeight: "700" }} suppressHydrationWarning>
              {hv.cartTotal}
            </span>
          </span>
        </Link>
      </header>
      <nav
        aria-label="Departments"
        className="nav"
        style={{
          height: "52px",
          flexShrink: "0",
          boxSizing: "border-box",
          margin: "0 var(--gutter)",
          display: "flex",
          alignItems: "center",
          gap: "30px",
          borderTop: "1px solid #EFEDE8",
          borderBottom: "1px solid #EFEDE8",
          fontSize: "14px",
          fontWeight: "500",
          color: "#3A3F4A",
        }}
        data-sec="category-nav"
      >
        <Link href={deptHref("Electronics")}>Electronics</Link>
        <Link href={deptHref("Phones")}>Phones</Link>
        <Link href={deptHref("Home & Living")}>{"Home & Living"}</Link>
        <Link href={deptHref("Kitchen")}>Kitchen</Link>
        <Link href={deptHref("Fashion")}>Fashion</Link>
        <Link href={deptHref("Beauty")}>Beauty</Link>
        <Link href={deptHref("Tools & DIY")}>{"Tools & DIY"}</Link>
        <Link href={deptHref("Baby & Kids")}>{"Baby & Kids"}</Link>
        <div style={{ flexGrow: "1" }} />
        <Link
          href="/shop?mode=rent"
          style={{
            height: "32px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "999px",
            background: "#E4F2E6",
            color: "#2F7A3C",
            fontWeight: "600",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          Rent anything
        </Link>
        <Link href="/shop?deals=1" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#C42A1C", fontWeight: "600" }}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
            <circle cx="7.5" cy="7.5" r="1.5" />
          </svg>
          Deals
        </Link>
      </nav>
    </>
  );
}

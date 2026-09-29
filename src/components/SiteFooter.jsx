"use client";

import { useState } from "react";
import Link from "next/link";
import { subscribeNewsletter } from "@/lib/client/store";
import "./site-footer.css";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ["All products", "/shop"],
      ["Rentals", "/shop"],
      ["Deals", "/shop"],
      ["New arrivals", "/shop"],
      ["Rental bundles", "/shop"],
    ],
  },
  {
    title: "Customer care",
    links: [
      ["Delivery", "#"],
      ["Returns", "#"],
      ["Rental terms", "#"],
      ["Track order", "#"],
      ["Help centre", "#"],
    ],
  },
  {
    title: "My account",
    links: [
      ["My orders", "/account"],
      ["My rentals", "/account"],
      ["Wishlist", "/account"],
      ["Wallet", "/account"],
      ["Sign in", "/signin"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Careers", "#"],
      ["Sell with us", "#"],
      ["Contact", "#"],
    ],
  },
];

const SOCIAL = [
  {
    label: "Instagram",
    path: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.3-3.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z",
  },
  {
    label: "Facebook",
    path: "M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z",
  },
  {
    label: "X",
    path: "M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
  },
  {
    label: "WhatsApp",
    path: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z",
  },
];

const YEAR = 2026;

function Newsletter() {
  const [status, setStatus] = useState({ state: "idle", message: "" });
  async function onSubmit(e) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email");
    setStatus({ state: "busy", message: "" });
    try {
      await subscribeNewsletter(input.value);
      input.value = "";
      setStatus({ state: "done", message: "You're subscribed. Watch your inbox for deals." });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="sf-email" className="sr-only">
          Email address
        </label>
        <input id="sf-email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
        <button type="submit" disabled={status.state === "busy"}>
          {status.state === "busy" ? "Subscribing…" : "Subscribe"}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
      {status.message && (
        <small role="status" className={status.state === "error" ? "sf-news-error" : "sf-news-ok"}>
          {status.message}
        </small>
      )}
    </>
  );
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Local-wallet logos. Drop the files into public/images/pay/ and set the paths here;
   while a path is null the badge shows the wallet's name only (no broken-image request). */
const PAY_LOGOS = {
  telebirr: "/images/pay/telebirr.png",
  cbe: "/images/pay/cbe-birr.png",
};

function Payments() {
  return (
    <div className="sf-pay" aria-label="Accepted payment methods">
      <span className="sf-pay-telebirr" role="img" aria-label="telebirr">
        {PAY_LOGOS.telebirr ? <img src={PAY_LOGOS.telebirr} alt="" /> : "telebirr"}
      </span>
      <span className="sf-pay-cbe" role="img" aria-label="CBE Birr">
        {PAY_LOGOS.cbe ? <img src={PAY_LOGOS.cbe} alt="" /> : "CBE Birr"}
      </span>
      <span className="sf-pay-visa">VISA</span>
      <span className="sf-pay-mc" role="img" aria-label="Mastercard">
        <i />
        <i />
      </span>
    </div>
  );
}

function Legal() {
  return (
    <nav className="sf-legal" aria-label="Legal">
      <a href="#">Privacy policy</a>
      <a href="#">Terms of use</a>
      <a href="#">Cookies</a>
    </nav>
  );
}

/* The brand name drawn as SVG text so it always spans the full footer width, at any screen size. */
function Wordmark() {
  return (
    <svg className="sf-wordmark" viewBox="0 0 1000 158" role="img" aria-label="Simbatech">
      <text
        x="0"
        y="150"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="'Bricolage Grotesque', 'Geist', system-ui, sans-serif"
        fontWeight="800"
        fontSize="162"
        letterSpacing="-5"
        fill="#FFFFFF"
      >
        SIMBA<tspan fill="#8FD19A">TECH</tspan>
      </text>
    </svg>
  );
}

export default function SiteFooter({ compact = false }) {
  if (compact) {
    return (
      <footer className="sf sf--compact">
        <div className="sf-row">
          <div className="sf-compact-brand">
            <Link href="/" aria-label="Simbatech home">
              <img src="/images/logo-white.png" alt="Simbatech" className="sf-logo-sm" />
            </Link>
            <span>© {YEAR} Simbatech. All rights reserved.</span>
          </div>
          <Legal />
          <Payments />
        </div>
      </footer>
    );
  }

  return (
    <footer className="sf">
      <div className="sf-glow" aria-hidden="true" />

      <div className="sf-top">
        <div className="sf-news">
          <span className="sf-eyebrow">Newsletter</span>
          <h2>Get deals before everyone else</h2>
          <p>New arrivals, rentals and members-only offers. No spam, unsubscribe any time.</p>
          <Newsletter />
          <div className="sf-social">
            {SOCIAL.map((s) => (
              <a key={s.label} href="#" aria-label={`Simbatech on ${s.label}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <div className="sf-stores">
            <a href="#">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="2" width="12" height="20" rx="3" />
                <path d="M11 18h2" />
              </svg>
              <span>
                <small>Download on the</small>
                App Store
              </span>
            </a>
            <a href="#">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3l13 9-13 9z" />
              </svg>
              <span>
                <small>Get it on</small>
                Google Play
              </span>
            </a>
          </div>
        </div>

        <div className="sf-links">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              {col.links.map(([label, href]) =>
                href === "#" ? (
                  <a key={label} href="#">
                    {label}
                  </a>
                ) : (
                  <Link key={label} href={href}>
                    {label}
                  </Link>
                ),
              )}
            </nav>
          ))}
          <div className="sf-contact">
            <h3>Get in touch</h3>
            <span>[ADDRESS]</span>
            <a href="tel:+251900000000">[PHONE]</a>
            <a href="mailto:hello@simbatech.et">hello@simbatech.et</a>
            <span className="sf-hours">Mon–Sat, 8am–7pm</span>
          </div>
        </div>
      </div>

      <div className="sf-brand">
        <Wordmark />
        <button type="button" className="sf-top-btn" onClick={scrollTop} aria-label="Back to top">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      <div className="sf-bottom">
        <span>© {YEAR} Simbatech. All rights reserved.</span>
        <Legal />
        <div className="sf-bottom-right">
          <span className="sf-locale">Ethiopia · English · ETB</span>
          <Payments />
        </div>
      </div>
    </footer>
  );
}

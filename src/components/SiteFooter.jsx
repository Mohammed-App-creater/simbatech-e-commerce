"use client";

import Link from "next/link";
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
    path: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4zm-3 4.3c-.2 0-.5 0-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5H9z",
  },
];

const YEAR = 2026;

function preventSubmit(e) {
  e.preventDefault();
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Payments() {
  return (
    <div className="sf-pay" aria-label="Accepted payment methods">
      <span className="sf-pay-telebirr">TELEBIRR</span>
      <span className="sf-pay-cbe">CBE BIRR</span>
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
          <form onSubmit={preventSubmit}>
            <label htmlFor="sf-email" className="sr-only">
              Email address
            </label>
            <input id="sf-email" type="email" placeholder="you@example.com" autoComplete="email" />
            <button type="submit">
              Subscribe
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
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
        <div className="sf-mark-row">
          <Link href="/" aria-label="Simbatech home" className="sf-mark-link">
            <img src="/images/logo-mark-white.png" alt="" className="sf-mark" />
          </Link>
          <button type="button" className="sf-top-btn" onClick={scrollTop} aria-label="Back to top">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
        <Wordmark />
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

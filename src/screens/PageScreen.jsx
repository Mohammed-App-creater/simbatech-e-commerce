"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { shopState, storeVals, sendContact } from "@/lib/client/store";

/*
 * /p/[slug] — an information page from the admin (Help centre, Delivery, Returns, About, …).
 * `initial.page` is { slug, title, summary, body (trusted admin HTML), updatedAt }. The contact
 * page also gets the contact form (topic preselected from `initial.topic`) and the store's details.
 */

const TZ = "Africa/Addis_Ababa"; // fixed zone so server and client render the same text
// Eyebrow above the title, by page (the footer's column names).
const GROUPS = {
  "Customer care": ["help", "delivery", "returns", "rental-terms"],
  Company: ["about", "careers", "sell-with-us", "contact"],
  Legal: ["privacy", "terms", "cookies"],
};
const TOPICS = [
  { id: "support", label: "Help with an order or rental" },
  { id: "sell", label: "Selling or listing with Simbatech" },
  { id: "careers", label: "Working at Simbatech" },
  { id: "other", label: "Something else" },
];

function eyebrowFor(slug) {
  const found = Object.keys(GROUPS).find((g) => GROUPS[g].includes(slug));
  return found || "Simbatech";
}
// "6 Oct 2026"
function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}
function intlDigits(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "251" + d.slice(1);
  else if (/^[79]\d{8}$/.test(d)) d = "251" + d;
  return d;
}

const CSS =
  ".page-body{font-size:16px;line-height:1.6;color:#3A3F4A}\n.page-body h2{margin:32px 0 10px;font-family:'Bricolage Grotesque',sans-serif;font-size:24px;line-height:1.1;font-weight:700;letter-spacing:-0.03em;color:#111318}\n.page-body h2:first-child{margin-top:0}\n.page-body h3{margin:24px 0 8px;font-size:17px;font-weight:700;color:#111318}\n.page-body p{margin:0 0 16px}\n.page-body p:last-child{margin-bottom:0}\n.page-body ul,.page-body ol{margin:0 0 16px;padding-left:22px}\n.page-body li{margin:4px 0}\n.page-body a{color:#0D4F8B;font-weight:600;text-decoration:underline;text-underline-offset:3px}\n.page-body strong{color:#111318}\n.page-body img{max-width:100%;height:auto;border-radius:16px}\n.page-body table{border-collapse:collapse;width:100%;margin:0 0 16px}\n.page-body th,.page-body td{padding:10px 12px;border-bottom:1px solid #EFEDE8;text-align:left}\n";

const FIELD = {
  height: "52px",
  boxSizing: "border-box",
  padding: "0 16px",
  border: "1.5px solid #E6E4DE",
  borderRadius: "14px",
  background: "#FFFFFF",
  font: "inherit",
  fontSize: "15px",
  color: "#111318",
};
const LABEL = { fontSize: "14px", fontWeight: "600" };
const ERR = { fontSize: "13px", fontWeight: "600", color: "#C42A1C" };

function ContactForm({ topic }) {
  const [form, setForm] = useState({ topic: TOPICS.some((t) => t.id === topic) ? topic : "support", name: "", contact: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState({ field: "", message: "" });
  const [sent, setSent] = useState(false);
  const field = (name) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [name]: value }));
    setError({ field: "", message: "" });
  };
  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    if (form.name.trim().length < 2) return setError({ field: "name", message: "Enter your name" });
    if (form.contact.trim().length < 3) return setError({ field: "contact", message: "Enter your phone or email" });
    if (form.message.trim().length < 10) return setError({ field: "message", message: "Tell us a little more (at least 10 characters)" });
    setBusy(true);
    setError({ field: "", message: "" });
    try {
      await sendContact({ topic: form.topic, name: form.name.trim(), contact: form.contact.trim(), message: form.message.trim() });
      setSent(true);
      setForm((f) => ({ ...f, message: "" }));
    } catch (err) {
      setError({ field: (err && err.field) || "", message: (err && err.message) || "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }
  const errFor = (name) => (error.field === name ? error.message : "");
  const general = error.message && !["name", "contact", "message", "topic"].includes(error.field) ? error.message : "";
  return (
    <form
      onSubmit={onSubmit}
      aria-labelledby="h-contact"
      style={{
        border: "1px solid #EFEDE8",
        borderRadius: "28px",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        background: "#FFFFFF",
      }}
      data-sec="contact-form"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
          Send a message
        </span>
        <h2
          id="h-contact"
          style={{
            margin: "0",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "26px",
            fontWeight: "700",
            letterSpacing: "-0.035em",
          }}
        >
          How can we help?
        </h2>
      </div>
      {sent ? (
        <p
          role="status"
          style={{
            margin: "0",
            padding: "12px 14px",
            borderRadius: "14px",
            background: "#E4F2E6",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#1F5E33",
          }}
        >
          Thanks, {form.name.trim().split(/\s+/)[0]} — your message is in. We reply the same working day, usually within a few hours.
        </p>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="ct-topic" style={LABEL}>
          Topic
        </label>
        <select id="ct-topic" value={form.topic} onChange={field("topic")} style={FIELD}>
          {TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {errFor("topic") ? (
          <span role="alert" style={ERR}>
            {errFor("topic")}
          </span>
        ) : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }} data-cols="2">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="ct-name" style={LABEL}>
            Your name
          </label>
          <input
            id="ct-name"
            type="text"
            autoComplete="name"
            placeholder="First and last name"
            value={form.name}
            onChange={field("name")}
            style={FIELD}
          />
          {errFor("name") ? (
            <span role="alert" style={ERR}>
              {errFor("name")}
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="ct-contact" style={LABEL}>
            Phone or email
          </label>
          <input
            id="ct-contact"
            type="text"
            autoComplete="tel"
            placeholder="09XX XXX XXX or you@example.com"
            value={form.contact}
            onChange={field("contact")}
            style={FIELD}
          />
          {errFor("contact") ? (
            <span role="alert" style={ERR}>
              {errFor("contact")}
            </span>
          ) : null}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="ct-message" style={LABEL}>
          Message
        </label>
        <textarea
          id="ct-message"
          rows={5}
          placeholder="Tell us what's going on. An order number helps if it's about an order."
          value={form.message}
          onChange={field("message")}
          style={{ ...FIELD, height: "auto", minHeight: "140px", padding: "14px 16px", lineHeight: "1.5", resize: "vertical" }}
        />
        {errFor("message") ? (
          <span role="alert" style={ERR}>
            {errFor("message")}
          </span>
        ) : null}
      </div>
      <button
        type="submit"
        className="btn-y"
        disabled={busy}
        style={{
          height: "54px",
          border: "none",
          borderRadius: "14px",
          background: "#2F7A3C",
          color: "#FFFFFF",
          font: "inherit",
          fontSize: "16px",
          fontWeight: "700",
          cursor: busy ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {busy ? "Sending…" : "Send message"}
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      {general ? (
        <span role="alert" style={{ marginTop: "-6px", fontSize: "13px", fontWeight: "600", color: "#C42A1C", textAlign: "center" }}>
          {general}
        </span>
      ) : null}
    </form>
  );
}

function StoreCard({ store }) {
  const rows = [
    {
      label: "Call us",
      value: store.phone,
      href: "tel:+" + intlDigits(store.phone),
      icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    },
    {
      label: "WhatsApp",
      value: store.whatsapp,
      href: "https://wa.me/" + intlDigits(store.whatsapp),
      external: true,
      icon: (
        <>
          <path d="M4 20l1.3-3.9A8 8 0 1 1 8.4 19L4 20z" />
          <path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-2-1-1 1a4 4 0 0 1-1.5-1.5l1-1-1-2z" />
        </>
      ),
    },
    {
      label: "Email",
      value: store.email,
      href: "mailto:" + store.email,
      icon: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </>
      ),
    },
    {
      label: "Visit the store",
      value: store.address,
      icon: (
        <>
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </>
      ),
    },
    {
      label: "Opening hours",
      value: store.hours,
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
  ].filter((r) => r.value);
  return (
    <aside
      aria-labelledby="h-reach"
      style={{
        border: "1px solid #EFEDE8",
        borderRadius: "28px",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        background: "#F6F5F1",
      }}
      data-sec="store-card"
    >
      <h2
        id="h-reach"
        style={{
          margin: "0",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "22px",
          fontWeight: "700",
          letterSpacing: "-0.03em",
        }}
      >
        Or reach us directly
      </h2>
      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
        {rows.map((r) => (
          <li key={r.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span
              style={{
                width: "40px",
                height: "40px",
                flexShrink: "0",
                borderRadius: "12px",
                background: "#EAF3FA",
                color: "#0D4F8B",
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
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {r.icon}
              </svg>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#5E6470" }}>
                {r.label}
              </span>
              {r.href ? (
                <a
                  href={r.href}
                  target={r.external ? "_blank" : undefined}
                  rel={r.external ? "noopener noreferrer" : undefined}
                  style={{ fontSize: "15px", fontWeight: "600", color: "#0D4F8B", overflowWrap: "anywhere" }}
                >
                  {r.value}
                </a>
              ) : (
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#111318" }}>{r.value}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function PageScreen({ initial }) {
  const page = (initial && initial.page) || { slug: "", title: "", summary: "", body: "", updatedAt: "" };
  const store = storeVals(shopState(initial));
  const isContact = page.slug === "contact";
  const updated = fmtDate(page.updatedAt);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          color: "#111318",
          overflow: "hidden",
        }}
      >
        <SiteHeader initial={initial} />
        <section style={{ padding: "48px var(--gutter) 0" }} data-sec="page-content">
          <article style={{ maxWidth: "860px", display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D4F8B" }}>
                {eyebrowFor(page.slug)}
              </span>
              <h1
                style={{
                  margin: "0",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "44px",
                  lineHeight: "1",
                  fontWeight: "700",
                  letterSpacing: "-0.04em",
                }}
              >
                {page.title}
              </h1>
              {page.summary ? <span style={{ fontSize: "17px", lineHeight: "1.5", color: "#5E6470" }}>{page.summary}</span> : null}
            </div>
            <div className="page-body" dangerouslySetInnerHTML={{ __html: page.body || "" }} />
            {isContact ? (
              <div
                style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: "24px", alignItems: "start" }}
                data-cols="2"
              >
                <ContactForm topic={initial && initial.topic} />
                <StoreCard store={store} />
              </div>
            ) : null}
            {updated ? <span style={{ fontSize: "13px", color: "#5E6470" }}>Last updated {updated}</span> : null}
          </article>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}

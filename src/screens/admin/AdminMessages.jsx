"use client";

import { useState } from "react";
import { api } from "@/lib/client/store";
import { formatPhone } from "@/lib/phone";
import { Empty, MoreNote, PageHead, Pill, Tabs, initials, stamp, useAction } from "@/components/admin/ui";

const TABS = [
  { id: "open", label: "To answer" },
  { id: "handled", label: "Handled" },
  { id: "all", label: "All" },
];
const TOPIC_TONE = { support: "amber", sell: "green", careers: "blue" };

// The customer left a phone number or an email address: link it so staff can answer in one tap.
function contactLink(contact) {
  if (contact.includes("@")) return { href: "mailto:" + contact, text: contact };
  return { href: "tel:" + contact.replace(/[^\d+]/g, ""), text: formatPhone(contact) || contact };
}

function MessageCard({ message: m, action }) {
  const [confirming, setConfirming] = useState(false);
  const key = "message-" + m.id;
  const url = "/api/admin/messages/" + m.id;
  const link = contactLink(m.contact);

  return (
    <article className="adm-item" data-new={m.handled ? undefined : ""}>
      <div className="adm-item-top">
        <span className="adm-avatar">{initials(m.name)}</span>
        <span className="adm-stack">
          <span className="adm-strong">{m.name}</span>
          <small>
            <a href={link.href}>{link.text}</a> · {stamp(m.createdAt)}
          </small>
        </span>
        <Pill tone={TOPIC_TONE[m.topic]}>{m.topicLabel}</Pill>
        {m.handled ? <Pill tone="green">Handled</Pill> : null}
      </div>
      <p className="adm-item-body">{m.message}</p>
      <div className="adm-item-foot">
        <div className="adm-actions">
          <a href={link.href} className="adm-btn" data-kind="primary">
            {m.contact.includes("@") ? "Email back" : "Call back"}
          </a>
          <button type="button" className="adm-btn" data-kind={m.handled ? undefined : "go"} disabled={action.busy} onClick={() => action.run(key, () => api("PATCH", url, { handled: !m.handled }))}>
            {action.busyKey === key ? "Saving…" : m.handled ? "Reopen" : "Mark as handled"}
          </button>
        </div>
        {confirming ? (
          <div className="adm-actions">
            <span className="adm-small">Delete this message for good?</span>
            <button type="button" className="adm-btn" data-kind="danger" disabled={action.busy} onClick={() => action.run(key, () => api("DELETE", url))}>
              Yes, delete
            </button>
            <button type="button" className="adm-btn" data-kind="text" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </div>
        ) : (
          <button type="button" className="adm-btn" data-kind="danger" disabled={action.busy} onClick={() => setConfirming(true)}>
            Delete
          </button>
        )}
      </div>
      {action.errorKey === key ? (
        <span role="alert" className="adm-error">
          {action.error.message}
        </span>
      ) : null}
    </article>
  );
}

/* /admin/messages — what customers sent through the contact form (help, selling with us, careers). */
export default function AdminMessages({ initial: d }) {
  const action = useAction();
  const count = { open: d.counts.open, handled: d.counts.handled, all: d.counts.open + d.counts.handled };

  return (
    <>
      <PageHead eyebrow="Contact form" title="Messages" sub="Help requests, offers to sell or list with Simbatech, and job enquiries. Mark one as handled once you have answered it.">
        <Tabs label="Filter messages" items={TABS.map((t) => ({ href: "/admin/messages" + (t.id === "open" ? "" : "?show=" + t.id), label: t.label, count: count[t.id], on: t.id === d.show }))} />
      </PageHead>
      {d.messages.length ? (
        <div className="adm-list">
          {d.messages.map((m) => (
            <MessageCard key={m.id} message={m} action={action} />
          ))}
          <MoreNote shown={d.messages.length} total={d.total} what="messages" />
        </div>
      ) : (
        <Empty title={d.show === "open" ? "All answered" : "No messages"}>{d.show === "open" ? "New messages from the contact form will show here." : "Nothing here yet."}</Empty>
      )}
    </>
  );
}

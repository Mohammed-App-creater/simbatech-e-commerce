"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/client/store";
import { Pill, REVIEW_STATUS, Stars, Thumb, stamp } from "./ui";

/*
 * One customer review with the approval buttons. `action` is the screen's useAction(): approving,
 * rejecting or deleting re-fetches the page, so the card moves to the right list by itself.
 */
export default function ReviewCard({ review: r, action }) {
  const [confirming, setConfirming] = useState(false);
  const key = "review-" + r.id;
  const working = action.busyKey === key;
  const setStatus = (status) => action.run(key, () => api("PATCH", "/api/admin/reviews/" + r.id, { status }));
  const remove = () => action.run(key, () => api("DELETE", "/api/admin/reviews/" + r.id));
  const st = REVIEW_STATUS[r.status];

  return (
    <article className="adm-item" data-new={r.status === "pending" ? "" : undefined}>
      <div className="adm-item-top">
        <Thumb kind={r.product.kind} bg={r.product.bg} size={56} />
        <span className="adm-stack">
          <Link href={"/product/" + r.product.slug} className="adm-strong adm-clip" target="_blank">
            {r.product.name}
          </Link>
          <small>
            {r.author.name} · {r.author.contact} · {stamp(r.createdAt)}
          </small>
        </span>
        <Stars rating={r.rating} />
        <Pill tone={st.tone}>{st.label}</Pill>
      </div>
      <p className="adm-item-body">
        {r.title ? <strong>{r.title}</strong> : null}
        {r.body}
      </p>
      <div className="adm-item-foot">
        <div className="adm-actions">
          {r.status !== "approved" ? (
            <button type="button" className="adm-btn" data-kind="go" disabled={action.busy} onClick={() => setStatus("approved")}>
              {working ? "Saving…" : "Approve"}
            </button>
          ) : null}
          {r.status === "pending" ? (
            <button type="button" className="adm-btn" disabled={action.busy} onClick={() => setStatus("rejected")}>
              Reject
            </button>
          ) : null}
          {r.status === "approved" ? (
            <button type="button" className="adm-btn" disabled={action.busy} onClick={() => setStatus("rejected")}>
              {working ? "Saving…" : "Take off the site"}
            </button>
          ) : null}
        </div>
        {confirming ? (
          <div className="adm-actions">
            <span className="adm-small">Delete this review for good?</span>
            <button type="button" className="adm-btn" data-kind="danger" disabled={action.busy} onClick={remove}>
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

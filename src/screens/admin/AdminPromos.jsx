"use client";

import { useState } from "react";
import { api } from "@/lib/client/store";
import { Empty, Field, PageHead, Pill, useAction } from "@/components/admin/ui";

const COLS = { "--cols": "minmax(0, 1fr) 140px 170px 100px" };

/* /admin/promos — discount codes customers type in the cart (a percentage off purchases). */
export default function AdminPromos({ initial: d }) {
  const action = useAction();
  const [form, setForm] = useState({ code: "", percentOff: "" });
  const [confirming, setConfirming] = useState(null);
  const addError = action.errorKey === "add" ? action.error : null;
  const on = (name) => (e) => {
    setForm({ ...form, [name]: e.target.value });
    action.clearError();
  };

  async function add(e) {
    e.preventDefault();
    const ok = await action.run("add", () => api("POST", "/api/admin/promos", { code: form.code.trim(), percentOff: form.percentOff === "" ? null : Number(form.percentOff) }));
    if (ok) setForm({ code: "", percentOff: "" });
  }
  const url = (p) => "/api/admin/promos/" + encodeURIComponent(p.code);

  return (
    <>
      <PageHead eyebrow="Discounts" title="Promo codes" sub="A code takes a percentage off the purchases in a cart. Switch a code off to stop it without deleting it." />

      <section className="adm-card" data-pad="">
        <form className="adm-form" onSubmit={add} noValidate>
          <h2 className="adm-h2">New code</h2>
          <div className="adm-fields" data-cols="3">
            <Field label="Code" hint="Letters and digits, e.g. SIMBA10" error={addError && addError.field === "code" ? addError.message : null}>
              <input className="adm-input" type="text" maxLength={30} value={form.code} onChange={on("code")} style={{ textTransform: "uppercase" }} />
            </Field>
            <Field label="Percent off" hint="1 to 90" error={addError && addError.field === "percentOff" ? addError.message : null}>
              <input className="adm-input" type="number" min="1" max="90" inputMode="numeric" value={form.percentOff} onChange={on("percentOff")} />
            </Field>
            <div className="adm-field">
              &nbsp;
              <button type="submit" className="adm-btn" data-kind="go" data-size="lg" style={{ height: "50px" }} disabled={action.busy}>
                {action.busyKey === "add" ? "Adding…" : "Add code"}
              </button>
            </div>
          </div>
          {addError && !addError.field ? (
            <span role="alert" className="adm-error">
              {addError.message}
            </span>
          ) : null}
        </form>
      </section>

      {d.promos.length ? (
        <section className="adm-card">
          <div role="table" aria-label="Promo codes">
            <div role="row" className="adm-row" data-head="" style={COLS}>
              <span role="columnheader">Code</span>
              <span role="columnheader">Discount</span>
              <span role="columnheader">Working</span>
              <span role="columnheader" className="sr-only">
                Action
              </span>
            </div>
            {d.promos.map((p) => {
              const key = "promo-" + p.code;
              return (
                <div role="row" className="adm-row" style={COLS} key={p.code}>
                  <span role="cell" className="adm-stack">
                    <span className="adm-strong">{p.code}</span>
                    {action.errorKey === key ? (
                      <span role="alert" className="adm-error">
                        {action.error.message}
                      </span>
                    ) : null}
                  </span>
                  <span role="cell">{p.percentOff}% off</span>
                  <span role="cell" className="adm-thumbs">
                    <button
                      type="button"
                      role="switch"
                      className="adm-switch"
                      aria-checked={p.active ? "true" : "false"}
                      aria-label={p.code + " is working"}
                      disabled={action.busy}
                      onClick={() => action.run(key, () => api("PATCH", url(p), { active: !p.active }))}
                    >
                      <span />
                    </button>
                    <Pill tone={p.active ? "green" : undefined}>{p.active ? "On" : "Off"}</Pill>
                  </span>
                  <span role="cell" className="adm-cell-end">
                    {confirming === p.code ? (
                      <button type="button" className="adm-btn" data-kind="danger" disabled={action.busy} onClick={() => action.run(key, () => api("DELETE", url(p)))} onBlur={() => setConfirming(null)}>
                        Sure?
                      </button>
                    ) : (
                      <button type="button" className="adm-btn" data-kind="danger" disabled={action.busy} onClick={() => setConfirming(p.code)} aria-label={"Delete " + p.code}>
                        Delete
                      </button>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <Empty title="No promo codes">Add one above and share it with your customers.</Empty>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { api } from "@/lib/client/store";
import { Field, PageHead, useAction } from "@/components/admin/ui";

const NUMBERS = ["sameDayCutoffHour", "pickupReadyHours", "returnDays", "depositRefundDays"];

/* /admin/settings — the store's own details, shown in the header, footer, checkout and help pages. */
export default function AdminSettings({ initial }) {
  const action = useAction();
  const [f, setF] = useState(() => Object.fromEntries(Object.entries(initial.store).map(([k, v]) => [k, String(v)])));
  const [saved, setSaved] = useState(false);
  const failed = action.errorKey === "save" ? action.error : null;
  const err = (name) => (failed && failed.field === name ? failed.message : null);
  const input = (name, extra) => ({
    className: "adm-input",
    value: f[name],
    "aria-invalid": err(name) ? "true" : undefined,
    onChange: (e) => {
      setF({ ...f, [name]: e.target.value });
      setSaved(false);
      action.clearError();
    },
    ...extra,
  });
  const number = (name, extra) => input(name, { type: "number", min: "0", inputMode: "numeric", ...extra });

  async function save(e) {
    e.preventDefault();
    const payload = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, NUMBERS.includes(k) ? (v === "" ? null : Number(v)) : v.trim()]));
    if (await action.run("save", () => api("PATCH", "/api/admin/settings", payload))) setSaved(true);
  }

  return (
    <form className="adm-form" style={{ gap: "40px" }} onSubmit={save} noValidate>
      <PageHead eyebrow="Settings" title="Store details" sub="Shown across the store: header, footer, checkout, product pages and the help pages." />

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Contact</h2>
          <div className="adm-fields">
            <Field label="Store name" error={err("name")}>
              <input {...input("name", { type: "text", maxLength: 60 })} />
            </Field>
            <Field label="City" error={err("city")}>
              <input {...input("city", { type: "text", maxLength: 60 })} />
            </Field>
            <Field label="Address" error={err("address")} wide>
              <input {...input("address", { type: "text", maxLength: 160 })} />
            </Field>
            <Field label="Phone" error={err("phone")}>
              <input {...input("phone", { type: "tel", maxLength: 20 })} />
            </Field>
            <Field label="WhatsApp" error={err("whatsapp")}>
              <input {...input("whatsapp", { type: "tel", maxLength: 20 })} />
            </Field>
            <Field label="Support email" error={err("email")}>
              <input {...input("email", { type: "email" })} />
            </Field>
            <Field label="Opening hours" error={err("hours")}>
              <input {...input("hours", { type: "text", maxLength: 60 })} />
            </Field>
          </div>
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Delivery and returns</h2>
          <div className="adm-fields" data-cols="4">
            <Field label="Same-day cut-off (hour)" hint="24h clock: 16 = 4pm" error={err("sameDayCutoffHour")}>
              <input {...number("sameDayCutoffHour", { max: "23" })} />
            </Field>
            <Field label="Pick-up ready in (hours)" error={err("pickupReadyHours")}>
              <input {...number("pickupReadyHours")} />
            </Field>
            <Field label="Days to return a purchase" error={err("returnDays")}>
              <input {...number("returnDays")} />
            </Field>
            <Field label="Days to refund a deposit" error={err("depositRefundDays")}>
              <input {...number("depositRefundDays")} />
            </Field>
          </div>
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Policies</h2>
          <div className="adm-fields">
            <Field label="Standard warranty" error={err("warranty")} wide>
              <input {...input("warranty", { type: "text", maxLength: 60 })} />
            </Field>
            <Field label="Rental damage policy" error={err("damagePolicy")} wide>
              <textarea {...input("damagePolicy", { rows: 3, maxLength: 200 })} />
            </Field>
            <Field label="Pay-on-delivery terms" error={err("payOnDeliveryTerms")} wide>
              <textarea {...input("payOnDeliveryTerms", { rows: 3, maxLength: 200 })} />
            </Field>
          </div>
        </div>
      </section>

      <div className="adm-formbar">
        <button type="submit" className="adm-btn" data-kind="go" data-size="lg" disabled={action.busy}>
          {action.busyKey === "save" ? "Saving…" : "Save changes"}
        </button>
        {failed ? (
          <span role="alert" className="adm-error">
            {failed.message}
          </span>
        ) : saved ? (
          <span role="status" className="adm-note">
            Saved. The store shows it within a minute.
          </span>
        ) : null}
      </div>
    </form>
  );
}

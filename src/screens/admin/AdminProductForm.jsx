"use client";

import { useState } from "react";
import Link from "next/link";
import { api, navigate } from "@/lib/client/store";
import Render from "@/components/Render";
import { Field, Icon, PageHead, useAction } from "@/components/admin/ui";

// Card backgrounds used across the design.
const SWATCHES = ["#E0F1FF", "#EEE8FF", "#FFEADB", "#DDF5EA", "#F3EEE6", "#FFE4EF", "#FFF4C7", "#D9F3F0"];

const str = (v) => (v === null || v === undefined ? "" : String(v));
const int = (v) => (v === "" ? null : Number(v));

function toForm(p) {
  p = p || {};
  return {
    name: p.name || "",
    sku: p.sku || "",
    description: p.description || "",
    category: p.category || "",
    brand: p.brand || "",
    kind: p.kind || "camera",
    bg: p.bg || SWATCHES[0],
    buyPrice: str(p.buyPrice),
    wasPrice: str(p.wasPrice),
    rentRate: str(p.rentRate),
    rentOnly: !!p.rentOnly,
    deposit: str(p.deposit || ""),
    stock: str(p.stock === undefined ? "" : p.stock),
    soldPercent: str(p.soldPercent || ""),
    freeDelivery: !!p.freeDelivery,
    shipsInDays: str(p.shipsInDays),
    warranty: p.warranty || "",
    inTheBox: (p.inTheBox || []).join("\n"),
    specs: (p.specs || []).map(([name, value]) => ({ name, value })),
    plans: (p.plans || []).map((x) => ({ days: str(x.days), price: str(x.price) })),
    addOns: (p.addOns || []).map((x) => ({ key: x.key, label: x.label, note: x.note || "", perDay: str(x.perDay) })),
    variants: (p.variants || []).map((x) => ({ key: x.key, label: x.label, extra: str(x.extra) })),
  };
}

// What the API expects (see ProductSerializer in simbatech-api/backoffice). Rows left empty are dropped.
function toPayload(f) {
  const filled = (row, keys) => keys.some((k) => String(row[k] || "").trim() !== "");
  return {
    name: f.name.trim(),
    sku: f.sku.trim(),
    description: f.description.trim(),
    category: f.category,
    brand: f.brand,
    kind: f.kind,
    bg: f.bg.trim(),
    buyPrice: int(f.buyPrice),
    wasPrice: int(f.wasPrice),
    rentRate: int(f.rentRate),
    rentOnly: f.rentOnly,
    deposit: int(f.deposit) || 0,
    stock: int(f.stock) || 0,
    soldPercent: int(f.soldPercent) || 0,
    freeDelivery: f.freeDelivery,
    shipsInDays: int(f.shipsInDays),
    warranty: f.warranty.trim(),
    inTheBox: f.inTheBox
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    specs: f.specs.filter((r) => filled(r, ["name", "value"])).map((r) => [r.name.trim(), r.value.trim()]),
    plans: f.plans.filter((r) => filled(r, ["days", "price"])).map((r) => ({ days: int(r.days), price: int(r.price) })),
    addOns: f.addOns
      .filter((r) => filled(r, ["label", "perDay"]))
      .map((r) => ({ ...(r.key ? { key: r.key } : {}), label: r.label.trim(), note: r.note.trim(), perDay: int(r.perDay) })),
    variants: f.variants
      .filter((r) => filled(r, ["label"]))
      .map((r) => ({ ...(r.key ? { key: r.key } : {}), label: r.label.trim(), extra: int(r.extra) || 0 })),
  };
}

// Problems the form can name more clearly than the API would.
function localError(payload) {
  if (payload.specs.some(([name, value]) => !name || !value)) return { field: "specs", message: "Give each spec both a name and a value" };
  if (payload.plans.some((p) => !p.days || p.price === null)) return { field: "plans", message: "Give each rental plan its days and its price" };
  if (payload.addOns.some((a) => !a.label || a.perDay === null)) return { field: "addOns", message: "Give each add-on a name and a price per day" };
  return null;
}

/* A small table of inputs with "add" and "remove", for rental plans, add-ons, options and specs. */
function Rows({ label, cols, columns, rows, blank, addLabel, onChange, error }) {
  const setCell = (i, name, value) => onChange(rows.map((r, j) => (j === i ? { ...r, [name]: value } : r)));
  return (
    <div className="adm-field" data-wide="">
      {label}
      <div className="adm-rows" style={{ "--cols": cols + " 44px" }}>
        {rows.length ? (
          <div data-head="">
            {columns.map((c) => (
              <span key={c.name}>{c.title}</span>
            ))}
            <span />
          </div>
        ) : null}
        {rows.map((row, i) => (
          <div key={i}>
            {columns.map((c) => (
              <input
                key={c.name}
                className="adm-input"
                data-small=""
                type={c.number ? "number" : "text"}
                min={c.number ? "0" : undefined}
                inputMode={c.number ? "numeric" : undefined}
                placeholder={c.placeholder}
                aria-label={c.title + ", row " + (i + 1)}
                value={row[c.name]}
                onChange={(e) => setCell(i, c.name, e.target.value)}
              />
            ))}
            <button type="button" className="adm-btn" data-kind="danger" style={{ padding: 0, width: "44px" }} aria-label={"Remove row " + (i + 1)} onClick={() => onChange(rows.filter((_, j) => j !== i))}>
              <Icon d="M6 6l12 12M18 6L6 18" size={16} width={2} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="adm-btn" data-kind="text" style={{ alignSelf: "flex-start" }} onClick={() => onChange([...rows, { ...blank }])}>
        <Icon d="M12 5v14M5 12h14" size={16} width={2.2} />
        {addLabel}
      </button>
      {error ? (
        <span role="alert" className="adm-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/* /admin/products/new and /admin/products/[slug] — everything about one product. */
export default function AdminProductForm({ initial }) {
  const editing = initial.product;
  const { categories, brands, kinds } = initial.options;
  const action = useAction();
  const [f, setF] = useState(() => toForm(editing));
  const [problem, setProblem] = useState(null); // { field, message } found before sending
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function set(name, value) {
    setF((cur) => ({ ...cur, [name]: value }));
    setProblem(null);
    setSaved(false);
    action.clearError();
  }
  const on = (name) => (e) => set(name, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  // the error for one field: found here, or sent back by the API ("plans.0.price" belongs to "plans")
  const failed = problem || (action.errorKey === "save" ? action.error : null);
  const err = (name) => (failed && failed.field && failed.field.split(".")[0] === name ? failed.message : null);
  const input = (name, extra) => ({ className: "adm-input", value: f[name], onChange: on(name), "aria-invalid": err(name) ? "true" : undefined, ...extra });
  const number = (name, extra) => input(name, { type: "number", min: "0", inputMode: "numeric", ...extra });

  async function save(e) {
    e.preventDefault();
    const payload = toPayload(f);
    const found = localError(payload);
    if (found) return setProblem(found);
    const out = await action.run("save", () => (editing ? api("PATCH", "/api/admin/products/" + editing.slug, payload) : api("POST", "/api/admin/products", payload)), { refresh: !!editing });
    if (!out) return;
    if (editing) setSaved(true);
    else navigate("/admin/products");
  }

  async function remove() {
    const ok = await action.run("delete", () => api("DELETE", "/api/admin/products/" + editing.slug), { refresh: false });
    if (ok) navigate("/admin/products");
  }

  return (
    <form className="adm-form" style={{ gap: "40px" }} onSubmit={save} noValidate>
      <PageHead
        eyebrow={<Link href="/admin/products">← Products</Link>}
        title={editing ? editing.name : "New product"}
        sub={editing ? "Changes show on the store within a minute of saving." : "Fill in the basics; you can come back to add rental plans and details."}
      >
        {editing ? (
          <Link href={"/product/" + editing.slug} target="_blank" className="adm-btn">
            View on the store
          </Link>
        ) : null}
      </PageHead>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Basics</h2>
          <div className="adm-fields">
            <Field label="Name" error={err("name")}>
              <input {...input("name", { type: "text", maxLength: 120 })} />
            </Field>
            <Field label="SKU (optional)" error={err("sku")}>
              <input {...input("sku", { type: "text", maxLength: 40 })} />
            </Field>
            <Field label="Category" error={err("category")}>
              <select {...input("category")}>
                <option value="">Choose…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Brand" error={err("brand")}>
              <select {...input("brand")}>
                <option value="">Choose…</option>
                {brands.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description" error={err("description")} wide>
              <textarea {...input("description", { rows: 4, maxLength: 4000 })} />
            </Field>
          </div>
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Picture</h2>
          <div className="adm-field">
            The store draws one of these for the product
            <div className="adm-kinds">
              {kinds.map((k) => (
                <button key={k} type="button" aria-pressed={f.kind === k ? "true" : "false"} aria-label={k} title={k} style={{ background: f.bg }} onClick={() => set("kind", k)}>
                  <span style={{ display: "block", zoom: "0.42", width: "200px", height: "200px" }}>
                    <Render kind={k} />
                  </span>
                </button>
              ))}
            </div>
            {err("kind") ? (
              <span role="alert" className="adm-error">
                {err("kind")}
              </span>
            ) : null}
          </div>
          <div className="adm-field">
            Background colour
            <div className="adm-swatches">
              {SWATCHES.map((c) => (
                <button key={c} type="button" aria-pressed={f.bg.toUpperCase() === c ? "true" : "false"} aria-label={"Colour " + c} style={{ background: c }} onClick={() => set("bg", c)} />
              ))}
              <input {...input("bg", { type: "text", maxLength: 7, "data-small": "", style: { width: "120px" }, "aria-label": "Colour code" })} />
            </div>
            {err("bg") ? (
              <span role="alert" className="adm-error">
                {err("bg")}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Prices</h2>
          <div className="adm-fields" data-cols="4">
            <Field label="Price to buy (ETB)" error={err("buyPrice")}>
              <input {...number("buyPrice")} />
            </Field>
            <Field label="Old price (ETB)" hint="Only when on sale" error={err("wasPrice")}>
              <input {...number("wasPrice")} />
            </Field>
            <Field label="Rent per day (ETB)" hint="Empty = not for rent" error={err("rentRate")}>
              <input {...number("rentRate")} />
            </Field>
            <Field label="Rental deposit (ETB)" hint="Refunded on return" error={err("deposit")}>
              <input {...number("deposit")} />
            </Field>
          </div>
          <label className="adm-check">
            <input type="checkbox" checked={f.rentOnly} onChange={on("rentOnly")} />
            Rent only — this product can&apos;t be bought
          </label>
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Stock and delivery</h2>
          <div className="adm-fields" data-cols="4">
            <Field label="In stock" error={err("stock")}>
              <input {...number("stock")} />
            </Field>
            <Field label="Ships in (days)" hint="If sold while out of stock" error={err("shipsInDays")}>
              <input {...number("shipsInDays")} />
            </Field>
            <Field label="Sold so far (%)" hint="Flash-deal progress bar" error={err("soldPercent")}>
              <input {...number("soldPercent", { max: "100" })} />
            </Field>
            <Field label="Warranty" hint='e.g. "12-month"' error={err("warranty")}>
              <input {...input("warranty", { type: "text", maxLength: 60 })} />
            </Field>
          </div>
          <label className="adm-check">
            <input type="checkbox" checked={f.freeDelivery} onChange={on("freeDelivery")} />
            Free delivery on this product
          </label>
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Renting</h2>
          <Rows
            label="Rental plans — a set number of days at a set price"
            cols="minmax(0, 1fr) minmax(0, 1fr)"
            columns={[
              { name: "days", title: "Days", number: true, placeholder: "3" },
              { name: "price", title: "Price (ETB)", number: true, placeholder: "6900" },
            ]}
            rows={f.plans}
            blank={{ days: "", price: "" }}
            addLabel="Add a plan"
            onChange={(rows) => set("plans", rows)}
            error={err("plans")}
          />
          <Rows
            label="Add-ons the customer can rent with it"
            cols="minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 0.7fr)"
            columns={[
              { name: "label", title: "Name", placeholder: "Extra battery" },
              { name: "note", title: "Note", placeholder: "Optional" },
              { name: "perDay", title: "Per day (ETB)", number: true, placeholder: "150" },
            ]}
            rows={f.addOns}
            blank={{ label: "", note: "", perDay: "" }}
            addLabel="Add an add-on"
            onChange={(rows) => set("addOns", rows)}
            error={err("addOns")}
          />
        </div>
      </section>

      <section className="adm-card" data-pad="">
        <div className="adm-form">
          <h2 className="adm-h2">Details</h2>
          <Rows
            label="Options that change the price to buy"
            cols="minmax(0, 1.4fr) minmax(0, 1fr)"
            columns={[
              { name: "label", title: "Option", placeholder: "With kit lens" },
              { name: "extra", title: "Extra (ETB)", number: true, placeholder: "0" },
            ]}
            rows={f.variants}
            blank={{ label: "", extra: "" }}
            addLabel="Add an option"
            onChange={(rows) => set("variants", rows)}
            error={err("variants")}
          />
          <Rows
            label="Specifications"
            cols="minmax(0, 1fr) minmax(0, 1.4fr)"
            columns={[
              { name: "name", title: "Spec", placeholder: "Sensor" },
              { name: "value", title: "Value", placeholder: "24 MP full-frame" },
            ]}
            rows={f.specs}
            blank={{ name: "", value: "" }}
            addLabel="Add a spec"
            onChange={(rows) => set("specs", rows)}
            error={err("specs")}
          />
          <Field label="In the box" hint="One item per line" error={err("inTheBox")} wide>
            <textarea {...input("inTheBox", { rows: 4 })} />
          </Field>
        </div>
      </section>

      <div className="adm-formbar">
        <button type="submit" className="adm-btn" data-kind="go" data-size="lg" disabled={action.busy}>
          {action.busyKey === "save" ? "Saving…" : editing ? "Save changes" : "Add product"}
        </button>
        <Link href="/admin/products" className="adm-btn" data-kind="text" data-size="lg">
          Cancel
        </Link>
        {failed ? (
          <span role="alert" className="adm-error">
            {failed.message}
          </span>
        ) : saved ? (
          <span role="status" className="adm-note">
            Saved. The store shows it within a minute.
          </span>
        ) : null}
        <span style={{ flexGrow: 1 }} />
        {editing && !confirming ? (
          <button type="button" className="adm-btn" data-kind="danger" data-size="lg" disabled={action.busy} onClick={() => setConfirming(true)}>
            Delete product
          </button>
        ) : null}
        {editing && confirming ? (
          <>
            <span className="adm-small">Delete {editing.name} for good?</span>
            <button type="button" className="adm-btn" data-kind="danger" data-size="lg" disabled={action.busy} onClick={remove}>
              {action.busyKey === "delete" ? "Deleting…" : "Yes, delete"}
            </button>
            <button type="button" className="adm-btn" data-kind="text" data-size="lg" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </>
        ) : null}
        {action.errorKey === "delete" ? (
          <span role="alert" className="adm-error" style={{ flexBasis: "100%", textAlign: "right" }}>
            {action.error.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}

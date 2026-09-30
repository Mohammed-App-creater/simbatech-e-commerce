"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/client/store";
import { Empty, Icon, PageHead, Pill, Thumb, money, useAction } from "@/components/admin/ui";

const COLS = { "--cols": "minmax(0, 1.5fr) 130px 110px 170px 70px 70px" };

// The stock count, editable in place: type the new number and save.
function StockCell({ product: p, action }) {
  const [value, setValue] = useState(String(p.stock));
  const key = "stock-" + p.slug;
  const dirty = value !== "" && Number(value) !== p.stock;

  function save(e) {
    e.preventDefault();
    if (!dirty) return;
    action.run(key, () => api("PATCH", "/api/admin/products/" + p.slug, { stock: Number(value) }));
  }

  return (
    <form onSubmit={save} className="adm-stack">
      <span className="adm-thumbs">
        <input
          className="adm-input"
          data-small=""
          style={{ width: "84px" }}
          type="number"
          min="0"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={"Stock of " + p.name}
        />
        {dirty ? (
          <button type="submit" className="adm-btn" data-kind="go" disabled={action.busy}>
            {action.busyKey === key ? "…" : "Save"}
          </button>
        ) : p.stock === 0 ? (
          <Pill tone="red">Out</Pill>
        ) : p.stock <= 3 ? (
          <Pill tone="amber">Low</Pill>
        ) : null}
      </span>
      {action.errorKey === key ? (
        <span role="alert" className="adm-error">
          {action.error.message}
        </span>
      ) : null}
    </form>
  );
}

/* /admin/products — the catalog: prices and stock at a glance, stock editable in place. */
export default function AdminProducts({ initial: d }) {
  const action = useAction();
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const products = needle
    ? d.products.filter((p) => [p.name, p.categoryName, p.brandName, p.sku].some((s) => (s || "").toLowerCase().includes(needle)))
    : d.products;

  return (
    <>
      <PageHead eyebrow="Catalog" title="Products" sub="What the store sells and rents. Change a stock count here, or open a product to edit everything else.">
        <Link href="/admin/products/new" className="adm-btn" data-kind="primary" data-size="lg">
          <Icon d="M12 5v14M5 12h14" size={16} width={2.2} />
          Add a product
        </Link>
      </PageHead>
      <div className="adm-toolbar">
        <div className="adm-search" role="search">
          <Icon d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M20 20l-3.5-3.5"]} size={18} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, category, brand or SKU" aria-label="Search products" />
        </div>
        <span className="adm-muted">
          {products.length} of {d.products.length} products
        </span>
      </div>
      {products.length ? (
        <section className="adm-card">
          <div role="table" aria-label="Products">
            <div role="row" className="adm-row" data-head="" style={COLS}>
              <span role="columnheader">Product</span>
              <span role="columnheader">Price</span>
              <span role="columnheader">Rent / day</span>
              <span role="columnheader">In stock</span>
              <span role="columnheader">Rating</span>
              <span role="columnheader" className="sr-only">
                Action
              </span>
            </div>
            {products.map((p) => (
              <div role="row" className="adm-row" style={COLS} key={p.slug}>
                <span role="cell" className="adm-thumbs">
                  <Thumb kind={p.kind} bg={p.bg} size={56} />
                  <span className="adm-stack">
                    <Link href={"/admin/products/" + p.slug} className="adm-strong adm-clip">
                      {p.name}
                    </Link>
                    <small className="adm-clip">
                      {p.categoryName} · {p.brandName}
                    </small>
                  </span>
                </span>
                <span role="cell" className="adm-stack">
                  <span className="adm-strong">{p.rentOnly ? "Rent only" : money(p.buyPrice)}</span>
                  {p.wasPrice && !p.rentOnly ? (
                    <small>
                      <s>{money(p.wasPrice)}</s>
                    </small>
                  ) : null}
                </span>
                <span role="cell">{p.rentRate ? money(p.rentRate) : <span className="adm-muted">—</span>}</span>
                <span role="cell">
                  <StockCell product={p} action={action} />
                </span>
                <span role="cell" className="adm-muted">
                  ★ {p.rating} ({p.reviews})
                </span>
                <span role="cell" className="adm-cell-end">
                  <Link href={"/admin/products/" + p.slug} className="adm-btn" aria-label={"Edit " + p.name}>
                    Edit
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <Empty title="No product matches">Try a shorter search.</Empty>
      )}
    </>
  );
}

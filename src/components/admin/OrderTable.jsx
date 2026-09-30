"use client";

import Link from "next/link";
import { formatPhone } from "@/lib/phone";
import { ORDER_STATUS, Pill, Thumb, money, payLabel, plural, stamp } from "./ui";

const COLS = { "--cols": "130px minmax(0, 1.1fr) minmax(0, 1fr) 150px 160px 76px" };

/* The orders table of the overview and the Orders page (rows from the API's order_row). */
export default function OrderTable({ orders, label }) {
  return (
    <div role="table" aria-label={label}>
      <div role="row" className="adm-row" data-head="" style={COLS}>
        <span role="columnheader">Order</span>
        <span role="columnheader">Customer</span>
        <span role="columnheader">Items</span>
        <span role="columnheader">Total</span>
        <span role="columnheader">Status</span>
        <span role="columnheader" className="sr-only">
          Action
        </span>
      </div>
      {orders.map((o) => {
        const href = "/admin/orders/" + o.id;
        const st = ORDER_STATUS[o.status];
        return (
          <div role="row" className="adm-row" style={COLS} key={o.id}>
            <span role="cell" className="adm-stack">
              <Link href={href} className="adm-strong">
                {o.number}
              </Link>
              <small>{stamp(o.createdAt)}</small>
            </span>
            <span role="cell" className="adm-stack">
              <span className="adm-clip">{o.customer}</span>
              <small>{formatPhone(o.phone)}</small>
            </span>
            <span role="cell" className="adm-thumbs">
              {o.thumbs.map((t, i) => (
                <Thumb key={i} kind={t.kind} bg={t.bg} title={t.name} />
              ))}
              <span className="adm-small">
                {plural(o.itemCount, "item")}
                {o.hasRental ? " · rental" : ""}
              </span>
            </span>
            <span role="cell" className="adm-stack">
              <span className="adm-strong">{money(o.total)}</span>
              <small>{payLabel(o.payment)}</small>
            </span>
            <span role="cell">
              <Pill tone={st.tone}>{st.label}</Pill>
            </span>
            <span role="cell" className="adm-cell-end">
              <Link href={href} className="adm-btn" aria-label={"Open order " + o.number}>
                Open
              </Link>
            </span>
          </div>
        );
      })}
    </div>
  );
}

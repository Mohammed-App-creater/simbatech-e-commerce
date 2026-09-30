"use client";

import { navigate } from "@/lib/client/store";
import { formatPhone } from "@/lib/phone";
import { Empty, Icon, MoreNote, PageHead, Pill, dLong, initials, money } from "@/components/admin/ui";

const COLS = { "--cols": "minmax(0, 1.3fr) minmax(0, 1.2fr) 120px 80px 130px 120px" };

/* /admin/customers — every account, with what it has ordered. */
export default function AdminCustomers({ initial: d }) {
  function search(e) {
    e.preventDefault();
    const q = e.currentTarget.elements.namedItem("q").value.trim();
    navigate("/admin/customers" + (q ? "?q=" + encodeURIComponent(q) : ""));
  }

  return (
    <>
      <PageHead eyebrow="Accounts" title="Customers" sub="Everyone with an account, newest first. Orders and spending leave out cancelled orders." />
      <div className="adm-toolbar">
        <form className="adm-search" role="search" onSubmit={search} key={d.q}>
          <Icon d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M20 20l-3.5-3.5"]} size={18} />
          <input type="search" name="q" defaultValue={d.q} placeholder="Name, email or phone" aria-label="Search customers" />
          <button type="submit">Search</button>
        </form>
        <span className="adm-muted">
          {d.total} {d.total === 1 ? "account" : "accounts"}
        </span>
      </div>
      {d.customers.length ? (
        <section className="adm-card">
          <div role="table" aria-label="Customers">
            <div role="row" className="adm-row" data-head="" style={COLS}>
              <span role="columnheader">Customer</span>
              <span role="columnheader">Contact</span>
              <span role="columnheader">Joined</span>
              <span role="columnheader">Orders</span>
              <span role="columnheader">Spent</span>
              <span role="columnheader">Last order</span>
            </div>
            {d.customers.map((c) => (
              <div role="row" className="adm-row" style={COLS} key={c.id}>
                <span role="cell" className="adm-thumbs">
                  <span className="adm-avatar">{initials(c.name)}</span>
                  <span className="adm-stack">
                    <span className="adm-strong adm-clip">{c.name}</span>
                    {c.isStaff ? <Pill tone="blue">Staff</Pill> : null}
                    {c.isActive ? null : <Pill tone="red">Blocked</Pill>}
                  </span>
                </span>
                <span role="cell" className="adm-stack">
                  {c.email ? (
                    <a href={"mailto:" + c.email} className="adm-clip">
                      {c.email}
                    </a>
                  ) : null}
                  {c.phone ? <a href={"tel:" + c.phone}>{formatPhone(c.phone)}</a> : null}
                </span>
                <span role="cell" className="adm-muted">
                  {dLong(c.createdAt)}
                </span>
                <span role="cell" className="adm-strong">
                  {c.orders}
                </span>
                <span role="cell" className="adm-strong">
                  {money(c.spent)}
                </span>
                <span role="cell" className="adm-muted">
                  {c.lastOrderAt ? dLong(c.lastOrderAt) : "—"}
                </span>
              </div>
            ))}
          </div>
          <MoreNote shown={d.customers.length} total={d.total} what="accounts" />
        </section>
      ) : (
        <Empty title="No one matches">Try part of the name, the email or the phone number.</Empty>
      )}
    </>
  );
}

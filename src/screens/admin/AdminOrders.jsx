"use client";

import { navigate } from "@/lib/client/store";
import OrderTable from "@/components/admin/OrderTable";
import { Empty, Icon, MoreNote, PageHead, Tabs } from "@/components/admin/ui";

const TABS = [
  { id: "", label: "All", count: "all" },
  { id: "PLACED", label: "To pack", count: "PLACED" },
  { id: "PACKED", label: "Packed", count: "PACKED" },
  { id: "OUT_FOR_DELIVERY", label: "Out for delivery", count: "OUT_FOR_DELIVERY" },
  { id: "DELIVERED", label: "Delivered", count: "DELIVERED" },
  { id: "CANCELLED", label: "Cancelled", count: "CANCELLED" },
];

function href(status, q) {
  const p = new URLSearchParams();
  if (status) p.set("status", status);
  if (q) p.set("q", q);
  const s = p.toString();
  return "/admin/orders" + (s ? "?" + s : "");
}

/* /admin/orders — every order, filtered by status (tabs) and searched by number, name, phone or email. */
export default function AdminOrders({ initial: d }) {
  function search(e) {
    e.preventDefault();
    navigate(href(d.status, e.currentTarget.elements.namedItem("q").value.trim()));
  }

  return (
    <>
      <PageHead eyebrow="Sales" title="Orders" sub="Open an order to pack it, send it out, mark it delivered or record its payment." />
      <div className="adm-toolbar">
        <Tabs label="Filter orders" items={TABS.map((t) => ({ href: href(t.id, d.q), label: t.label, count: d.counts[t.count], on: t.id === d.status }))} />
        <form className="adm-search" role="search" onSubmit={search} key={d.q}>
          <Icon d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M20 20l-3.5-3.5"]} size={18} />
          <input type="search" name="q" defaultValue={d.q} placeholder="Order number, name or phone" aria-label="Search orders" />
          <button type="submit">Search</button>
        </form>
      </div>
      {d.orders.length ? (
        <section className="adm-card">
          <OrderTable orders={d.orders} label="Orders" />
          <MoreNote shown={d.orders.length} total={d.total} what="orders" />
        </section>
      ) : (
        <Empty title={d.q ? "Nothing matches that search" : "No orders here"}>
          {d.q ? "Check the order number or try the customer's phone." : "Orders with this status will show up here."}
        </Empty>
      )}
    </>
  );
}

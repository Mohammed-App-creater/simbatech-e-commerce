"use client";

import Link from "next/link";
import OrderTable from "@/components/admin/OrderTable";
import ReviewCard from "@/components/admin/ReviewCard";
import { ARROW, Empty, Icon, PageHead, Thumb, dayLabel, money, plural, useAction } from "@/components/admin/ui";

function Tile({ href, tone, label, icon, value, note, small }) {
  return (
    <Link href={href} className="adm-tile" data-tone={tone}>
      <span className="adm-tile-top">
        {label}
        <i>
          <Icon d={icon} size={18} />
        </i>
      </span>
      <span>
        <span className="adm-tile-num" data-small={small ? "" : undefined}>
          {value}
        </span>
        <span className="adm-tile-note">{note}</span>
      </span>
    </Link>
  );
}

/* /admin — what needs doing today: orders to pack, reviews to approve, messages, stock running out. */
export default function AdminOverview({ initial: d }) {
  const action = useAction();
  const first = d.user.name.split(" ")[0];

  return (
    <>
      <PageHead eyebrow={dayLabel(d.today)} title={"Hello, " + first + "."} accent="Here's the store today.">
        <Link href="/admin/orders" className="adm-btn" data-kind="primary" data-size="lg">
          All orders
          <Icon d={ARROW} size={16} width={2} />
        </Link>
      </PageHead>

      <div className="adm-tiles">
        <Tile
          href="/admin/orders?status=PLACED"
          tone="amber"
          label="Orders to pack"
          icon={["M21 8l-9-5-9 5 9 5 9-5z", "M3 8v8l9 5 9-5V8", "M12 13v8"]}
          value={d.toPack}
          note={d.toSend + " packed, waiting to go out"}
        />
        <Tile
          href="/admin/orders?status=OUT_FOR_DELIVERY"
          tone="blue"
          label="Out for delivery"
          icon={["M3 7h11v9H3z", "M14 10h4l3 3v3h-7z", "M7 19.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z", "M17 19.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z"]}
          value={d.onTheWay}
          note={plural(d.ordersToday, "new order") + " today"}
        />
        <Tile
          href="/admin/reviews"
          tone="green"
          label="Reviews to approve"
          icon="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z"
          value={d.counts.pendingReviews}
          note="Shown on the store once approved"
        />
        <Tile href="/admin/messages" label="Messages to answer" icon="M4 5h16v12H9l-5 4z" value={d.counts.openMessages} note="From the contact form" />
        <Tile
          href="/admin/orders"
          label="Sales today"
          icon={["M4 19h16", "M7 16v-5", "M12 16V6", "M17 16v-8"]}
          value={money(d.salesToday)}
          small
          note={plural(d.ordersToday, "order")}
        />
        <Tile
          href="/admin/orders"
          label="Sales, last 7 days"
          icon={["M4 19h16", "M7 16v-5", "M12 16V6", "M17 16v-8"]}
          value={money(d.salesWeek)}
          small
          note={plural(d.ordersWeek, "order")}
        />
        <Tile
          href="/admin/orders"
          tone={d.rentalsDue ? "amber" : undefined}
          label="Rentals with customers"
          icon={["M3 5h18v16H3z", "M3 10h18", "M8 3v4", "M16 3v4"]}
          value={d.activeRentals}
          note={d.rentalsDue ? d.rentalsDue + " due back today or late" : "None due back today"}
        />
        <Tile
          href="/admin/products"
          tone={d.lowStockCount ? "red" : undefined}
          label="Running low"
          icon={["M4 7h16v13H4z", "M8 7V5a4 4 0 0 1 8 0v2"]}
          value={d.lowStockCount}
          note="Products with 3 or fewer left"
        />
      </div>

      {d.pendingReviews.length ? (
        <section className="adm-list" aria-label="Reviews waiting for approval">
          <div className="adm-card-head" style={{ padding: 0 }}>
            <h2 className="adm-h2">Reviews waiting for approval</h2>
            <Link href="/admin/reviews" className="adm-more">
              All reviews
              <Icon d={ARROW} size={16} width={2} />
            </Link>
          </div>
          {d.pendingReviews.map((r) => (
            <ReviewCard key={r.id} review={r} action={action} />
          ))}
        </section>
      ) : null}

      <section className="adm-card">
        <div className="adm-card-head">
          <h2 className="adm-h2">Latest orders</h2>
          <Link href="/admin/orders" className="adm-more">
            All orders
            <Icon d={ARROW} size={16} width={2} />
          </Link>
        </div>
        {d.recentOrders.length ? (
          <OrderTable orders={d.recentOrders} label="Latest orders" />
        ) : (
          <div style={{ padding: "0 28px 28px" }}>
            <Empty title="No orders yet">New orders show here the moment they are placed.</Empty>
          </div>
        )}
      </section>

      {d.lowStock.length ? (
        <section className="adm-card">
          <div className="adm-card-head">
            <h2 className="adm-h2">Running low</h2>
            <Link href="/admin/products" className="adm-more">
              All products
              <Icon d={ARROW} size={16} width={2} />
            </Link>
          </div>
          {d.lowStock.map((p) => (
            <div className="adm-row" style={{ "--cols": "minmax(0, 1fr) 140px 120px" }} key={p.slug}>
              <span className="adm-thumbs">
                <Thumb kind={p.kind} bg={p.bg} />
                <span className="adm-strong adm-clip">{p.name}</span>
              </span>
              <span className={p.stock ? "adm-muted" : "adm-error"}>{p.stock ? p.stock + " left" : "Out of stock"}</span>
              <span className="adm-cell-end">
                <Link href={"/admin/products/" + p.slug} className="adm-btn">
                  Restock
                </Link>
              </span>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}

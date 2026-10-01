"use client";

import Link from "next/link";
import OrderTable from "@/components/admin/OrderTable";
import ReviewCard from "@/components/admin/ReviewCard";
import { BarList, Change, ColumnChart, RENTED, SOLD, salesRows } from "@/components/admin/charts";
import { ARROW, Empty, Icon, ORDER_STATUS, PageHead, Thumb, dayLabel, money, plural, useAction } from "@/components/admin/ui";

const ICONS = {
  box: ["M21 8l-9-5-9 5 9 5 9-5z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  truck: ["M3 7h11v9H3z", "M14 10h4l3 3v3h-7z", "M7 19.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z", "M17 19.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z"],
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z",
  chat: "M4 5h16v12H9l-5 4z",
  calendar: ["M3 5h18v16H3z", "M3 10h18", "M8 3v4", "M16 3v4"],
};
const PIPELINE = ["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

function Tile({ href, tone, label, icon, value, note }) {
  return (
    <Link href={href} className="adm-tile" data-tone={tone}>
      <span className="adm-tile-top">
        {label}
        <i>
          <Icon d={icon} size={18} />
        </i>
      </span>
      <span>
        <span className="adm-tile-num">{value}</span>
        <span className="adm-tile-note">{note}</span>
      </span>
    </Link>
  );
}

function CardHead({ title, href, more }) {
  return (
    <div className="adm-card-head">
      <h2 className="adm-h2">{title}</h2>
      {href ? (
        <Link href={href} className="adm-more">
          {more}
          <Icon d={ARROW} size={16} width={2} />
        </Link>
      ) : null}
    </div>
  );
}

/* /admin — the dashboard: what needs doing now, how sales are going, and what's selling. */
export default function AdminOverview({ initial: d }) {
  const action = useAction();
  const first = d.user.name.split(" ")[0];
  const days = d.daily;
  const week = days.slice(-7).reduce((s, x) => s + x.sales, 0);
  const prevWeek = days.slice(0, 7).reduce((s, x) => s + x.sales, 0);
  const busiest = d.byWeekday.map((w) => ({ id: w.day, axis: w.day, title: w.day + " (last 30 days)", values: { n: w.orders } }));
  const pipeTotal = PIPELINE.reduce((s, k) => s + d.pipeline[k], 0);
  const split = d.month.purchases + d.month.rentals;
  const topUnits = Math.max(1, ...d.topProducts.map((p) => p.units));

  return (
    <>
      <PageHead eyebrow={dayLabel(d.today)} title={"Hello, " + first + "."} accent="Here's the store today.">
        <Link href="/admin/orders?status=PLACED" className="adm-btn" data-kind="primary" data-size="lg">
          Orders to pack
          <Icon d={ARROW} size={16} width={2} />
        </Link>
      </PageHead>

      <div className="adm-tiles">
        <Tile href="/admin/orders?status=PLACED" tone="amber" label="Orders to pack" icon={ICONS.box} value={d.toPack} note={d.toSend + " packed, waiting to go out"} />
        <Tile href="/admin/orders?status=OUT_FOR_DELIVERY" tone="blue" label="Out for delivery" icon={ICONS.truck} value={d.onTheWay} note={plural(d.ordersToday, "new order") + " today"} />
        <Tile href="/admin/reviews" tone="green" label="Reviews to approve" icon={ICONS.star} value={d.counts.pendingReviews} note="Shown on the store once approved" />
        <Tile href="/admin/messages" label="Messages to answer" icon={ICONS.chat} value={d.counts.openMessages} note="From the contact form" />
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <div className="adm-stack" style={{ gap: "6px" }}>
            <h2 className="adm-h2">Sales</h2>
            <span className="adm-small">
              Last 14 days, cancelled orders left out ·{" "}
              <Link href="/admin/reports" className="adm-link">
                Full reports
              </Link>
            </span>
          </div>
          <dl className="adm-kpis">
            <div>
              <dt>Today</dt>
              <dd>{money(d.salesToday)}</dd>
            </div>
            <div>
              <dt>Last 7 days</dt>
              <dd>
                {money(week)}
                <Change now={week} before={prevWeek} />
              </dd>
            </div>
            <div>
              <dt>Last 30 days</dt>
              <dd>
                {money(d.month.sales)}
                <Change now={d.monthVsPrevious.sales} before={d.monthVsPrevious.previous} />
              </dd>
            </div>
            <div>
              <dt>Average order</dt>
              <dd>{d.month.orders ? money(Math.round(d.month.sales / d.month.orders)) : "—"}</dd>
            </div>
          </dl>
        </div>
        <ColumnChart rows={salesRows(days, "day")} series={[SOLD, RENTED]} caption="Sales per day, last 14 days" highlightLast />
      </section>

      <div className="adm-duo">
        <section className="adm-card">
          <CardHead title="Order pipeline" href="/admin/orders" more="All orders" />
          <div className="adm-pad">
            <div className="adm-pipe" role="img" aria-label={PIPELINE.map((k) => ORDER_STATUS[k].label + " " + d.pipeline[k]).join(", ")}>
              {PIPELINE.filter((k) => d.pipeline[k]).map((k) => (
                <span key={k} data-tone={ORDER_STATUS[k].tone} style={{ flexGrow: d.pipeline[k] }} />
              ))}
            </div>
            <ul className="adm-legend">
              {PIPELINE.map((k) => (
                <li key={k}>
                  <Link href={"/admin/orders?status=" + k}>
                    <i data-tone={ORDER_STATUS[k].tone} />
                    <span>{ORDER_STATUS[k].label}</span>
                    <b>{d.pipeline[k]}</b>
                  </Link>
                </li>
              ))}
            </ul>
            <span className="adm-small">{plural(pipeTotal, "order")} in all</span>
          </div>
        </section>

        <section className="adm-card">
          <CardHead title="Last 30 days" />
          <div className="adm-pad">
            <div className="adm-split-bar" aria-hidden="true">
              <span style={{ flexGrow: d.month.purchases || (split ? 0 : 1) }} data-tone="blue" />
              <span style={{ flexGrow: d.month.rentals || (split ? 0 : 1) }} data-tone="green" />
            </div>
            <dl className="adm-dl">
              <div>
                <dt>
                  <i className="adm-dot" data-tone="blue" /> Sold
                </dt>
                <dd>
                  {money(d.month.purchases)}
                  {split ? <span className="adm-muted"> · {Math.round((d.month.purchases / split) * 100)}%</span> : null}
                </dd>
              </div>
              <div>
                <dt>
                  <i className="adm-dot" data-tone="green" /> Rented
                </dt>
                <dd>
                  {money(d.month.rentals)}
                  {split ? <span className="adm-muted"> · {Math.round((d.month.rentals / split) * 100)}%</span> : null}
                </dd>
              </div>
              <div>
                <dt>Orders</dt>
                <dd>{d.month.orders}</dd>
              </div>
              <div>
                <dt>Rentals with customers</dt>
                <dd>{d.activeRentals}</dd>
              </div>
              <div>
                <dt>Waiting to be handed over</dt>
                <dd>{d.rentalsScheduled}</dd>
              </div>
              <div>
                <dt>Due back today or late</dt>
                <dd className={d.rentalsDue ? "adm-error" : undefined}>{d.rentalsDue}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <div className="adm-duo">
        <section className="adm-card">
          <CardHead title="Sales by category" href="/admin/reports" more="Reports" />
          <div className="adm-pad">
            <span className="adm-small">Last 30 days</span>
            <BarList items={d.byCategory.map((c) => ({ key: c.name, label: c.name, value: c.sales, note: plural(c.units, "item") }))} empty="No sales in the last 30 days." />
          </div>
        </section>
        <div className="adm-col">
          <section className="adm-card">
            <CardHead title="Busiest days" />
            <ColumnChart rows={busiest} series={[{ key: "n", label: "Orders", color: "#1A62A8" }]} format={String} height={140} caption="Orders by day of the week, last 30 days" />
          </section>
          <section className="adm-card">
            <CardHead title="Payments" />
            <div className="adm-pad">
              <BarList items={d.byPayment.map((m) => ({ key: m.method, label: m.label, value: m.sales, note: plural(m.orders, "order") }))} empty="No payments in the last 30 days." />
            </div>
          </section>
        </div>
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

      <div className="adm-duo">
        <section className="adm-card">
          <CardHead title="Best sellers" href="/admin/products" more="Products" />
          {d.topProducts.length ? (
            <ol className="adm-rank">
              {d.topProducts.map((p, i) => (
                <li key={p.slug}>
                  <b>{i + 1}</b>
                  <Thumb kind={p.kind} bg={p.bg} />
                  <span className="adm-stack">
                    <Link href={"/admin/products/" + p.slug} className="adm-strong adm-clip">
                      {p.name}
                    </Link>
                    <span className="adm-rank-bar" aria-hidden="true">
                      <span style={{ width: (p.units / topUnits) * 100 + "%" }} />
                    </span>
                  </span>
                  <span className="adm-stack" style={{ alignItems: "flex-end" }}>
                    <span className="adm-strong">{plural(p.units, p.rented === p.units ? "rental" : "unit")}</span>
                    <small>{money(p.revenue)}</small>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="adm-pad">
              <Empty title="Nothing sold yet">The best sellers of the last 30 days show here.</Empty>
            </div>
          )}
        </section>

        <section className="adm-card">
          <CardHead title="Running low" href="/admin/products" more="Products" />
          {d.lowStock.length ? (
            <ol className="adm-rank">
              {d.lowStock.map((p) => (
                <li key={p.slug}>
                  <Thumb kind={p.kind} bg={p.bg} />
                  <span className="adm-stack">
                    <span className="adm-strong adm-clip">{p.name}</span>
                    <small className={p.stock ? undefined : "adm-error"}>{p.stock ? p.stock + " left" : "Out of stock"}</small>
                  </span>
                  <Link href={"/admin/products/" + p.slug} className="adm-btn">
                    Restock
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="adm-pad">
              <Empty title="Stock looks good">Products with 3 or fewer left show here.</Empty>
            </div>
          )}
        </section>
      </div>

      <section className="adm-card">
        <CardHead title="Latest orders" href="/admin/orders" more="All orders" />
        {d.recentOrders.length ? (
          <OrderTable orders={d.recentOrders} label="Latest orders" />
        ) : (
          <div className="adm-pad">
            <Empty title="No orders yet">New orders show here the moment they are placed.</Empty>
          </div>
        )}
      </section>
    </>
  );
}

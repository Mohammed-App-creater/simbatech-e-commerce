"use client";

import Link from "next/link";
import { navigate } from "@/lib/client/store";
import { formatPhone } from "@/lib/phone";
import { BarList, Change, ColumnChart, RENTED, SOLD, salesRows } from "@/components/admin/charts";
import { Empty, Icon, PageHead, Tabs, Thumb, dLong, money, plural } from "@/components/admin/ui";

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "12 months" },
];
const BUCKET = { day: "per day", week: "per week", month: "per month" };
const iso = (s) => s + "T00:00:00+03:00";
const count = (n) => String(n);

function Kpi({ label, value, now, before, note }) {
  return (
    <div className="adm-tile">
      <span className="adm-tile-top">{label}</span>
      <span>
        <span className="adm-tile-num" data-small="">
          {value}
        </span>
        <span className="adm-tile-note">
          <Change now={now} before={before} /> {note}
        </span>
      </span>
    </div>
  );
}

function Card({ title, sub, children, action }) {
  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div className="adm-stack" style={{ gap: "6px" }}>
          <h2 className="adm-h2">{title}</h2>
          {sub ? <span className="adm-small">{sub}</span> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* /admin/reports — sales over any period: totals against the period before, charts and breakdowns. */
export default function AdminReports({ initial: r }) {
  const t = r.totals;
  const p = r.previous;
  const range = r.range;
  const qs = "from=" + range.from + "&to=" + range.to;
  const period = dLong(iso(range.from)) + " – " + dLong(iso(range.to));
  const vsText = "vs " + dLong(iso(p.from)) + " – " + dLong(iso(p.to));
  const split = t.purchases - t.discount + t.rentals;
  const delivery = (r.byFulfilment.delivery || 0) + (r.byFulfilment.pickup || 0);

  function custom(e) {
    e.preventDefault();
    const f = e.currentTarget.elements;
    navigate("/admin/reports?from=" + f.namedItem("from").value + "&to=" + f.namedItem("to").value);
  }

  return (
    <>
      <PageHead eyebrow="Reports" title="Sales" accent="at a glance." sub={period + " · cancelled orders are left out of every amount."}>
        <a href={"/api/admin/reports/orders.csv?" + qs} className="adm-btn" data-size="lg" download>
          <Icon d={["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"]} size={16} width={2} />
          Download orders (CSV)
        </a>
        <button type="button" className="adm-btn" data-kind="text" data-size="lg" onClick={() => window.print()}>
          Print
        </button>
      </PageHead>

      <div className="adm-toolbar">
        <Tabs label="Period" items={RANGES.map((x) => ({ href: "/admin/reports?days=" + x.days, label: x.label, on: r.preset === x.days }))} />
        <form className="adm-range" onSubmit={custom} key={qs}>
          <label>
            <span className="sr-only">From</span>
            <input className="adm-input" data-small="" type="date" name="from" defaultValue={range.from} max={r.today} required />
          </label>
          <span className="adm-muted">to</span>
          <label>
            <span className="sr-only">To</span>
            <input className="adm-input" data-small="" type="date" name="to" defaultValue={range.to} max={r.today} required />
          </label>
          <button type="submit" className="adm-btn" data-kind="primary">
            Show
          </button>
        </form>
      </div>

      <div className="adm-tiles">
        <Kpi label="Sales" value={money(t.sales)} now={t.sales} before={p.sales} note={vsText} />
        <Kpi label="Orders" value={t.orders} now={t.orders} before={p.orders} note={t.cancelled ? t.cancelled + " cancelled" : "none cancelled"} />
        <Kpi label="Average order" value={money(t.avgOrder)} now={t.avgOrder} before={p.avgOrder} note="" />
        <Kpi label="New customers" value={r.newCustomers} note="accounts opened" />
      </div>

      <Card title="Sales over time" sub={"Sold and rented, " + BUCKET[range.bucket] + ". Purchases are after promo discounts."}>
        {t.orders ? (
          <ColumnChart rows={salesRows(r.series, range.bucket, { today: range.to === r.today })} series={[SOLD, RENTED]} caption="Sales over time" height={260} />
        ) : (
          <div className="adm-pad">
            <Empty title="No sales in this period">Pick a longer period above.</Empty>
          </div>
        )}
      </Card>

      <div className="adm-duo">
        <Card title="Orders" sub={"Number of orders, " + BUCKET[range.bucket]}>
          <ColumnChart
            rows={salesRows(r.series, range.bucket, { today: range.to === r.today }).map((row) => ({ ...row, values: { n: row.values.orders }, note: null }))}
            series={[{ key: "n", label: "Orders", color: "#1A62A8" }]}
            format={count}
            height={180}
            caption="Orders over time"
          />
        </Card>
        <Card title="Busiest days" sub="Orders by day of the week">
          <ColumnChart
            rows={r.byWeekday.map((d) => ({ id: d.day, axis: d.day, title: d.day, values: { n: d.orders } }))}
            series={[{ key: "n", label: "Orders", color: "#1A62A8" }]}
            format={count}
            height={180}
            caption="Orders by day of the week"
          />
        </Card>
      </div>

      <div className="adm-duo">
        <Card title="Sales by category">
          <div className="adm-pad">
            <BarList items={r.byCategory.map((c) => ({ key: c.name, label: c.name, value: c.sales, note: plural(c.units, "item") }))} empty="No sales in this period." />
          </div>
        </Card>
        <div className="adm-col">
          <Card title="Where the money came from">
            <div className="adm-pad">
              <div className="adm-split-bar" aria-hidden="true">
                <span style={{ flexGrow: t.purchases - t.discount || (split ? 0 : 1), background: SOLD.color }} />
                <span style={{ flexGrow: t.rentals || (split ? 0 : 1), background: RENTED.color }} />
              </div>
              <dl className="adm-dl">
                <div>
                  <dt>
                    <i className="adm-dot" style={{ background: SOLD.color }} /> Sold ({plural(t.unitsSold, "item")})
                  </dt>
                  <dd>{money(t.purchases - t.discount)}</dd>
                </div>
                <div>
                  <dt>
                    <i className="adm-dot" style={{ background: RENTED.color }} /> Rented ({plural(t.rentalsBooked, "booking")})
                  </dt>
                  <dd>{money(t.rentals)}</dd>
                </div>
                <div>
                  <dt>Delivery fees</dt>
                  <dd>{money(t.deliveryFees)}</dd>
                </div>
                <div>
                  <dt>Promo discounts given</dt>
                  <dd>−{money(t.discount)}</dd>
                </div>
                <div data-total="">
                  <dt>Sales</dt>
                  <dd>{money(t.sales)}</dd>
                </div>
              </dl>
            </div>
          </Card>
          <Card title="Payments">
            <div className="adm-pad">
              <BarList items={r.byPayment.map((m) => ({ key: m.method, label: m.label, value: m.sales, note: plural(m.orders, "order") }))} empty="No payments in this period." />
              <dl className="adm-dl">
                <div>
                  <dt>Still to collect</dt>
                  <dd>{money(t.unpaid)}</dd>
                </div>
                <div>
                  <dt>Refunded</dt>
                  <dd>{money(t.refunded)}</dd>
                </div>
                <div>
                  <dt>Cancelled orders</dt>
                  <dd>
                    {t.cancelled} · {money(t.cancelledValue)}
                  </dd>
                </div>
                <div>
                  <dt>Delivered / picked up in store</dt>
                  <dd>{delivery ? (r.byFulfilment.delivery || 0) + " / " + (r.byFulfilment.pickup || 0) : "—"}</dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Best-selling products" action={<Link href="/admin/products" className="adm-more">Products <Icon d="M5 12h14M13 6l6 6-6 6" size={16} width={2} /></Link>}>
        {r.topProducts.length ? (
          <div role="table" aria-label="Best-selling products">
            <div role="row" className="adm-row" data-head="" style={{ "--cols": "40px minmax(0, 1fr) 110px 110px 140px" }}>
              <span role="columnheader">#</span>
              <span role="columnheader">Product</span>
              <span role="columnheader">Sold</span>
              <span role="columnheader">Rented</span>
              <span role="columnheader">Sales</span>
            </div>
            {r.topProducts.map((x, i) => (
              <div role="row" className="adm-row" style={{ "--cols": "40px minmax(0, 1fr) 110px 110px 140px" }} key={x.slug}>
                <span role="cell" className="adm-muted adm-strong">
                  {i + 1}
                </span>
                <span role="cell" className="adm-thumbs">
                  <Thumb kind={x.kind} bg={x.bg} />
                  <Link href={"/admin/products/" + x.slug} className="adm-strong adm-clip">
                    {x.name}
                  </Link>
                </span>
                <span role="cell">{x.units ? plural(x.units, "item") : "—"}</span>
                <span role="cell">{x.rentals ? plural(x.rentals, "booking") : "—"}</span>
                <span role="cell" className="adm-strong">
                  {money(x.sales)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="adm-pad">
            <Empty title="Nothing sold in this period">Best sellers will show here.</Empty>
          </div>
        )}
      </Card>

      <div className="adm-duo">
        <Card title="Top customers">
          {r.topCustomers.length ? (
            <ol className="adm-rank">
              {r.topCustomers.map((c, i) => (
                <li key={c.id}>
                  <b>{i + 1}</b>
                  <span className="adm-stack">
                    <span className="adm-strong adm-clip">{c.name}</span>
                    <small className="adm-clip">{c.contact && !c.contact.includes("@") ? formatPhone(c.contact) : c.contact}</small>
                  </span>
                  <span className="adm-stack" style={{ alignItems: "flex-end" }}>
                    <span className="adm-strong">{money(c.spent)}</span>
                    <small>{plural(c.orders, "order")}</small>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="adm-pad">
              <p className="adm-small">No orders from signed-in customers in this period.</p>
            </div>
          )}
        </Card>
        <Card title="Promo codes used" action={<Link href="/admin/promos" className="adm-more">Promo codes <Icon d="M5 12h14M13 6l6 6-6 6" size={16} width={2} /></Link>}>
          <div className="adm-pad">
            <BarList items={r.promos.map((x) => ({ key: x.code, label: x.code, value: x.orders, note: money(x.discount) + " off in total" }))} format={(n) => plural(n, "order")} empty="No promo codes were used in this period." />
          </div>
        </Card>
      </div>
    </>
  );
}

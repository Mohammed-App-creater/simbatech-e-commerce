"use client";

import { useState } from "react";
import { money, plural } from "./ui";

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-09-30" is a shop calendar day: read it as UTC so every time zone prints the same day
const day = (iso) => new Date(iso + "T00:00:00Z");
const label = (iso) => WD[day(iso).getUTCDay()] + " " + day(iso).getUTCDate();
const long = (iso) => WD[day(iso).getUTCDay()] + " " + day(iso).getUTCDate() + " " + MO[day(iso).getUTCMonth()];

// A round top for the axis: 1, 2 or 5 × a power of ten, at or above the highest day.
function niceMax(v) {
  if (v <= 0) return 1000;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v);
}
const short = (n) => (n >= 1000000 ? n / 1000000 + "M" : n >= 1000 ? n / 1000 + "k" : String(n));

/*
 * Sales per day as columns (one series, the brand blue), with a hover/focus tooltip on each day and a
 * table of the same numbers for screen readers. `days`: [{ date: "yyyy-mm-dd", sales, orders }], oldest first.
 */
export default function SalesChart({ days }) {
  const [hover, setHover] = useState(null);
  const top = niceMax(Math.max(...days.map((d) => d.sales)));
  const ticks = [top, top / 2, 0];
  const last = days.length - 1;

  return (
    <div className="adm-chart">
      <div className="adm-chart-plot" onMouseLeave={() => setHover(null)}>
        <div className="adm-chart-grid" aria-hidden="true">
          {ticks.map((t) => (
            <div key={t}>
              <span>{short(t)}</span>
            </div>
          ))}
        </div>
        <div className="adm-chart-cols" data-hovering={hover === null ? undefined : ""}>
          {days.map((d, i) => (
            <button
              type="button"
              key={d.date}
              className="adm-chart-col"
              data-on={hover === i ? "" : undefined}
              data-today={i === last ? "" : undefined}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={long(d.date) + ": " + money(d.sales) + ", " + plural(d.orders, "order")}
            >
              <span className="adm-chart-bar" style={{ height: d.sales ? Math.max(2, (d.sales / top) * 100) + "%" : "0" }} />
              {hover === i ? (
                <span className="adm-chart-tip" data-side={i > days.length / 2 ? "left" : "right"} role="presentation">
                  <small>{i === last ? "Today" : long(d.date)}</small>
                  <strong>{money(d.sales)}</strong>
                  <small>{plural(d.orders, "order")}</small>
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="adm-chart-x" aria-hidden="true">
        {days.map((d, i) => (
          <span key={d.date} data-skip={i % 2 === last % 2 ? undefined : ""}>
            {i === last ? "Today" : label(d.date)}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Sales per day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Sales</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.date}>
              <td>{long(d.date)}</td>
              <td>{money(d.sales)}</td>
              <td>{d.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

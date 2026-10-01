"use client";

import { useState } from "react";
import Link from "next/link";
import { money, plural } from "./ui";

/*
 * The admin's charts, drawn with plain HTML so they follow the page's fonts and reflow on phones.
 * One y-axis per chart. Colours: one series = brand blue; sold/rented = SERIES below (checked for
 * colour-blind separation). Every chart has a hover/focus tooltip and a hidden table for screen readers.
 */

export const SOLD = { key: "purchases", label: "Sold", color: "#1A62A8" };
export const RENTED = { key: "rentals", label: "Rented", color: "#418D4D" };

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "yyyy-mm-dd" is a shop calendar day: read it as UTC so every time zone prints the same day
const ymd = (iso) => new Date(iso + "T00:00:00Z");

/** Axis and tooltip labels for one bucket of a time series ("day", "week" or "month"). */
export function bucketLabels(iso, bucket, isLast) {
  const d = ymd(iso);
  const dm = d.getUTCDate() + " " + MO[d.getUTCMonth()];
  if (bucket === "month") return { axis: MO[d.getUTCMonth()], title: MO[d.getUTCMonth()] + " " + d.getUTCFullYear() };
  if (bucket === "week") return { axis: dm, title: "Week of " + dm };
  if (isLast) return { axis: "Today", title: "Today, " + dm };
  return { axis: WD[d.getUTCDay()] + " " + d.getUTCDate(), title: WD[d.getUTCDay()] + " " + dm };
}

// A round top for the axis (1, 2, 2.5 or 5 × a power of ten) at or above the highest value.
function niceMax(v, fallback) {
  if (v <= 0) return fallback;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v);
}
export const shortNum = (n) => (n >= 1e6 ? +(n / 1e6).toFixed(1) + "M" : n >= 1000 ? +(n / 1000).toFixed(1) + "k" : String(n));

export function Legend({ series }) {
  return (
    <ul className="adm-chart-legend">
      {series.map((s) => (
        <li key={s.key}>
          <i style={{ background: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/*
 * Columns over time or categories, stacked when there are several series.
 * rows: [{ id, axis, title, values: { [series.key]: number }, note? }]
 * series: [{ key, label, color }] · format: number → text for the tooltip · height in px.
 */
export function ColumnChart({ rows, series, format = money, height = 240, caption, highlightLast = false }) {
  const [hover, setHover] = useState(null);
  const totalOf = (r) => series.reduce((s, x) => s + (r.values[x.key] || 0), 0);
  const top = niceMax(Math.max(0, ...rows.map(totalOf)), format === money ? 1000 : 4);
  const ticks = [top, top / 2, 0];
  const every = rows.length > 16 ? Math.ceil(rows.length / 8) : 1;
  const last = rows.length - 1;

  return (
    <div className="adm-chart">
      {series.length > 1 ? <Legend series={series} /> : null}
      <div className="adm-chart-plot" style={{ height: height + "px" }} onMouseLeave={() => setHover(null)}>
        <div className="adm-chart-grid" aria-hidden="true">
          {ticks.map((t) => (
            <div key={t}>
              <span>{shortNum(t)}</span>
            </div>
          ))}
        </div>
        <div className="adm-chart-cols" data-hovering={hover === null ? undefined : ""}>
          {rows.map((r, i) => {
            const total = totalOf(r);
            const filled = series.filter((s) => r.values[s.key] > 0);
            return (
              <button
                type="button"
                key={r.id}
                className="adm-chart-col"
                data-on={hover === i ? "" : undefined}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={r.title + ": " + series.map((s) => s.label + " " + format(r.values[s.key] || 0)).join(", ") + (r.note ? ", " + r.note : "")}
              >
                <span className="adm-chart-stack" style={{ height: total ? Math.max(1.5, (total / top) * 100) + "%" : "0" }}>
                  {filled
                    .slice()
                    .reverse()
                    .map((s) => (
                      <span key={s.key} style={{ flexGrow: r.values[s.key], background: highlightLast && i === last && series.length === 1 ? "#1679BE" : s.color }} />
                    ))}
                </span>
                {hover === i ? (
                  <span className="adm-chart-tip" data-side={i >= rows.length / 2 ? "left" : "right"} role="presentation">
                    <small>{r.title}</small>
                    {series.length > 1 ? (
                      <>
                        {series.map((s) => (
                          <span key={s.key} className="adm-chart-tip-row">
                            <i style={{ background: s.color }} />
                            {s.label}
                            <b>{format(r.values[s.key] || 0)}</b>
                          </span>
                        ))}
                        <strong>{format(total)}</strong>
                      </>
                    ) : (
                      <strong>{format(total)}</strong>
                    )}
                    {r.note ? <small>{r.note}</small> : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="adm-chart-x" aria-hidden="true">
        {rows.map((r, i) => (
          <span key={r.id} data-skip={(last - i) % every ? "" : undefined}
            data-skip-sm={rows.length > 8 && (last - i) % (every * 2) ? "" : undefined} data-last={i === last && highlightLast ? "" : undefined}>
            {r.axis}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>Period</th>
            {series.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              {series.map((s) => (
                <td key={s.key}>{format(r.values[s.key] || 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A time series from the API ({date, purchases, rentals, orders, sales}) as ColumnChart rows. */
export function salesRows(points, bucket, { today = true } = {}) {
  return points.map((p, i) => {
    const l = bucketLabels(p.date, bucket, today && bucket === "day" && i === points.length - 1);
    return { id: p.date, axis: l.axis, title: l.title, values: { purchases: p.purchases, rentals: p.rentals, orders: p.orders }, note: plural(p.orders, "order") };
  });
}

/*
 * Ranked horizontal bars (one hue: the bars show size, not identity), each labelled with its value.
 * items: [{ key, label, value, note?, href? }]
 */
export function BarList({ items, format = money, empty = "Nothing yet" }) {
  if (!items.length) return <p className="adm-small">{empty}</p>;
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="adm-bars">
      {items.map((it) => {
        const Row = it.href ? Link : "div";
        return (
          <li key={it.key}>
            <Row href={it.href} className="adm-bars-row" title={it.label + ": " + format(it.value) + (it.note ? " · " + it.note : "")}>
              <span className="adm-bars-top">
                <span className="adm-clip">{it.label}</span>
                <b>{format(it.value)}</b>
              </span>
              <span className="adm-bars-track" aria-hidden="true">
                <span style={{ width: Math.max(1, (it.value / max) * 100) + "%" }} />
              </span>
              {it.note ? <small>{it.note}</small> : null}
            </Row>
          </li>
        );
      })}
    </ul>
  );
}

/** "▲ 12%" against an earlier period (null when there is nothing to compare with). */
export function Change({ now, before }) {
  if (!before) return null;
  const pct = Math.round(((now - before) / before) * 100);
  return (
    <em className="adm-change" data-tone={pct >= 0 ? "up" : "down"} title="Compared with the period before">
      {pct >= 0 ? "▲ " : "▼ "}
      {Math.abs(pct)}%
    </em>
  );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/client/store";
import { formatPhone } from "@/lib/phone";
import { ORDER_STATUS, PAY_METHOD, PAY_STATUS, PageHead, Pill, RENTAL_STATUS, Thumb, dLong, dShort, money, plural, stamp, useAction } from "@/components/admin/ui";

const STATUSES = ["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

// The usual next step for an order, offered as the main button.
function nextStep(order) {
  const pickup = order.fulfilment === "pickup";
  if (order.status === "PLACED") return { to: "PACKED", label: "Mark as packed" };
  if (order.status === "PACKED") return { to: "OUT_FOR_DELIVERY", label: pickup ? "Ready for pick-up" : "Send out for delivery" };
  if (order.status === "OUT_FOR_DELIVERY") return { to: "DELIVERED", label: pickup ? "Mark as picked up" : "Mark as delivered" };
  return null;
}

/* /admin/orders/[id] — one order: move it along, record its payment, hand over and take back rentals. */
export default function AdminOrder({ initial }) {
  const o = initial.order;
  const action = useAction();
  const [note, setNote] = useState("");
  const [pick, setPick] = useState(null); // status chosen in the "set another status" list
  const st = ORDER_STATUS[o.status];
  const pay = PAY_STATUS[o.payment.status];
  const step = nextStep(o);
  const chosen = pick || o.status;
  const url = "/api/admin/orders/" + o.id;

  async function setStatus(key, status) {
    const ok = await action.run(key, () => api("PATCH", url, { status, note: note.trim() }));
    if (ok) {
      setNote("");
      setPick(null);
    }
  }
  const setPayment = (paymentStatus) => action.run("pay", () => api("PATCH", url, { paymentStatus }));
  const setRental = (item, rentalStatus) => action.run("rental-" + item.id, () => api("PATCH", "/api/admin/rentals/" + item.id, { rentalStatus }));
  const errorFor = (key) =>
    action.errorKey === key ? (
      <span role="alert" className="adm-error">
        {action.error.message}
      </span>
    ) : null;

  return (
    <>
      <PageHead
        eyebrow={<Link href="/admin/orders">← Orders</Link>}
        title={"Order " + o.number}
        sub={"Placed " + stamp(o.createdAt) + " · " + (o.fulfilment === "pickup" ? "Pick up in store" : "Delivery") + " · " + plural(o.items.length, "line")}
      >
        <Pill tone={st.tone}>{st.label}</Pill>
        <Pill tone={pay.tone}>{o.payment.status === "pending" && o.payment.method === "cod" ? "Pay on delivery" : pay.label}</Pill>
      </PageHead>

      <div className="adm-split">
        <div className="adm-col">
          <section className="adm-card" data-pad="">
            <div className="adm-form">
              <h2 className="adm-h2">Move this order along</h2>
              <label className="adm-field">
                Note for the customer&apos;s tracking page (optional)
                <input className="adm-input" type="text" maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Your driver is Abel, 0911 234 567" />
              </label>
              <div className="adm-formbar">
                {step ? (
                  <button type="button" className="adm-btn" data-kind="go" data-size="lg" disabled={action.busy} onClick={() => setStatus("step", step.to)}>
                    {action.busyKey === "step" ? "Saving…" : step.label}
                  </button>
                ) : (
                  <span className="adm-muted">{o.status === "CANCELLED" ? "This order was cancelled." : "This order is complete."}</span>
                )}
              </div>
              {errorFor("step")}
              <div className="adm-formbar">
                <label className="adm-field" style={{ flex: "1 1 200px" }}>
                  Or set another status
                  <select className="adm-input" data-small="" value={chosen} onChange={(e) => setPick(e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS[s].label}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" className="adm-btn" style={{ alignSelf: "flex-end" }} disabled={action.busy || chosen === o.status} onClick={() => setStatus("set", chosen)}>
                  {action.busyKey === "set" ? "Saving…" : "Update status"}
                </button>
              </div>
              {errorFor("set")}
            </div>
          </section>

          <section className="adm-card">
            <div className="adm-card-head">
              <h2 className="adm-h2">Items</h2>
            </div>
            {o.items.map((i) => {
              const rent = i.mode === "rent";
              const rs = rent && i.rentalStatus ? RENTAL_STATUS[i.rentalStatus] : null;
              return (
                <div className="adm-row" style={{ "--cols": "minmax(0, 1fr) auto" }} key={i.id}>
                  <span className="adm-thumbs">
                    <Thumb kind={i.kind} bg={i.bg} size={56} />
                    <span className="adm-stack">
                      <Link href={"/admin/products/" + i.productSlug} className="adm-strong">
                        {i.qty} × {i.name}
                      </Link>
                      <small>
                        {rent ? "Rent · " + dShort(i.rentStart) + " → " + dShort(i.rentEnd) + " (" + plural(i.rentDays, "day") + ")" : "Buy"}
                        {i.variant ? " · " + i.variant : ""}
                        {i.addOns.length ? " · with " + i.addOns.map((a) => a.label).join(", ") : ""}
                      </small>
                      {rent ? (
                        <small>
                          Deposit {money(i.deposit)}
                          {i.extendedDays ? " · extended " + plural(i.extendedDays, "day") + " (+" + money(i.extraCharge) + ")" : ""}
                        </small>
                      ) : null}
                      {errorFor("rental-" + i.id)}
                    </span>
                  </span>
                  <span className="adm-stack" style={{ alignItems: "flex-end" }}>
                    <span className="adm-strong">{money(i.lineTotal)}</span>
                    {rs ? <Pill tone={rs.tone}>{rs.label}</Pill> : null}
                    {i.rentalStatus === "scheduled" ? (
                      <button type="button" className="adm-btn" disabled={action.busy} onClick={() => setRental(i, "ACTIVE")}>
                        Handed over
                      </button>
                    ) : null}
                    {i.rentalStatus === "active" ? (
                      <button type="button" className="adm-btn" disabled={action.busy} onClick={() => setRental(i, "RETURNED")}>
                        Returned to us
                      </button>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </section>

          <section className="adm-card" data-pad="">
            <div className="adm-form">
              <h2 className="adm-h2">Timeline</h2>
              <ol className="adm-timeline">
                {o.events.map((e, i) => (
                  <li key={i}>
                    <span className="adm-stack">
                      <span className="adm-strong">{e.status === "PLACED" ? "Order placed" : ORDER_STATUS[e.status].label}</span>
                      <small>
                        {stamp(e.at)}
                        {e.note ? " · " + e.note : ""}
                      </small>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        <div className="adm-col">
          <section className="adm-card" data-pad="">
            <div className="adm-form" style={{ gap: "16px" }}>
              <h3 className="adm-h3">Customer</h3>
              <dl className="adm-dl">
                <div>
                  <dt>Name</dt>
                  <dd>{o.contact.name}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={"tel:" + o.contact.phone}>{formatPhone(o.contact.phone) || o.contact.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={"mailto:" + o.contact.email}>{o.contact.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Account</dt>
                  <dd>{o.customer ? plural(o.customer.orders, "order") + " so far" : "Guest checkout"}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="adm-card" data-pad="">
            <div className="adm-form" style={{ gap: "16px" }}>
              <h3 className="adm-h3">{o.fulfilment === "pickup" ? "Pick up in store" : "Delivery"}</h3>
              {o.address ? (
                <dl className="adm-dl">
                  <div>
                    <dt>Address</dt>
                    <dd>
                      {o.address.line1}
                      <br />
                      {o.address.area}, {o.address.city}
                    </dd>
                  </div>
                  <div>
                    <dt>Phone there</dt>
                    <dd>{formatPhone(o.address.phone) || o.address.phone}</dd>
                  </div>
                  {o.deliveryDate ? (
                    <div>
                      <dt>When</dt>
                      <dd>
                        {dLong(o.deliveryDate)}
                        {o.deliveryWindow ? ", " + o.deliveryWindow : ""}
                      </dd>
                    </div>
                  ) : null}
                  {o.address.notes ? (
                    <div>
                      <dt>Driver notes</dt>
                      <dd>{o.address.notes}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <span className="adm-muted">The customer collects this order from the store.</span>
              )}
            </div>
          </section>

          <section className="adm-card" data-pad="">
            <div className="adm-form" style={{ gap: "16px" }}>
              <h3 className="adm-h3">Payment</h3>
              <dl className="adm-dl">
                <div>
                  <dt>Method</dt>
                  <dd>
                    {PAY_METHOD[o.payment.method]}
                    {o.payment.phone ? " · " + (formatPhone(o.payment.phone) || o.payment.phone) : ""}
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    {pay.label}
                    {o.payment.paidAt ? " · " + stamp(o.payment.paidAt) : ""}
                  </dd>
                </div>
                {o.paymentRef ? (
                  <div>
                    <dt>Reference</dt>
                    <dd>{o.paymentRef}</dd>
                  </div>
                ) : null}
                {o.totals.purchases ? (
                  <div>
                    <dt>Purchases</dt>
                    <dd>{money(o.totals.purchases)}</dd>
                  </div>
                ) : null}
                {o.totals.rentals ? (
                  <div>
                    <dt>Rentals</dt>
                    <dd>{money(o.totals.rentals)}</dd>
                  </div>
                ) : null}
                {o.totals.discount ? (
                  <div>
                    <dt>Discount{o.promoCode ? " (" + o.promoCode + ")" : ""}</dt>
                    <dd>−{money(o.totals.discount)}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Delivery</dt>
                  <dd>{o.totals.deliveryFee ? money(o.totals.deliveryFee) : "Free"}</dd>
                </div>
                <div data-total="">
                  <dt>Total</dt>
                  <dd>{money(o.totals.total)}</dd>
                </div>
                {o.totals.deposit ? (
                  <div>
                    <dt>Refundable deposit</dt>
                    <dd>{money(o.totals.deposit)}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="adm-formbar">
                {o.payment.status === "paid" ? (
                  <>
                    <button type="button" className="adm-btn" disabled={action.busy} onClick={() => setPayment("REFUNDED")}>
                      Mark as refunded
                    </button>
                    <button type="button" className="adm-btn" data-kind="text" disabled={action.busy} onClick={() => setPayment("PENDING")}>
                      Not paid yet
                    </button>
                  </>
                ) : (
                  <button type="button" className="adm-btn" data-kind="go" disabled={action.busy} onClick={() => setPayment("PAID")}>
                    {action.busyKey === "pay" ? "Saving…" : "Mark as paid"}
                  </button>
                )}
              </div>
              {errorFor("pay")}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

"use client";

import ReviewCard from "@/components/admin/ReviewCard";
import { Empty, MoreNote, PageHead, Tabs, useAction } from "@/components/admin/ui";

const TABS = [
  { id: "pending", label: "Waiting" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

const EMPTY = {
  pending: ["Nothing waiting", "New and edited reviews will wait here for your approval."],
  approved: ["No approved reviews yet", "Reviews you approve show on the product's page."],
  rejected: ["No rejected reviews", "Reviews you reject stay hidden from the store."],
  all: ["No reviews yet", "Customers can review a product from its page."],
};

/* /admin/reviews — customers' reviews are held here until staff approve them. */
export default function AdminReviews({ initial: d }) {
  const action = useAction();
  const c = d.counts;
  const count = { pending: c.pending, approved: c.approved, rejected: c.rejected, all: c.pending + c.approved + c.rejected };

  return (
    <>
      <PageHead
        eyebrow="Customer posts"
        title="Reviews"
        accent="to approve."
        sub="A new or edited review waits here. Only approved reviews show on the product's page and count in its star rating."
      >
        <Tabs label="Filter reviews" items={TABS.map((t) => ({ href: "/admin/reviews" + (t.id === "pending" ? "" : "?status=" + t.id), label: t.label, count: count[t.id], on: t.id === d.status }))} />
      </PageHead>
      {d.reviews.length ? (
        <div className="adm-list">
          {d.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} action={action} />
          ))}
          <MoreNote shown={d.reviews.length} total={d.total} what="reviews" />
        </div>
      ) : (
        <Empty title={EMPTY[d.status][0]}>{EMPTY[d.status][1]}</Empty>
      )}
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageScreen from "@/screens/PageScreen";
import { getPage, getShell } from "@/lib/server/api";

type Params = Promise<{ slug: string }>;
type Search = Promise<{ topic?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return page ? { title: `Simbatech — ${page.title}`, description: page.summary || undefined } : { title: "Simbatech — Page not found" };
}

export default async function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ slug }, { topic }] = await Promise.all([params, searchParams]);
  const [shell, page] = await Promise.all([getShell(), getPage(slug)]);
  if (!page) notFound();
  return <PageScreen key={slug} initial={{ ...shell, page, topic: topic ?? "" }} />;
}

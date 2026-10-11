import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // No articles in DB yet — all slugs return 404
  void slug;
  return { title: "Article Not Found" };
}

export default async function InsightDetailPage({ params }: Props) {
  void (await params);
  // Articles are not yet stored in the database.
  notFound();
}

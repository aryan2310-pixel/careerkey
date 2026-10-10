// app/colleges/[slug]/page.tsx
import { Suspense } from "react";

export default function SingleCollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CollegeSkeleton />}>
      <CollegeContent params={params} />
    </Suspense>
  );
}

async function CollegeContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>{slug}</h1>
      <p>{`welcome to ${slug}`}</p>
    </div>
  );
}

function CollegeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="mt-4 h-4 w-96 rounded bg-gray-200" />
    </div>
  );
}
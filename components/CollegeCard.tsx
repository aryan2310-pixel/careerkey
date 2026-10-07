import Image from "next/image";
import Link from "next/link";
import type { CollegeCardData, InstituteType } from "@/lib/colleges";

const typeLabel: Record<InstituteType, string> = {
  private: "Private",
  public: "Public",
  both: "Public & Private",
};

// Server component: no state or click handlers, so no "use client".
export default function CollegeCard({ college }: { college: CollegeCardData }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      {/* Image area: fixed shape so every card lines up */}
      <div className="relative aspect-[16/10] bg-brand-soft">
        {college.image ? (
          <Image
            src={college.image}
            alt={college.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-brand">
            {college.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {typeLabel[college.instituteType]}
        </span>

        <h2 className="mt-3 text-lg font-bold text-ink">{college.name}</h2>

        <p className="mt-1 text-sm text-muted">
          {college.city}
          {college.state ? `, ${college.state}` : ""}
        </p>

        {/* mt-auto pushes the button to the bottom of every card */}
        <Link
          href={`/colleges/${college.slug}`}
          aria-label={`Know more about ${college.name}`}
          className="mt-5 inline-block w-fit rounded-lg bg-go px-4 py-2 text-sm font-semibold text-white hover:bg-go-dark"
        >
          Know more
        </Link>
      </div>
    </article>
  );
}
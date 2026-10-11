"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

export default function CollegeSidebar({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside className="sticky top-24 hidden h-fit w-56 flex-col gap-1 rounded-xl border border-line bg-white p-3 lg:flex">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
        On this page
      </p>
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              isActive
                ? "bg-brand-soft text-brand font-semibold"
                : "text-muted hover:bg-slate-50 hover:text-ink"
            }`}
          >
            {label}
          </button>
        );
      })}
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About us" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-white">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link href="/" className="text-xl font-bold text-ink">
            CampusPath
          </Link>
        </motion.div>

        {/* Navigation */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <motion.div
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  whileHover={{
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-brand"
                        : "text-muted hover:text-brand"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Link
            href="/book-counselling"
            className="rounded-lg bg-go px-4 py-2 text-sm font-semibold text-white hover:bg-go-dark"
          >
            Book counselling
          </Link>
        </motion.div>
      </nav>
    </header>
  );
}
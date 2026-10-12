"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About us" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route/pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu with Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-white/95 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white shadow-sm">
            CK
          </span>
          <span>CareerKey</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 md:flex lg:gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-brand-soft font-semibold text-brand"
                      : "text-muted hover:bg-slate-50 hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Actions: CTA + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CTA (Visible on tablet & desktop) */}
          <div className="hidden sm:block">
            <Link
              href="/book-counselling"
              className="inline-flex items-center justify-center rounded-lg bg-go px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-go-dark hover:scale-105 active:scale-95"
            >
              Book counselling
            </Link>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close main navigation" : "Open main navigation"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand md:hidden"
          >
            {isOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Dropdown Menu Container */}
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="relative z-50 overflow-hidden border-b border-line bg-white shadow-xl md:hidden"
            >
              <div className="mx-auto max-w-6xl px-4 py-5 space-y-4">
                {/* Mobile Links */}
                <ul className="flex flex-col space-y-1">
                  {links.map((link) => {
                    const isActive =
                      pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                            isActive
                              ? "bg-brand-soft font-semibold text-brand"
                              : "text-ink hover:bg-slate-50 hover:text-brand"
                          }`}
                        >
                          <span>{link.label}</span>
                          {isActive ? (
                            <span className="h-2 w-2 rounded-full bg-brand" />
                          ) : (
                            <svg
                              className="h-4 w-4 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile Action Section */}
                <div className="border-t border-line pt-4">
                  <Link
                    href="/book-counselling"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-go px-4 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-go-dark active:scale-[0.99]"
                  >
                    Book counselling
                  </Link>
                  <p className="mt-3 text-center text-xs text-muted">
                    Expert college & course admission counselling
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
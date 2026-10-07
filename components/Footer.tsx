import Link from "next/link";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About us" },
  { href: "/insights", label: "Insights" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <p className="text-xl font-bold text-white">CampusPath</p>
          <p className="mt-3 max-w-xs text-sm">
            College guides for students and parents, with a counsellor a phone
            call away.
          </p>
        </div>

        {/* Page links */}
        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Call to action */}
        <div>
          <h2 className="text-sm font-semibold text-white">Need guidance?</h2>
          <p className="mt-3 text-sm">
            Leave your number and our team will call you back.
          </p>
          <Link
            href="/book-counselling"
            className="mt-4 inline-block rounded-lg bg-go px-4 py-2 text-sm font-semibold text-white hover:bg-go-dark"
          >
            Book counselling
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        &copy; CampusPath. All rights reserved.
      </div>
    </footer>
  );
}
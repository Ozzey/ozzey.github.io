import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/publications", label: "Publications" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/resume", label: "Resume" },
];

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "px-4 py-2 rounded-full text-sm font-semibold transition",
    isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
  ].join(" ");

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition",
    isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
  ].join(" ");

export function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-20 w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-end px-4 py-3 lg:justify-center lg:px-6 lg:py-4">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 py-1 backdrop-blur lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={desktopLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="portfolio-mobile-nav"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div
          id="portfolio-mobile-nav"
          className={[
            "absolute left-4 right-4 top-16 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-xl transition lg:hidden",
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          ].join(" ")}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={mobileLinkClass}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

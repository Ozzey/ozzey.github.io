import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "px-4 py-2 rounded-full text-sm font-semibold transition",
    isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
  ].join(" ");

export function NavMenu() {
  return (
    <header className="fixed top-0 left-0 z-20 w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-6 py-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 py-1 backdrop-blur">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/publications" className={linkClass}>Publications</NavLink>
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          <NavLink to="/blog" className={linkClass}>Blog</NavLink>
          <a
            href="https://ozzey.github.io/"
            className="px-4 py-2 rounded-full text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Resume
          </a>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>
      </nav>
    </header>
  );
}

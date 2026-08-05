import { NavMenu } from "@/components/ui/nav-menu";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavMenu />
      <Outlet />
      <footer className="relative z-10 border-t border-white/10 bg-black px-6 py-8 text-center text-xs text-white/45">
        <span className="font-semibold text-white/60">Aditya Narendra&trade;</span>
        <span className="mx-2 text-white/25">/</span>
        <span>&copy; 2026</span>
      </footer>
    </div>
  );
}

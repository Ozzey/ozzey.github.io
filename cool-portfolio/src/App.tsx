import { NavMenu } from "@/components/ui/nav-menu";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavMenu />
      <Outlet />
    </div>
  );
}

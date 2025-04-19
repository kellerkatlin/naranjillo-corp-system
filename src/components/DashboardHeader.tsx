"use client";

import { usePathname } from "next/navigation";
import { Bell, UserCircle } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
export default function DashboardHeader() {
  const pathname = usePathname();
  const breadcrumbMap: Record<string, string> = {
    sale: "VENTA",
    allsales: "VENTAS",
    registrar: "REGISTRAR",
    registrarcuyes: "REGISTRAR CUYES",
    cuyes: "CUYES",
    reproduccion: "REPRODUCCIÓN",
    monitoreo: "MONITOREO",
    alimentacion: "ALIMENTACIÓN",
    profile: "PERFIL",
  };

  const segments = pathname
    .replace(/^\/dashboard/, "")
    .split("/")
    .filter(Boolean);

  const breadcrumb =
    segments.length > 0
      ? segments
          .map((s) => breadcrumbMap[s] || s.replace(/-/g, " ").toUpperCase())
          .join(" > ")
      : "PRINCIPAL";

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <h2 className="text-sm font-medium text-gray-600 uppercase">
        {breadcrumb}
      </h2>

      <div className="hidden md:flex items-center gap-4">
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="md:flex hidden items-center gap-2">
          <Menubar className="border-none bg-white">
            <MenubarMenu>
              <MenubarTrigger>
                <UserCircle className="w-6 h-6 text-primary" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onClick={() => (window.location.href = "/dashboard/profile")}
                >
                  Profile
                </MenubarItem>
                <MenubarItem onClick={logout}>Logout</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  );
}

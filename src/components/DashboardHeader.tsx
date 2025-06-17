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
import { useMessageStore } from "@/store/messageStore";
import { useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
export default function DashboardHeader() {
  const pathname = usePathname();
  const { messages, fetchMessages } = useMessageStore();

  useEffect(() => {
    fetchMessages();
  }, []);

  const breadcrumbMap: Record<string, string> = {
    sale: "VENTA",
    allsales: "VENTAS",
    registrar: "REGISTRAR",
    registrarcuyes: "REGISTRAR CUYES",
    cuyes: "CUYES",
    reproduccion: "JAVA",
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
        <div className="hidden md:flex items-center gap-4">
          <Menubar className="border-none bg-white">
            <MenubarMenu>
              <MenubarTrigger className="relative cursor-pointer">
                <Bell className="w-5 h-5 text-gray-600" />
                {messages.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </MenubarTrigger>
              <MenubarContent align="end">
                <ScrollArea className="h-60 w-72 p-2">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="border-b py-2 text-sm text-gray-700"
                      >
                        {msg.mensaje}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No hay mensajes
                    </div>
                  )}
                </ScrollArea>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <UserCircle className="w-6 h-6 text-primary" />
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarItem
                  className="cursor-pointer"
                  onClick={() => (window.location.href = "/dashboard/profile")}
                >
                  Profile
                </MenubarItem>
                <MenubarItem className="cursor-pointer" onClick={logout}>
                  Logout
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import SidebarContent from "./SidebarContent";
import { Bell, UserCircle } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";

export default function SidebarMobile() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };
  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };
  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-primary text-white shadow">
        <button onClick={() => setOpen(true)}>
          <IoMenu className="w-6 h-6" />
        </button>
        <div>
          {" "}
          <div className="md:hidden flex items-center gap-4">
            <button className="relative">
              <Bell className="w-5 h-5 text-whites" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex md:hidden items-center gap-2">
              <Menubar className="border-none bg-trasnparent">
                <MenubarMenu>
                  <MenubarTrigger>
                    <UserCircle className="w-6 h-6 text-white" />
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem
                      onClick={() =>
                        (window.location.href = "/dashboard/profile")
                      }
                    >
                      Profile
                    </MenubarItem>
                    <MenubarItem onClick={logout}>Logout</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${
          open && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`w-64 h-full bg-primary text-white py-6 px-2.5 shadow-lg absolute top-0 left-0 transform transition-transform duration-300 ${
            open && !isClosing ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button onClick={handleClose} className="absolute top-4 right-4">
            <IoClose className="w-6 h-6" />
          </button>

          <SidebarContent onLinkClick={handleClose} />
        </aside>
      </div>
    </>
  );
}

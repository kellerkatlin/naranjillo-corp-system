"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const links = [
  { label: "Registrar Cuyes", href: "/dashboard/registrar/registrarcuyes" },
  { label: "Reproducción", href: "/dashboard/registrar/reproduccion" },
  { label: "Alimentación", href: "/dashboard/registrar/alimentacion" },
  { label: "Sanidad", href: "/dashboard/registrar/sanidad" },
];
export default function SidebarRegistrar() {
  const pathname = usePathname();
  return (
    <nav>
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`text-sm rounded-md md:mx-3  px-2 py-1 hover:text-white  hover:bg-primary transition-colors ${
              isActive ? "bg-primary text-white font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

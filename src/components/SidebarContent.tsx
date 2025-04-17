"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBookOpen, FaHouseChimney, FaPaw } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { MdMonitor } from "react-icons/md";

type SidebarContentProps = {
  onLinkClick?: () => void;
};
const links = [
  { label: "Principal", href: "/dashboard", icon: <FaHouseChimney /> },
  {
    label: "Registrar",
    href: "/dashboard/registrar/",
    icon: <FaPaw />,
  },
  { label: "Ventas", href: "/dashboard/sales", icon: "S/. " },
  { label: "Monitoreo", href: "/dashboard/monitoreo", icon: <MdMonitor /> },
  {
    label: "Capacitacion",
    href: "/dashboard/capacitacion",
    icon: <FaBookOpen />,
  },
];

export default function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <nav className="flex flex-col w-full uppercase gap-3 mt-8">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center  justify-between gap-2 p-2 rounded-md hover:bg-white hover:text-black transition-colors ${
                isActive ? "bg-white text-black" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </div>
              <IoIosArrowForward />
            </Link>
          );
        })}
      </nav>
      <section className=" text-gray-700 p-0 mt-8">
        <div className="flex flex-col gap-0 mb-2 text-sm">
          <h3 className="font-bold uppercase text-sm">Naranjillo Corp. SAC</h3>
          <span>Maquinaria</span>
          <span>Agropecuaria</span>
          <span>Servicio</span>
        </div>

        <ul className="text-sm space-y-1">
          <li className="flex">
            <span className="w-16">Correo</span>
            <span>: corpnaranjillo@gmail.com</span>
          </li>
          <li className="flex">
            <span className="w-16 ">Celular</span>
            <span>: 965 569 856</span>
          </li>
          <li className="flex">
            <span className="w-16">Dirección</span>
            <span>: Jr. Pajaten #123</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

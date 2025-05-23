import Sidebar from "@/components/Sidebar";
import "../globals.css";
import DashboardHeader from "@/components/DashboardHeader";
import SidebarMobile from "@/components/SidebarMobile";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="md:pl-72 pl-0 flex flex-col flex-1 w-full bg-gray-100">
        <SidebarMobile />
        <DashboardHeader />

        <main className="p-3 md:p-6 ">{children}</main>
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}

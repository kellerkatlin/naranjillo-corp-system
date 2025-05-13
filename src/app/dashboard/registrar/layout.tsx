import SidebarRegistrar from "@/components/SidebarRegistrar";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <SidebarRegistrar />
      <div className="mt-6 rounded-md shadow bg-white p-2 md:mr-8 md:p-4">
        {children}
      </div>
    </div>
  );
}

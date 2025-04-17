import SidebarRegistrar from "@/components/SidebarRegistrar";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarRegistrar />
      <div className="mt-6 rounded-md shadow bg-white md:mr-8  md:p-4">
        {children}
      </div>
    </div>
  );
}

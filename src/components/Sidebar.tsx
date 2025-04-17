import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-72 h-screen bg-[#f89c0e] text-white p-6 shadow-lg fixed top-0 left-0 z-50">
      <SidebarContent />
    </aside>
  );
}

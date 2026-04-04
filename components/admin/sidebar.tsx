"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Activity, CalendarCheck, X } from "lucide-react";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "List Bookings", href: "/admin/bookings", icon: CalendarCheck },
  ];

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 p-4 border-r dark:border-gray-700 shadow-md z-50 relative">
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Admin Panel
        </h2>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden md:block text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Admin Panel
      </div>

      <nav className="space-y-1">
        {menu.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
              pathname === href
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

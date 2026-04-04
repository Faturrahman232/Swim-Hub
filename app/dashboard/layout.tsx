"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, ClipboardList, UserCircle, LogOut, Menu, ChevronRight, School as Pool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);

    // Check if user is logged in - in a real app, would validate the token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Prevent hydration errors by not rendering anything on the server
  if (!isMounted) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: ClipboardList,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: UserCircle,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar trigger */}
      <div className="md:hidden p-4 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Pool className="h-6 w-6 text-sky-600" />
          <span className="text-xl font-bold text-sky-700 dark:text-sky-400">SwimEase</span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="py-4">
              <div className="flex items-center gap-2 px-4 py-2 mb-8">
                <Pool className="h-6 w-6 text-sky-600" />
                <span className="text-xl font-bold text-sky-700 dark:text-sky-400">SwimEase</span>
              </div>
              
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                  >
                    <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    {item.name}
                  </Link>
                ))}
                
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                >
                  <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  Logout
                </button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div className="flex items-center gap-2 px-6 py-6">
            <Pool className="h-6 w-6 text-sky-600" />
            <span className="text-xl font-bold text-sky-700 dark:text-sky-400">SwimEase</span>
          </div>
          
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  item.href === "/dashboard" 
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  item.href === "/dashboard"
                    ? "text-sky-600 dark:text-sky-500"
                    : "text-gray-500 dark:text-gray-400"
                )} />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
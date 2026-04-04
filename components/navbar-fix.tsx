"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/components/react/lib/utils";
import { Button } from "@/components/react/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/react/components/ui/dropdown-menu";
import { User, ChevronDown, Menu } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
  
    checkAuth();
  
    // Listen perubahan localStorage (misal login/logout di tab lain)
    const onStorageChange = () => {
      checkAuth();
    };
    window.addEventListener("storage", onStorageChange);
  
    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // redirect ke homepage setelah logout
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-swim-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 01-2-2v0a2 2 0 012-2h14a2 2 0 012 2v3M5 14l2-2m5 2l2-2m5 2l2-2"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl text-swim-700">SwimEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-swim-600 transition-colors"
            >
              Home
            </Link>
            {/* Add your Services dropdown here if needed */}
            <Link
              href="/about"
              className="text-gray-600 hover:text-swim-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-swim-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-swim-500 text-swim-600 hover:bg-swim-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="bg-swim-500 hover:bg-swim-600 text-white"
                  >
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <User className="w-5 h-5" />
                    <span>My Account</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-swim-600 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Link
              href="/"
              className="block py-2 text-gray-600 hover:text-swim-600"
            >
              Home
            </Link>
            <Link
              href="/booking"
              className="block py-2 text-gray-600 hover:text-swim-600"
            >
              Book a Session
            </Link>
            <Link
              href="/monitoring"
              className="block py-2 text-gray-600 hover:text-swim-600"
            >
              Pool Monitoring
            </Link>
            <Link
              href="/schedule"
              className="block py-2 text-gray-600 hover:text-swim-600"
            >
              Schedule Check
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-600 hover:text-swim-600"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-600 hover:text-swim-600"
            >
              Contact
            </Link>
            <div className="mt-4 flex flex-col space-y-2">
              {!isLoggedIn ? (
                <>
                  <Link href="/login">
                    <Button className="w-full border-swim-500 text-swim-600 hover:bg-swim-50">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-swim-500 hover:bg-swim-600 text-white">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-gray-600 hover:text-swim-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block py-2 text-gray-600 hover:text-swim-600"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/bookings"
                    className="block py-2 text-gray-600 hover:text-swim-600"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

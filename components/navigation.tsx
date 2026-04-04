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
import { useAuth } from "@/components/auth-context";

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout, loading } = useAuth(); // ✅ pakai context

  const handleLogout = () => {
    logout(); // ✅ pakai fungsi logout dari context
    router.push("/"); // redirect ke homepage setelah logout
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Booking", href: "/booking" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "#footer" },
  ];

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
            {navigationLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-600 hover:text-swim-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!loading &&
              (!isLoggedIn ? (
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
                    <Button className="bg-swim-500 hover:bg-swim-600 text-white">
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
                      <Link href="/my-bookings" className="cursor-pointer">
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
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
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navigationLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block py-2 text-gray-600 hover:text-swim-600"
              >
                {label}
              </Link>
            ))}

            {!loading && (
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
                      href="/my-bookings"
                      className="block py-2 text-gray-600 hover:text-swim-600"
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-600 hover:text-swim-600"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-red-600 hover:text-red-700 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { School as Pool, Calendar, User, Clock, Menu, LogIn } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // This is a placeholder - in a real app, you'd check auth status
  React.useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Pool className="h-6 w-6 text-sky-600" />
            <span className="text-xl font-bold text-sky-700 dark:text-sky-400">SwimEase</span>
          </Link>
          
          <nav className="hidden md:flex ml-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                      <ListItem href="/booking" title="Book a Session" icon={<Calendar className="mr-2 h-4 w-4" />}>
                        Reserve your spot at the pool with our easy booking system
                      </ListItem>
                      <ListItem href="/dashboard" title="Live Monitoring" icon={<Clock className="mr-2 h-4 w-4" />}>
                        Check real-time pool conditions and occupancy
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {isLoggedIn ? (
            <Button asChild variant="ghost" size="icon" className="hidden md:flex">
              <Link href="/dashboard">
                <User className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="hidden md:flex">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Link>
            </Button>
          )}
          
          <Button asChild variant="default" className="hidden md:flex ml-2">
            <Link href="/booking">Book Now</Link>
          </Button>
          
          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                  Home
                </Link>
                <Link href="/booking" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Session
                </Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                  <Clock className="mr-2 h-5 w-5" />
                  Live Monitoring
                </Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                  About
                </Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                  Contact
                </Link>
                
                <div className="border-t mt-4 pt-4">
                  {isLoggedIn ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                      <User className="mr-2 h-5 w-5" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)} className="flex px-4 py-2 hover:bg-muted rounded-md">
                      <LogIn className="mr-2 h-5 w-5" />
                      Log In
                    </Link>
                  )}
                  
                  <Button asChild variant="default" className="w-full mt-4">
                    <Link href="/booking" onClick={() => setIsOpen(false)}>Book Now</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
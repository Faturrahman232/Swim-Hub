/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/components/auth-context";
import Script from "next/script";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwimEase - Swimming Pool Booking",
  description:
    "Book your swimming session easily and monitor pool conditions in real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      {/* The Midtrans Snap.js script has been moved to pages/_document.js */}
      <body className={inter.className}>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900">
              <Navigation />
              <main>{children}</main>
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://unpkg.com/lenis@1.3.4/dist/lenis.min.js"></Script>
      </body>
    </html>
  );
}

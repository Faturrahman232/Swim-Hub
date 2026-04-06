"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/footer";
import {
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  QrCode,
  BadgeAlert,
} from "lucide-react";
import { getCurrentUser } from "@/utils/getCurrentUser";

export const dynamic = "force-dynamic";

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

function ConfirmationContent() {
  const params = useParams();
  const bookingId = params?.id as string;

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        if (!bookingId) {
          router.push("/booking");
          return;
        }

        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking");

        const data = await res.json();

        if (data.user_id !== currentUser.id) {
          router.push("/booking");
          return;
        }

        setBookingDetails(data);
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };

    checkAuth();
  }, [bookingId, router]);

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 dark:text-gray-300">
          Loading booking details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">

            <div className="mb-8 text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 mb-4">
                <BadgeAlert className="h-8 w-8" />
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Booking Confirmed!
              </h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Booking ID: {bookingId}</CardDescription>
              </CardHeader>

              <CardContent>
                <p>Date: {new Date(bookingDetails.booking_date).toLocaleDateString()}</p>
                <p>Guests: {bookingDetails.guests_count}</p>
                <p>Total: {formatIDR(bookingDetails.payment_amount)}</p>
              </CardContent>

              <CardFooter>
                <Button asChild>
                  <Link href="/booking">Back</Link>
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
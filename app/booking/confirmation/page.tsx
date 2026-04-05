"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  CheckCircle,
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  QrCode,
  BadgeAlert,
} from "lucide-react";
import { getCurrentUser } from "@/utils/getCurrentUser";

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  // const bookingId = searchParams.get("id");
  const params = useParams();
  const bookingId = params?.id as string;

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push("/login"); // redirect kalau belum login
      return;
    }
    if (!bookingId) {
      router.push("/booking");
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        if (data.user_id !== currentUser.id) {
          router.push("/booking"); // atau ke "/", atau tampilkan error
          return;
        }
        console.log("[BOOKING_DETAILS]", data);
        setBookingDetails(data);
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };

    fetchBooking();
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
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your swimming session has been successfully booked.
              </p>
            </div>

            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>Booking ID: {bookingId}</CardDescription>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <QrCode className="h-16 w-16 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Date
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(
                          bookingDetails.booking_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Guests
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {bookingDetails.guests_count}{" "}
                        {bookingDetails.guests_count === 1
                          ? "person"
                          : "people"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Location
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        SwimEase Main Pool
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        123 Aqua Lane, Waterville, WA 98765
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Total
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Payment required
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatIDR(bookingDetails.payment_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col md:flex-row gap-4 pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/booking">Back To Booking</Link>
                </Button>
                <Button
                  className="w-full"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        "/api/midtrans/create-transaction",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ booking_id: bookingId }),
                        }
                      );

                      const data = await res.json();

                      if (data.redirect_url) {
                        window.location.href = data.redirect_url; // redirect ke Midtrans
                      } else {
                        alert("Failed to get payment URL");
                      }
                    } catch (err) {
                      console.error("Payment error:", err);
                      alert("Error initiating payment");
                    }
                  }}
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Thank you for choosing SwimEase!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please arrive 15 minutes before your scheduled time. Don’t
                forget to bring your swimwear and a towel.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

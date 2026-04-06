"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { CheckCircle, Calendar, Users, MapPin, QrCode } from "lucide-react";
import { getCurrentUser } from "@/utils/getCurrentUser";

export const dynamic = "force-dynamic";

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id") || "";
  const transactionStatus = searchParams.get("transaction_status");

  const [message, setMessage] = useState("Checking payment status...");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        let bookingId: number | null = null;

        if (/^\d+$/.test(orderId)) {
          bookingId = parseInt(orderId, 10);
        } else {
          const idPart = orderId.split("-")[1];
          bookingId = idPart ? parseInt(idPart, 10) : null;
        }

        if (!bookingId || isNaN(bookingId)) {
          setMessage("Invalid booking ID");
          return;
        }

        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
          setMessage("Unauthorized. Please login.");
          return;
        }

        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking");

        const data = await res.json();

        if (Number(data.user_id) !== Number(currentUser.id)) {
          setMessage("Not authorized");
          setTimeout(() => router.push("/booking"), 2000);
          return;
        }

        setBookingDetails(data);

        if (!hasUpdatedRef.current && transactionStatus) {
          hasUpdatedRef.current = true;

          const updateRes = await fetch("/api/midtrans/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_status: transactionStatus,
              order_id: orderId,
            }),
          });

          const result = await updateRes.json();
          setMessage(result.message || "Status updated");
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load booking details.");
      }
    };

    fetchAndUpdate();
  }, [orderId, transactionStatus, router]);

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">

            <div className="mb-8 text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
                <CheckCircle className="h-8 w-8" />
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Payment Status
              </h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Booking ID: {bookingDetails.id}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p>Date: {new Date(bookingDetails.booking_date).toLocaleDateString()}</p>
                <p>Guests: {bookingDetails.guests_count}</p>
                <p>Total: {formatIDR(bookingDetails.payment_amount)}</p>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/">Back To Dashboard</Link>
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
      <StatusContent />
    </Suspense>
  );
}
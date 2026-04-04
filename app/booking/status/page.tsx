"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function StatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderIdParam = searchParams.get("order_id");
  const [isLoadingUser, setIsLoadingUser] = useState(true); // baru
  const orderId = searchParams.get("order_id") || "";
  const bookingId = orderIdParam ? parseInt(orderIdParam, 10) : null;

  // const bookingId = searchParams.get("booking_id") || "";
  // const bookingId = orderId.split("-")[1]; // from booking-<id>-timestamp
  const transactionStatus = searchParams.get("transaction_status");
  const statusCode = searchParams.get("status_code");

  const [message, setMessage] = useState("Checking payment status...");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const idPart = orderId.split("-")[1];
        let bookingId: number | null = null;
        if (/^\d+$/.test(orderId)) {
          // Hanya angka, berarti order_id adalah bookingId langsung
          bookingId = parseInt(orderId, 10);
        } else {
          // Format booking-72-123456789
          const idPart = orderId.split("-")[1];
          bookingId = idPart ? parseInt(idPart, 10) : null;
        }

        if (!bookingId || isNaN(bookingId)) {
          setMessage("Invalid booking ID");
          return;
        }

        if (isNaN(bookingId)) {
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
          setMessage("You are not authorized to view this booking.");
          setTimeout(() => {
            router.push("/booking"); // atau dashboard
          }, 2000);
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

          const updateResult = await updateRes.json();
          setMessage(updateResult.message || "Status updated");
        }
      } catch (err) {
        console.error("Error:", err);
        setMessage("Failed to load booking details.");
      }
    };

    fetchAndUpdate();
  }, [orderId, transactionStatus, router]);

  // jika user tidak ada dan sudah selesai loading
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
              {/* <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p> */}
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
                      <p className="text-gray-600 dark:text-gray-400">Paid</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatIDR(bookingDetails.payment_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t">
                <Button asChild variant="default" className="w-full">
                  <Link href="/">Back To Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Thank you for choosing SwimEase!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Enjoy your swim and have a great time!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

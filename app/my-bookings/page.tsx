"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/getCurrentUser";

interface Booking {
  booking_id: number;
  booking_date: string;
  guests_count: number;
  booking_status: string;
  payment_status: string;
  payment_id: number;
  invoice_number: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();

      if (!user || !user.email) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/my-bookings`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data booking");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        toast.error("Terjadi kesalahan saat mengambil data booking");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="px-6 py-10">Loading bookings...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You don&apos;t have any bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="p-6 border rounded-lg shadow bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold">
                    Booking #{booking.booking_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {format(new Date(booking.booking_date), "dd MMM yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Guests: {booking.guests_count}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      booking.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.payment_status === "paid"
                      ? "Paid"
                      : "Pending Payment"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                {booking.payment_status === "paid" &&
                  booking.invoice_number && (
                    <Link
                      href={`/invoice/${booking.invoice_number}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      View Invoice
                    </Link>
                  )}

                {booking.payment_status !== "paid" && (
                  <Link
                    href={`/booking/confirmation/${booking.booking_id}`}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                  >
                    Confirm Payment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

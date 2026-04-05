import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface BookingProps {
  id: string;
  date: string;
  time: string;
  guests: number;
  lane: string;
  status: "confirmed" | "pending" | "cancelled";
}

export function UpcomingBookingCard({ booking }: { booking: BookingProps }) {
  const formattedDate = format(parseISO(booking.date), "EEEE, MMM d, yyyy");

  const getStatusColor = (status: BookingProps["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="p-4 border rounded-lg dark:border-gray-800">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Booking #{booking.id}
        </h3>
        <Badge variant="outline" className={getStatusColor(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <CalendarDays className="h-4 w-4 mr-2" />
          {formattedDate}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          {booking.time}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Users className="h-4 w-4 mr-2" />
          {booking.guests} {booking.guests === 1 ? "person" : "people"}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2" />
          {booking.lane}
        </div>
      </div>

      <div className="flex space-x-2 mt-3">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/dashboard/bookings/${booking.id}/reschedule`}>
            Reschedule
          </Link>
        </Button>
      </div>
    </div>
  );
}
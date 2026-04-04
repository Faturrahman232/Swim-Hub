
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookingStatusType = "completed" | "cancelled" | "upcoming" | "unknown";

interface BookingStatusBadgeProps {
  status: BookingStatusType;
  className?: string;
}

const statusConfigs = {
  completed: {
    className: "bg-green-100 text-green-800 hover:bg-green-200",
    label: "Completed"
  },
  cancelled: {
    className: "bg-red-100 text-red-800 hover:bg-red-200",
    label: "Cancelled"
  },
  upcoming: {
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    label: "Upcoming"
  },
  unknown: {
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    label: "Unknown"
  }
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfigs[status] || statusConfigs.unknown;
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export default BookingStatusBadge;

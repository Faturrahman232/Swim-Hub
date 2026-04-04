import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotGridProps {
  timeSlots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (id: string | null) => void;
}

export function TimeSlotGrid({ 
  timeSlots, 
  selectedSlot, 
  onSelectSlot 
}: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {timeSlots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => {
            if (slot.available) {
              onSelectSlot(selectedSlot === slot.id ? null : slot.id);
            }
          }}
          disabled={!slot.available}
          className={cn(
            "p-3 rounded-md border text-left relative transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500",
            slot.available
              ? "hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              : "cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            selectedSlot === slot.id
              ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300"
              : "border-gray-200 dark:border-gray-700"
          )}
        >
          <span className="block text-sm font-medium">
            {slot.time}
          </span>
          
          {selectedSlot === slot.id && (
            <span className="absolute top-2 right-2 text-sky-600 dark:text-sky-400">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          )}
          
          {!slot.available && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
              Fully Booked
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
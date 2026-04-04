"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/react/components/ui/card";
import { Label } from "@/components/react/components/ui/label";
import { Input } from "@/components/react/components/ui/input";
import { Button } from "@/components/react/components/ui/button";
import { Calendar } from "@/components/react/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/react/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/react/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-context"; // gunakan context login lokal

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const PRICE_PER_PERSON = 80000;

const Booking = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleGuestsChange = (value: string) => {
    setGuests(parseInt(value));
  };

  const calculateTotal = () => guests * PRICE_PER_PERSON;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login before booking.",
        variant: "destructive",
      });
      router.push("/login?redirect=/booking");
      return;
    }

    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a booking date.",
        variant: "destructive",
      });
      return;
    }

    if (guests <= 0) {
      toast({
        title: "Invalid Guests",
        description: "Please select at least 1 guest.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ambil user dari server (bukan localStorage)
      const userRes = await fetch("/api/me", { credentials: "include" });
      if (!userRes.ok) {
        throw new Error("Session expired. Please login again.");
      }
      const user = await userRes.json();

      // Kirim booking ke API
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // penting untuk cookie httpOnly
        body: JSON.stringify({
          user_id: user.id,
          booking_date: format(date, "yyyy-MM-dd"),
          guests_count: guests,
          amount: calculateTotal(),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Booking failed");
      }

      const bookingId = result.booking_id;

      toast({
        title: "Booking successful!",
        description: `Your pool session has been booked for ${format(
          date,
          "MMMM dd, yyyy"
        )}`,
      });

      router.push(`/booking/confirmation/${bookingId}`);
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12 px-4 bg-gradient-to-b from-swim-50 to-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Book Your Swimming Session
            </h1>
            <p className="text-gray-600">
              Select your preferred date and number of guests
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Fill in the details for your pool session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Number of Guests</Label>
                  <Select
                    value={String(guests)}
                    onValueChange={handleGuestsChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Price per person:</span>
                    <span>{formatIDR(PRICE_PER_PERSON)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span>Number of guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatIDR(calculateTotal())}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-swim-500 hover:bg-swim-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;

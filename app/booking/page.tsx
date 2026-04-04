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
import { useAuth } from "@/components/auth-context";

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getPricePerPerson = (session: string) => {
  if (session === "fullday") return 70000;
  if (session === "sesi1" || session === "sesi2") return 20000;
  return 0;
};

const getMinGuests = (session: string) => {
  if (session === "fullday") return 30;
  if (session === "sesi1" || session === "sesi2") return 20;
  return 1;
};

const sessionLabel = (key: string) => {
  switch (key) {
    case "sesi1":
      return "Sesi 1 (09.00 - 13.00)";
    case "sesi2":
      return "Sesi 2 (14.00 - 18.00)";
    case "fullday":
      return "Full Day (09.00 - 18.00)";
    default:
      return "";
  }
};

const Booking = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState<number>(1);
  const [session, setSession] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [unavailableSessions, setUnavailableSessions] = useState<string[]>([]);

  useEffect(() => {
    if (!date) return;

    const fetchAvailability = async () => {
      const res = await fetch(
        `/api/bookings/availability?date=${format(date, "yyyy-MM-dd")}`
      );
      const data = await res.json();
      setUnavailableSessions(data.sessions || []);
    };

    fetchAvailability();
  }, [date]);

  const handleGuestsChange = (value: string) => {
    setGuests(parseInt(value));
  };

  const calculateTotal = () => guests * getPricePerPerson(session);

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

    if (!session) {
      toast({
        title: "Session Required",
        description: "Please select a session.",
        variant: "destructive",
      });
      return;
    }

    const minGuests = getMinGuests(session);
    if (guests < minGuests) {
      toast({
        title: "Minimum Guests",
        description: `Minimum ${minGuests} guests required for ${sessionLabel(
          session
        )}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userRes = await fetch("/api/me", { credentials: "include" });
      if (!userRes.ok) throw new Error("Session expired. Please login again.");
      const user = await userRes.json();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id: user.id,
          booking_date: format(date, "yyyy-MM-dd"),
          session,
          guests_count: guests,
          amount: calculateTotal(),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking failed");

      toast({
        title: "Booking successful!",
        description: `Booked ${sessionLabel(session)} on ${format(
          date,
          "PPP"
        )}`,
      });

      router.push(`/booking/confirmation/${result.booking_id}`);
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
              Select your preferred date, session, and number of guests
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
                {/* Tanggal */}
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

                {/* Sesi */}
                <div className="space-y-2">
                  <Label>Select Session</Label>
                  <Select value={session} onValueChange={setSession}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="sesi1"
                        disabled={
                          unavailableSessions.includes("sesi1") ||
                          unavailableSessions.includes("fullday")
                        }
                      >
                        Sesi 1 (09.00 - 13.00)
                      </SelectItem>
                      <SelectItem
                        value="sesi2"
                        disabled={
                          unavailableSessions.includes("sesi2") ||
                          unavailableSessions.includes("fullday")
                        }
                      >
                        Sesi 2 (14.00 - 18.00)
                      </SelectItem>
                      <SelectItem
                        value="fullday"
                        disabled={
                          unavailableSessions.includes("sesi1") ||
                          unavailableSessions.includes("sesi2") ||
                          unavailableSessions.includes("fullday")
                        }
                      >
                        Full Day (09.00 - 18.00)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Guests Selector */}
                <div className="space-y-2">
                  <Label>Number of Guests</Label>
                  <Select
                    value={String(guests)}
                    onValueChange={handleGuestsChange}
                    disabled={!session} // disable jika belum pilih sesi
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !session
                            ? "Please select session first"
                            : "Select number of guests"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(50)].map((_, i) => {
                        const value = i + 1;
                        const minGuests = getMinGuests(session);
                        if (value < minGuests) return null;
                        return (
                          <SelectItem key={value} value={String(value)}>
                            {value} {value === 1 ? "Guest" : "Guests"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Syarat dan Ketentuan */}
                <div className=" bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 space-y-2">
                  <h3 className="font-semibold text-base mb-2">
                    Syarat dan Ketentuan
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Pemesanan <strong>Booking per Sesi</strong>, minimal{" "}
                      <strong>20 orang</strong>
                    </li>
                    <li>
                      Pemesanan <strong>Full Day Booking</strong>, minimal{" "}
                      <strong>30 orang</strong>
                    </li>
                    <li>
                      Jika ingin melakukan <strong>refund</strong>, harap
                      menghubungi admin
                    </li>
                    <li>
                      Masuk dan keluar area kolam renang sesuai waktu yang
                      disepakati
                    </li>
                    <li>
                      Jika melebihi waktu, akan dikenai{" "}
                      <strong>Rp. 20.000/orang</strong>
                    </li>
                    <li>Pertanyaan lebih lanjut? Silakan hubungi admin</li>
                    <li>
                      <strong>Booking per sesi</strong>: Rp. 20.000/orang
                    </li>
                    <li>
                      <strong>Full day</strong>: Rp. 70.000/orang
                    </li>
                  </ul>
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Price per person:</span>
                    <span>{formatIDR(getPricePerPerson(session))}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Selected session:</span>
                    <span>{sessionLabel(session)}</span>
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

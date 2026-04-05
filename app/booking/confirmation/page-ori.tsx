"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/footer";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  Download, 
  Share2, 
  ArrowRight, 
  MapPin,
  CalendarPlus,
  Printer,
  QrCode 
} from "lucide-react";

export default function ConfirmationPage() {
  const [bookingId, setBookingId] = useState("");
  
  useEffect(() => {
    const generateId = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "SE-";
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setBookingId(result);
    };
    
    generateId();
  }, []);
  
  const bookingDetails = {
    date: "April 20, 2025",
    time: "10:00 AM - 11:30 AM",
    guests: 2,
    lane: "Lane 3",
    location: "SwimEase Main Pool",
    address: "123 Aqua Lane, Waterville, WA 98765",
    totalPaid: 30,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            
            <div className="mb-8 text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
                <CheckCircle className="h-8 w-8" />
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your swimming session has been successfully booked
              </p>
            </div>
            
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>
                      Booking ID: {bookingId}
                    </CardDescription>
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
                      <p className="font-medium text-gray-900 dark:text-white">Date</p>
                      <p className="text-gray-600 dark:text-gray-400">{bookingDetails.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Time</p>
                      <p className="text-gray-600 dark:text-gray-400">{bookingDetails.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Guests</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {bookingDetails.guests} {bookingDetails.guests === 1 ? "person" : "people"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-400">{bookingDetails.location}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{bookingDetails.address}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Total Paid</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Payment completed successfully
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${bookingDetails.totalPaid.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 mt-4">
                  <p className="text-gray-700 dark:text-gray-300 text-center">
                    A confirmation email has been sent to your registered email address.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Ticket
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Add to Calendar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

              </CardContent>

              <CardFooter className="flex flex-col md:flex-row gap-4 pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/booking">
                    Book Another Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Thank you for choosing SwimEase!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please arrive 15 minutes before your scheduled time. 
                Don&apos;t forget to bring your swimwear and a towel.
              </p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
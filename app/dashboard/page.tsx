"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  Thermometer,
  Droplets,
  Calendar,
  Bell,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { PoolConditionCard } from "@/components/dashboard/pool-condition-card";
import { UpcomingBookingCard } from "@/components/dashboard/upcoming-booking-card";
import { PoolOccupancyChart } from "@/components/dashboard/pool-occupancy-chart";

export default function DashboardPage() {
  const [occupancy, setOccupancy] = useState(42);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random fluctuation between -5 and +5
      const fluctuation = Math.floor(Math.random() * 11) - 5;
      setOccupancy((prev) => {
        const newValue = prev + fluctuation;
        // Keep within bounds
        return Math.max(10, Math.min(85, newValue));
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getOccupancyStatus = (value: number) => {
    if (value < 30) return { label: "Low", color: "bg-green-500" };
    if (value < 60) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "High", color: "bg-red-500" };
  };

  const occupancyStatus = getOccupancyStatus(occupancy);

  // Mock data for upcoming bookings
  const upcomingBookings = [
    {
      id: "BK-12345",
      date: "2025-04-20",
      time: "10:00 AM - 11:30 AM",
      guests: 2,
      lane: "Lane 3",
      status: "confirmed",
    },
    {
      id: "BK-12346",
      date: "2025-04-25",
      time: "2:00 PM - 3:30 PM",
      guests: 1,
      lane: "Lane 5",
      status: "confirmed",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here&apos;s the current status of our pool facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PoolConditionCard
          title="Current Occupancy"
          icon={<Users className="w-5 h-5" />}
          value={`${occupancy}%`}
          status={occupancyStatus.label}
          statusColor={occupancyStatus.color.replace("bg-", "text-")}
        >
          <div className="mt-3">
            <Progress value={occupancy} className={occupancyStatus.color} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Maximum capacity: 100 people
            </p>
          </div>
        </PoolConditionCard>

        <PoolConditionCard
          title="Water Temperature"
          icon={<Thermometer className="w-5 h-5" />}
          value="27°C"
          status="Optimal"
          statusColor="text-green-500"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Recommended: 26-28°C
          </div>
        </PoolConditionCard>

        <PoolConditionCard
          title="Water Quality"
          icon={<Droplets className="w-5 h-5" />}
          value="Excellent"
          status="Recently Cleaned"
          statusColor="text-green-500"
        >
          <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-500 h-2.5 rounded-full w-[95%]"></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              95%
            </span>
          </div>
        </PoolConditionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pool Occupancy</CardTitle>
              <CardDescription>
                Monitor pool occupancy throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PoolOccupancyChart />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>
                Your scheduled swimming sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <UpcomingBookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No upcoming bookings
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/bookings">
                  View All Bookings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                variant="default"
                className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Scheduled Maintenance</AlertTitle>
                <AlertDescription>
                  Pool will be closed for maintenance on April 22, 2025 from 8
                  PM to 10 PM.
                </AlertDescription>
              </Alert>

              <Alert
                variant="default"
                className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
              >
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Special Promotion</AlertTitle>
                <AlertDescription>
                  Book 3 sessions this month and get 20% off your next booking!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/dashboard/StatCard';
import PoolStats from '@/components/dashboard/PoolStats';

const Dashboard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 'B001',
      date: '2025-05-25',
      time: '10:00 AM - 11:00 AM',
      participants: 2,
      status: 'confirmed'
    },
    {
      id: 'B002',
      date: '2025-06-01',
      time: '3:00 PM - 4:00 PM',
      participants: 1,
      status: 'pending'
    },
    {
      id: 'B003',
      date: '2025-06-10',
      time: '9:00 AM - 10:00 AM',
      participants: 3,
      status: 'confirmed'
    },
  ]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-swim-50/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Welcome, Sarah!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Upcoming Bookings" 
              value="3"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              description="for this month"
            />
            <StatCard 
              title="Total Visits" 
              value="24"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              trend={{ value: 12, isPositive: true }}
              description="vs last month"
            />
            <StatCard 
              title="Pool Occupancy" 
              value="62%"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              description="current"
            />
            <StatCard 
              title="Water Quality" 
              value="95%"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              description="excellent"
            />
          </div>
          
          <Tabs defaultValue="upcomingBookings" className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="upcomingBookings">Upcoming Bookings</TabsTrigger>
              <TabsTrigger value="poolStatus">Pool Status</TabsTrigger>
            </TabsList>
            <TabsContent value="upcomingBookings" className="space-y-4">
              <h2 className="text-2xl font-bold">Your Upcoming Bookings</h2>
              {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                        <CardDescription>{formatDate(booking.date)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time</span>
                            <span className="font-medium">{booking.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Participants</span>
                            <span className="font-medium">{booking.participants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                          {booking.status !== 'cancelled' && (
                            <Button variant="destructive" size="sm" className="flex-1">Cancel</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center">
                    <p className="text-gray-500 mb-4">You don't have any upcoming bookings.</p>
                    <Button className="bg-swim-500 hover:bg-swim-600">Book a Session</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="poolStatus">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PoolStats 
                  occupancy={62}
                  waterQuality={95}
                  temperature={27}
                  status="open"
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pool Schedule Today</CardTitle>
                    <CardDescription>May 18, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                        <div>
                          <span className="font-medium">6:00 AM - 8:00 AM</span>
                          <p className="text-sm text-gray-600">Early Bird Swim</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Open</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-amber-50 rounded-md">
                        <div>
                          <span className="font-medium">8:00 AM - 9:00 AM</span>
                          <p className="text-sm text-gray-600">Maintenance</p>
                        </div>
                        <span className="text-amber-600 text-sm font-medium">Limited</span>
                      </li>
                      <li className="flex justify-between items-center p-2 rounded-md">
                        <div>
                          <span className="font-medium">9:00 AM - 12:00 PM</span>
                          <p className="text-sm text-gray-600">Open Swim</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Open</span>
                      </li>
                      <li className="flex justify-between items-center p-2 rounded-md">
                        <div>
                          <span className="font-medium">12:00 PM - 3:00 PM</span>
                          <p className="text-sm text-gray-600">Swimming Lessons</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Open</span>
                      </li>
                      <li className="flex justify-between items-center p-2 rounded-md">
                        <div>
                          <span className="font-medium">3:00 PM - 8:00 PM</span>
                          <p className="text-sm text-gray-600">Open Swim</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Open</span>
                      </li>
                      <li className="flex justify-between items-center p-2 rounded-md">
                        <div>
                          <span className="font-medium">8:00 PM - 10:00 PM</span>
                          <p className="text-sm text-gray-600">Adult Swim</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Open</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button className="bg-swim-500 hover:bg-swim-600 h-auto py-4 flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Book a Session</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>View Invoices</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Booking History</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Update Profile</span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4 border-l-2 border-swim-500 pl-4">
                  <div>
                    <div className="font-medium">Pool Maintenance Complete</div>
                    <p className="text-sm text-gray-600">Our monthly maintenance was completed. The water quality is excellent.</p>
                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 border-l-2 border-swim-500 pl-4">
                  <div>
                    <div className="font-medium">Summer Schedule Available</div>
                    <p className="text-sm text-gray-600">Check out our new summer hours and special events starting June 1st!</p>
                    <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 border-l-2 border-swim-500 pl-4">
                  <div>
                    <div className="font-medium">Swimming Lessons Registration</div>
                    <p className="text-sm text-gray-600">Registration for summer swimming lessons is now open. Reserve your spot!</p>
                    <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

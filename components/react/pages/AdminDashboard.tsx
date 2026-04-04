
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Calendar,
  Users,
  Thermometer,
  History,
  ChartBar,
  FileText,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PoolStats from "@/components/dashboard/PoolStats";
import StatCard from "@/components/dashboard/StatCard";
import BookingStatusBadge from "@/components/ui/booking-status-badge";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const bookings = [
    {
      id: "B123",
      name: "Sarah Johnson",
      date: "May 15, 2025",
      guests: 2,
      amount: "$25.00",
      status: "completed"
    },
    {
      id: "B124",
      name: "Mike Anderson",
      date: "May 16, 2025",
      guests: 1,
      amount: "$12.50",
      status: "upcoming"
    },
    {
      id: "B125",
      name: "Rachel Lee",
      date: "May 16, 2025",
      guests: 4,
      amount: "$50.00",
      status: "upcoming"
    },
    {
      id: "B126",
      name: "David Wilson",
      date: "May 14, 2025",
      guests: 2,
      amount: "$25.00",
      status: "cancelled"
    },
    {
      id: "B127",
      name: "Emma Davis",
      date: "May 17, 2025",
      guests: 3,
      amount: "$37.50",
      status: "upcoming"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="h-20 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-swim-600">SwimEase Admin</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "overview" ? "bg-swim-50 text-swim-700" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Activity className="mr-3" size={18} />
              Overview
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "bookings" ? "bg-swim-50 text-swim-700" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <Calendar className="mr-3" size={18} />
              Bookings
            </Button>
            <Button
              variant="ghost" 
              className={`w-full justify-start ${activeTab === "users" ? "bg-swim-50 text-swim-700" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-3" size={18} />
              Users
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "pool" ? "bg-swim-50 text-swim-700" : ""}`}
              onClick={() => setActiveTab("pool")}
            >
              <Thermometer className="mr-3" size={18} />
              Pool Status
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "reports" ? "bg-swim-50 text-swim-700" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="mr-3" size={18} />
              Reports
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "settings" ? "bg-swim-50 text-swim-700" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-3" size={18} />
              Settings
            </Button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate("/")}
          >
            Back to Site
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "bookings" && "Manage Bookings"}
              {activeTab === "users" && "User Management"}
              {activeTab === "pool" && "Pool Status"}
              {activeTab === "reports" && "Reports"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <div className="md:hidden">
              {/* Mobile menu button */}
              <Button variant="ghost">
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="md:hidden grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="pool">Pool</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Bookings"
                  value="128"
                  icon={<Calendar />}
                  trend={{ value: 12, isPositive: true }}
                  description="from last month"
                />
                <StatCard
                  title="Active Users"
                  value="96"
                  icon={<Users />}
                  trend={{ value: 8, isPositive: true }}
                  description="from last month"
                />
                <StatCard
                  title="Today's Revenue"
                  value="$342.50"
                  icon={<ChartBar />}
                  trend={{ value: 5, isPositive: true }}
                  description="from yesterday"
                />
                <StatCard
                  title="Avg. Daily Visitors"
                  value="42"
                  icon={<Activity />}
                  trend={{ value: 3, isPositive: false }}
                  description="from last week"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest 5 bookings across the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-3 font-medium">ID</th>
                            <th className="pb-3 font-medium">Name</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Guests</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b last:border-0">
                              <td className="py-3">{booking.id}</td>
                              <td className="py-3">{booking.name}</td>
                              <td className="py-3">{booking.date}</td>
                              <td className="py-3">{booking.guests}</td>
                              <td className="py-3">{booking.amount}</td>
                              <td className="py-3">
                                <BookingStatusBadge status={booking.status as any} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("bookings")}>
                        View all bookings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <PoolStats
                  occupancy={42}
                  waterQuality={92}
                  temperature={27}
                  status="open"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                  <CardDescription>Manage all customer bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 font-medium">ID</th>
                          <th className="pb-3 font-medium">Name</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Guests</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 10 }, (_, i) => ({
                          id: `B${123 + i}`,
                          name: ["Sarah Johnson", "Mike Anderson", "Rachel Lee", "David Wilson", "Emma Davis"][i % 5],
                          date: `May ${15 + i % 10}, 2025`,
                          guests: [1, 2, 2, 3, 4, 2][i % 6],
                          amount: `$${(12.5 * ([1, 2, 2, 3, 4, 2][i % 6])).toFixed(2)}`,
                          status: ["completed", "upcoming", "upcoming", "cancelled", "completed"][i % 5]
                        })).map((booking) => (
                          <tr key={booking.id} className="border-b last:border-0">
                            <td className="py-3">{booking.id}</td>
                            <td className="py-3">{booking.name}</td>
                            <td className="py-3">{booking.date}</td>
                            <td className="py-3">{booking.guests}</td>
                            <td className="py-3">{booking.amount}</td>
                            <td className="py-3">
                              <BookingStatusBadge status={booking.status as any} />
                            </td>
                            <td className="py-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">View</Button>
                                <Button size="sm" variant="outline" className="text-red-600">Cancel</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pool">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PoolStats 
                  occupancy={42}
                  waterQuality={92}
                  temperature={27}
                  status="open"
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pool Settings</CardTitle>
                    <CardDescription>Control pool availability and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pool Status</label>
                        <select className="w-full p-2 border rounded">
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="limited">Limited Access</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Occupancy</label>
                        <input type="number" className="w-full p-2 border rounded" defaultValue="100" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Next Maintenance Date</label>
                      <input type="date" className="w-full p-2 border rounded" defaultValue="2025-05-25" />
                    </div>
                    <div>
                      <Button>Update Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 font-medium">Name</th>
                          <th className="pb-3 font-medium">Email</th>
                          <th className="pb-3 font-medium">Join Date</th>
                          <th className="pb-3 font-medium">Bookings</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Sarah Johnson", email: "sarah@example.com", joinDate: "Jan 15, 2025", bookings: 5 },
                          { name: "Mike Anderson", email: "mike@example.com", joinDate: "Feb 3, 2025", bookings: 2 },
                          { name: "Rachel Lee", email: "rachel@example.com", joinDate: "Mar 21, 2025", bookings: 8 },
                          { name: "David Wilson", email: "david@example.com", joinDate: "Apr 7, 2025", bookings: 1 },
                          { name: "Emma Davis", email: "emma@example.com", joinDate: "May 2, 2025", bookings: 3 }
                        ].map((user, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="py-3">{user.name}</td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3">{user.joinDate}</td>
                            <td className="py-3">{user.bookings}</td>
                            <td className="py-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">View</Button>
                                <Button size="sm" variant="outline" className="text-red-600">Block</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>View and export pool usage and booking data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">$4,285</div>
                          <p className="text-muted-foreground text-sm">Total Revenue (May)</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">342</div>
                          <p className="text-muted-foreground text-sm">Total Bookings (May)</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">87%</div>
                          <p className="text-muted-foreground text-sm">Capacity Utilization</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Available Reports</h3>
                        <div className="space-y-2">
                          <div className="p-3 border rounded flex justify-between items-center">
                            <span>Daily Occupancy Report</span>
                            <Button>Export</Button>
                          </div>
                          <div className="p-3 border rounded flex justify-between items-center">
                            <span>Monthly Revenue Report</span>
                            <Button>Export</Button>
                          </div>
                          <div className="p-3 border rounded flex justify-between items-center">
                            <span>User Activity Report</span>
                            <Button>Export</Button>
                          </div>
                          <div className="p-3 border rounded flex justify-between items-center">
                            <span>Maintenance Log</span>
                            <Button>Export</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure application settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Booking Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Base Price per Guest</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                          <input type="text" className="w-full p-2 pl-8 border rounded" defaultValue="12.50" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Service Fee</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                          <input type="text" className="w-full p-2 pl-8 border rounded" defaultValue="2.50" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Maximum Guests per Booking</label>
                        <input type="number" className="w-full p-2 border rounded" defaultValue="6" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Advance Booking Days</label>
                        <input type="number" className="w-full p-2 border rounded" defaultValue="30" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input type="checkbox" id="email-new-booking" className="rounded mr-2" defaultChecked />
                        <label htmlFor="email-new-booking">Email notifications for new bookings</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="email-cancel" className="rounded mr-2" defaultChecked />
                        <label htmlFor="email-cancel">Email notifications for cancelled bookings</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="email-system" className="rounded mr-2" defaultChecked />
                        <label htmlFor="email-system">System alerts</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/react/components/layout/Navbar';
import Footer from '@/components/react/components/layout/Footer';
import BookingStatusBadge from '@/components/react/components/ui/booking-status-badge';
import { supabase } from '@/components/react/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  full_name: string | null;
  email: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate booking data
  const bookings = [
    {
      id: "B123",
      date: "May 15, 2025",
      guests: 2,
      amount: "$25.00",
      status: "completed"
    },
    {
      id: "B124",
      date: "May 23, 2025",
      guests: 1,
      amount: "$12.50",
      status: "upcoming"
    },
    {
      id: "B125",
      date: "May 10, 2025",
      guests: 3,
      amount: "$37.50",
      status: "cancelled"
    }
  ];

  const stats = {
    totalBookings: 12,
    totalSpent: "$275.00",
    averageGuestCount: 2.5,
    cancelledBookings: 2,
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is logged in
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          navigate('/login?redirect=/profile');
          return;
        }
        
        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setUser({
            id: authUser.id,
            full_name: data.full_name,
            email: authUser.email || ''
          });
          
          setFormData({
            ...formData,
            fullName: data.full_name || '',
            email: authUser.email || ''
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user?.id) {
        throw new Error("User ID is undefined");
      }

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: formData.fullName })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Update local user state
      setUser(prev => prev ? ({
        ...prev,
        full_name: formData.fullName
      }) : null);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Form validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 bg-gradient-to-b from-swim-50 to-white">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-swim-500 border-r-transparent align-[-0.125em]" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-gray-500">Loading profile...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Profile</h1>
                  <p className="text-gray-600 mt-1">Manage your account information and view booking stats</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 md:mt-0"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                  }}
                >
                  Sign Out
                </Button>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                <div className="bg-swim-500 text-white p-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-swim-500 text-2xl font-bold">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold">{user?.full_name || 'User'}</h2>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    <Badge className="bg-white text-swim-600">Regular Member</Badge>
                  </div>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <form onSubmit={handleProfileUpdate}>
                        <CardHeader>
                          <CardTitle>Personal Information</CardTitle>
                          <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input 
                              id="fullName" 
                              name="fullName" 
                              value={formData.fullName} 
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              name="email" 
                              value={formData.email} 
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-muted-foreground">
                              Email cannot be changed. Contact support for assistance.
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            type="submit" 
                            className="bg-swim-500 hover:bg-swim-600"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </span>
                            ) : "Save Changes"}
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Booking Statistics</CardTitle>
                        <CardDescription>Your activity summary</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Bookings</span>
                          <span className="font-semibold">{stats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Spent</span>
                          <span className="font-semibold">{stats.totalSpent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg. Group Size</span>
                          <span className="font-semibold">{stats.averageGuestCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cancelled Bookings</span>
                          <span className="font-semibold">{stats.cancelledBookings}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>Your last 3 swimming pool bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="py-3 font-medium">ID</th>
                              <th className="py-3 font-medium">Date</th>
                              <th className="py-3 font-medium">Guests</th>
                              <th className="py-3 font-medium">Amount</th>
                              <th className="py-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr key={booking.id} className="border-b">
                                <td className="py-4">{booking.id}</td>
                                <td className="py-4">{booking.date}</td>
                                <td className="py-4">{booking.guests}</td>
                                <td className="py-4">{booking.amount}</td>
                                <td className="py-4">
                                  <BookingStatusBadge status={booking.status as any} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/bookings')}
                      >
                        View All Bookings
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <form onSubmit={handlePasswordChange}>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input 
                            id="currentPassword" 
                            name="currentPassword"
                            type="password" 
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input 
                            id="newPassword" 
                            name="newPassword"
                            type="password" 
                            value={formData.newPassword}
                            onChange={handleInputChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            Password must be at least 6 characters long
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword" 
                            name="confirmPassword"
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit"
                          className="bg-swim-500 hover:bg-swim-600"
                          disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </span>
                          ) : "Update Password"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookingStatusBadge from "@/components/react/components/ui/booking-status-badge";
import Navbar from '@/components/react/components/layout/Navbar';
import Footer from '@/components/react/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/components/react/integrations/supabase/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  booking_date: string;
  guests: number;
  amount: number;
  status: string;
  created_at: string;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Redirect to login if not authenticated
          navigate('/login?redirect=/bookings');
          return;
        }
        
        // Fetch bookings from Supabase
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('booking_date', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setBookings(data as Booking[]);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch booking history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, toast]);

  const handleDownloadInvoice = (bookingId: string) => {
    navigate(`/invoice?id=${bookingId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 bg-gradient-to-b from-swim-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Your Booking History</h1>
          <p className="text-gray-600 mb-8">View and manage your past and upcoming bookings</p>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                A complete history of your swimming pool bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-swim-500 border-r-transparent align-[-0.125em]" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2 text-gray-500">Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any bookings yet.</p>
                  <Button 
                    onClick={() => navigate('/booking')}
                    className="mt-4 bg-swim-500 hover:bg-swim-600"
                  >
                    Book a Session
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 font-medium">Date</th>
                        <th className="py-3 font-medium">Guests</th>
                        <th className="py-3 font-medium">Amount</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-4">
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </td>
                          <td className="py-4">{booking.guests}</td>
                          <td className="py-4">${booking.amount.toFixed(2)}</td>
                          <td className="py-4">
                            <BookingStatusBadge status={booking.status as any} />
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadInvoice(booking.id)}
                              >
                                View Invoice
                              </Button>
                              
                              {booking.status === 'upcoming' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/booking')} 
              className="bg-swim-500 hover:bg-swim-600"
            >
              Book New Session
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingHistory;

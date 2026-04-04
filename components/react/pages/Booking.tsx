
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PRICE_PER_PERSON = 10.00; // Base price per person

const Booking = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGuestsChange = (value: string) => {
    setGuests(parseInt(value));
  };

  const calculateTotal = () => {
    return guests * PRICE_PER_PERSON;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in before booking a session",
          variant: "destructive",
        });
        navigate('/login?redirect=/booking');
        return;
      }
      
      if (!date) {
        toast({
          title: "Date required",
          description: "Please select a date for your booking",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Format booking date as string for Supabase
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Calculate total amount
      const amount = calculateTotal();
      
      // Create booking in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          booking_date: formattedDate,
          guests: guests,
          amount: amount,
          status: 'upcoming'
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Booking successful!",
        description: `Your pool session has been booked for ${format(date, 'MMMM dd, yyyy')}`,
      });
      
      // Redirect to payment page
      navigate('/payment');
      
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 bg-gradient-to-b from-swim-50 to-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Your Swimming Session</h1>
            <p className="text-gray-600">Select your preferred date and number of guests</p>
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
                  <Label htmlFor="date">Select Date</Label>
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
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select value={String(guests)} onValueChange={handleGuestsChange}>
                    <SelectTrigger id="guests">
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Price per person:</span>
                    <span>${PRICE_PER_PERSON.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span>Number of guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-swim-500 hover:bg-swim-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
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

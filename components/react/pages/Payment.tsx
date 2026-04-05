
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/react/components/layout/Navbar';
import Footer from '@/components/react/components/layout/Footer';
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Mock booking details (would come from previous page or context in real app)
  const bookingDetails = {
    date: "Monday, May 19th, 2025",
    time: "10:00 AM - 11:00 AM",
    guests: 2,
    subtotal: 25.00,
    fee: 2.50,
    total: 27.50,
    booking_id: "SWIM-" + Math.floor(10000 + Math.random() * 90000)
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful!",
        description: "Your booking has been confirmed.",
      });
      
      // In a real app, this would navigate to the confirmation/invoice page
      window.location.href = "/invoice";
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-swim-50/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Payment</h1>
            <p className="text-gray-600 mb-8">Complete your booking by making a payment</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select how you would like to pay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Credit/Debit Card</span>
                            <div className="flex space-x-1">
                              <div className="w-8 h-5 bg-blue-600 rounded"></div>
                              <div className="w-8 h-5 bg-red-500 rounded"></div>
                              <div className="w-8 h-5 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">PayPal</span>
                            <div className="text-blue-600 font-bold">
                              PayPal
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Bank Transfer</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="qr-code" id="qr-code" />
                        <Label htmlFor="qr-code" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">QR Code Payment</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === 'credit-card' && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-name">Name on Card</Label>
                          <Input id="card-name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'paypal' && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-md text-center">
                        <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                      </div>
                    )}
                    
                    {paymentMethod === 'bank-transfer' && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <h3 className="font-medium mb-2">Bank Transfer Details</h3>
                        <p className="text-sm mb-1"><span className="font-medium">Bank:</span> SwimEase Bank</p>
                        <p className="text-sm mb-1"><span className="font-medium">Account Name:</span> SwimEase Pool Services</p>
                        <p className="text-sm mb-1"><span className="font-medium">Account Number:</span> 1234567890</p>
                        <p className="text-sm mb-1"><span className="font-medium">Reference:</span> {bookingDetails.booking_id}</p>
                        <p className="mt-3 text-sm text-gray-600">
                          Please use your booking ID as the payment reference. Your booking will be confirmed once payment is received.
                        </p>
                      </div>
                    )}
                    
                    {paymentMethod === 'qr-code' && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-md flex flex-col items-center">
                        <div className="w-48 h-48 bg-white p-2 border border-gray-200 mb-4">
                          <div className="w-full h-full bg-gray-800 grid grid-cols-7 grid-rows-7 gap-0.5">
                            {/* This is a mock QR code */}
                            {Array(49).fill(0).map((_, i) => (
                              <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Scan this QR code with your mobile banking app or payment app to complete the payment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Date</div>
                        <div>{bookingDetails.date}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Time</div>
                        <div>{bookingDetails.time}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Guests</div>
                        <div>{bookingDetails.guests}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Booking ID</div>
                        <div>{bookingDetails.booking_id}</div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Subtotal</span>
                          <span>${bookingDetails.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Service Fee</span>
                          <span>${bookingDetails.fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-base pt-2 border-t">
                          <span>Total</span>
                          <span>${bookingDetails.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-swim-500 hover:bg-swim-600"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Pay $${bookingDetails.total.toFixed(2)}`
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="mt-6">
                  <Link to="/booking">
                    <Button variant="outline" className="w-full">
                      Back to Booking
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;

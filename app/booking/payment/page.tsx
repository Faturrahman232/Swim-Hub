"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/footer";
import { QrCode, CreditCard, Wallet, ArrowRight, CalendarDays, Users, Clock, CheckCircle } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [processing, setProcessing] = useState(false);
  
  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      router.push("/booking/confirmation");
    }, 2000);
  };
  
  // This would come from context or state management in a real app
  const bookingDetails = {
    date: "April 20, 2025",
    time: "10:00 AM - 11:30 AM",
    guests: 2,
    basePrice: 15,
    totalPrice: 30,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Details</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your booking by selecting a payment method
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment option
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className={cn(
                        "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all",
                        paymentMethod === 'qr' ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}>
                        <RadioGroupItem value="qr" id="qr" className="sr-only" />
                        <Label htmlFor="qr" className="flex-1 cursor-pointer flex items-center">
                          <QrCode className="h-5 w-5 mr-3 text-sky-600 dark:text-sky-400" />
                          <div>
                            <div className="font-medium">QR Code Payment</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Scan the QR code for a quick payment</div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all",
                        paymentMethod === 'card' ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}>
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center">
                          <CreditCard className="h-5 w-5 mr-3 text-sky-600 dark:text-sky-400" />
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Pay securely with your card</div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all",
                        paymentMethod === 'wallet' ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}>
                        <RadioGroupItem value="wallet" id="wallet" className="sr-only" />
                        <Label htmlFor="wallet" className="flex-1 cursor-pointer flex items-center">
                          <Wallet className="h-5 w-5 mr-3 text-sky-600 dark:text-sky-400" />
                          <div>
                            <div className="font-medium">Digital Wallet</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Pay with your preferred digital wallet</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === "qr" && (
                      <div className="mt-6 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                          {/* Placeholder for QR code - in a real app this would be a dynamic QR code */}
                          <div className="w-64 h-64 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=SwimEase-Payment-12345')] bg-no-repeat bg-center bg-contain"></div>
                        </div>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          Scan this QR code with your mobile banking app to complete the payment
                        </p>
                      </div>
                    )}
                    
                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "wallet" && (
                      <div className="mt-6 space-y-4">
                        <Button className="w-full" variant="outline">
                          Connect Wallet
                        </Button>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          You'll be redirected to your wallet provider to complete the payment
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handlePayment}
                      disabled={processing}
                    >
                      {processing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Pay ${bookingDetails.totalPrice.toFixed(2)}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="order-1 md:order-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                    <CardDescription>
                      Review your booking details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <CalendarDays className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Date</p>
                        <p className="text-gray-600 dark:text-gray-400">{bookingDetails.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Time</p>
                        <p className="text-gray-600 dark:text-gray-400">{bookingDetails.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Guests</p>
                        <p className="text-gray-600 dark:text-gray-400">{bookingDetails.guests} {bookingDetails.guests === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Pool entry fee</span>
                        <span>${bookingDetails.basePrice.toFixed(2)} x {bookingDetails.guests}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Facility fee</span>
                        <span>$0.00</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Booking fee</span>
                        <span>$0.00</span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${bookingDetails.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Cancellation Policy</p>
                        <p>Free cancellation up to 24 hours before your booking time.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Helper function for conditional styling
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
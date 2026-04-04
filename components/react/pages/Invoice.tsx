
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Invoice = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Mock invoice data (would come from API in real app)
  const invoice = {
    number: "INV-2025-0527",
    date: "May 19, 2025",
    dueDate: "May 19, 2025",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Anytown, CA 12345"
    },
    booking: {
      id: "SWIM-86421",
      date: "May 25, 2025",
      time: "10:00 AM - 11:00 AM",
      participants: 2
    },
    items: [
      {
        description: "Swimming Pool Entry",
        quantity: 2,
        unitPrice: 12.50,
        total: 25.00
      }
    ],
    subtotal: 25.00,
    serviceFee: 2.50,
    total: 27.50,
    paymentStatus: "Paid",
    paymentDate: "May 19, 2025",
    paymentMethod: "Credit Card"
  };

  // Function to download invoice as PDF (mock function)
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      alert("Download complete! (In a real app, this would download a PDF)");
    }, 2000);
  };

  // Function to print invoice
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <div className="flex-1 bg-swim-50/30 print:bg-white py-12 print:py-0">
        <div className="container mx-auto px-4 print:px-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8 print:hidden">
              <div>
                <h1 className="text-3xl font-bold">Invoice</h1>
                <p className="text-gray-600">Your booking has been confirmed!</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handlePrint}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
                <Button className="bg-swim-500 hover:bg-swim-600" onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Card className="shadow-lg border-t-4 border-t-swim-500 print:shadow-none print:border-none">
              <CardHeader className="print:pb-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex items-center space-x-3 mb-6 md:mb-0">
                    <div className="w-12 h-12 bg-swim-500 rounded-full flex items-center justify-center print:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 01-2-2v0a2 2 0 012-2h14a2 2 0 012 2v3M5 14l2-2m5 2l2-2m5 2l2-2" />
                      </svg>
                    </div>
                    <div className="print:pl-0">
                      <div className="text-2xl font-bold text-swim-700">SwimEase</div>
                      <p className="text-sm text-gray-600">123 Pool Street, Anytown, CA 12345</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-xl mb-1">Invoice #{invoice.number}</CardTitle>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Issue Date: {invoice.date}</p>
                      <p>Due Date: {invoice.dueDate}</p>
                      <p className="flex items-center justify-end">
                        Status: 
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {invoice.paymentStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Bill To</h3>
                    <div className="space-y-1">
                      <p className="font-medium">{invoice.customer.name}</p>
                      <p className="text-sm text-gray-600">{invoice.customer.email}</p>
                      <p className="text-sm text-gray-600">{invoice.customer.phone}</p>
                      <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Details</h3>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Booking ID:</span> {invoice.booking.id}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Date:</span> {invoice.booking.date}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Time:</span> {invoice.booking.time}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Participants:</span> {invoice.booking.participants}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Quantity</th>
                          <th className="px-4 py-3">Unit Price</th>
                          <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {invoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4">{item.description}</td>
                            <td className="px-4 py-4">{item.quantity}</td>
                            <td className="px-4 py-4">${item.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-4 text-right">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal</span>
                      <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Service Fee</span>
                      <span>${invoice.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                      <span>Total</span>
                      <span>${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                      <p>{invoice.paymentMethod}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Date</h4>
                      <p>{invoice.paymentDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {invoice.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 print:hidden">
                  <h3 className="text-lg font-medium mb-4">Notes</h3>
                  <p className="text-sm text-gray-600">
                    Thank you for your business! If you have any questions about this invoice, please contact us at 
                    <a href="mailto:support@swimease.com" className="text-swim-600 hover:text-swim-800"> support@swimease.com</a> or 
                    call us at <a href="tel:+15551234567" className="text-swim-600 hover:text-swim-800">+1 (555) 123-4567</a>.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500 print:border-t-0">
                  <p>&copy; 2025 SwimEase. All rights reserved.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center print:hidden">
              <Link to="/dashboard">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Invoice;

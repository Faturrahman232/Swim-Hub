
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Gradient Background instead of image */}
        <section className="relative">
          <div className="bg-gradient-to-br from-swim-50 via-swim-100 to-swim-300 w-full pt-20 pb-32">
            <div className="container mx-auto px-4">
              <div className="flex flex-col max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-swim-900 mb-6">
                  Dive into Convenience with SwimEase
                </h1>
                <p className="text-xl text-swim-700 mb-10">
                  Book your swimming sessions online, check pool availability, and enjoy a hassle-free swimming experience.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild className="bg-swim-600 hover:bg-swim-700 text-white px-6 py-3 text-lg">
                    <Link to="/booking">Book Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-swim-600 text-swim-600 hover:bg-swim-50 px-6 py-3 text-lg">
                    <Link to="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SwimEase?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-t-swim-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-swim-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swim-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Easy Online Booking
                  </CardTitle>
                  <CardDescription>Book your swimming sessions with just a few clicks</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Skip the queues and book your swimming slots in advance. Choose your date and number of guests, and you're all set for a refreshing swim.</p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-swim-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-swim-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swim-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </span>
                    Real-time Monitoring
                  </CardTitle>
                  <CardDescription>Check pool status and availability in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Get live updates on pool conditions, including occupancy levels, cleanliness status, and operational hours before your visit.</p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-swim-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-swim-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swim-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </span>
                    Digital Receipts
                  </CardTitle>
                  <CardDescription>Get instant access to your booking receipts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Receive digital invoices for all your bookings. Easy to download, print, or share as needed for your records.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-swim-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-1">
                      <p className="font-semibold">Alex Johnson</p>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"SwimEase has made my weekly swimming routine so much easier. I can quickly book slots and check how busy the pool is before heading out."</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-1">
                      <p className="font-semibold">Sarah Williams</p>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"As a parent of three kids, I love being able to book our swimming sessions in advance. The digital receipts make it easy to keep track of our expenses too."</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-1">
                      <p className="font-semibold">Michael Chen</p>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"I appreciate knowing the pool conditions before I arrive. The real-time updates on water quality and pool occupancy are really helpful."</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild className="bg-swim-500 hover:bg-swim-600">
                <Link to="/register">Join SwimEase Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

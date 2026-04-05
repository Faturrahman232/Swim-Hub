
import Navbar from '@/components/react/components/layout/Navbar';
// import Navbar from '@/components/react/components/layout/Navbar';
import Footer from '@/components/react/components/layout/Footer';
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-swim-50 via-swim-100 to-swim-300 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-swim-900 mb-4">About SwimEase</h1>
            <p className="text-xl text-swim-700 max-w-3xl mx-auto">
              We're dedicated to making swimming pool experiences simple, convenient, and enjoyable for everyone.
            </p>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-700 mb-6">
                  SwimEase was founded in 2022 by a team of swimming enthusiasts who were frustrated with the 
                  traditional booking systems used by most swimming pools. We believed there had to be a better way.
                </p>
                <p className="text-gray-700 mb-6">
                  Our mission is simple: to make swimming pool access easier and more convenient for everyone.
                  We've designed our platform to eliminate queues, reduce waiting times, and provide real-time 
                  information about pool conditions.
                </p>
                <p className="text-gray-700">
                  Today, SwimEase is used by thousands of swimmers across the country, and we're continuously 
                  improving our service based on user feedback and technological advancements.
                </p>
              </div>
              <div className="bg-gradient-to-br from-swim-200 to-swim-400 rounded-lg h-64 md:h-full flex items-center justify-center text-white">
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 01-2-2v0a2 2 0 012-2h14a2 2 0 012 2v3M5 14l2-2m5 2l2-2m5 2l2-2" />
                  </svg>
                  <p className="text-2xl font-bold">Founded in 2022</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-t-swim-500">
                <CardContent className="pt-6">
                  <div className="bg-swim-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swim-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Efficiency</h3>
                  <p className="text-gray-600">
                    We believe in creating systems that save time and reduce hassle, making swimming more accessible to everyone.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-swim-500">
                <CardContent className="pt-6">
                  <div className="bg-swim-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swim-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    We provide real-time, accurate information about pool conditions, occupancy, and maintenance schedules.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-swim-500">
                <CardContent className="pt-6">
                  <div className="bg-swim-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swim-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Affordability</h3>
                  <p className="text-gray-600">
                    We strive to make our services accessible to all, with fair pricing and transparent billing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Founder & CEO",
                  bio: "Former national swimmer with a passion for technology"
                },
                {
                  name: "Michael Chen",
                  role: "CTO",
                  bio: "Tech expert with 15+ years experience in software development"
                },
                {
                  name: "Emily Rodriguez",
                  role: "Head of Operations",
                  bio: "Swimming coach turned operations specialist"
                },
                {
                  name: "David Kim",
                  role: "Customer Success",
                  bio: "Dedicated to ensuring the best user experience"
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-b from-swim-300 to-swim-500 w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <span className="text-2xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-swim-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

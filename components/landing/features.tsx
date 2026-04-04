import { 
  CalendarDays,
  Gauge,
  ShieldCheck,
  Clock,
  CreditCard,
  Smartphone,
  Receipt,
  Users
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <CalendarDays className="h-10 w-10 text-sky-500" />,
      title: "Easy Online Booking",
      description: "Book your swimming sessions with just a few clicks, anytime and anywhere."
    },
    {
      icon: <Gauge className="h-10 w-10 text-sky-500" />,
      title: "Live Pool Monitoring",
      description: "Check real-time pool conditions including occupancy, water temperature, and cleanliness."
    },
    {
      icon: <Clock className="h-10 w-10 text-sky-500" />,
      title: "Flexible Scheduling",
      description: "Choose from various time slots that fit your busy schedule."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-sky-500" />,
      title: "Secure Payments",
      description: "Make secure online payments with multiple payment options."
    },
    {
      icon: <Smartphone className="h-10 w-10 text-sky-500" />,
      title: "Mobile Friendly",
      description: "Fully responsive design works perfectly on all your devices."
    },
    {
      icon: <Receipt className="h-10 w-10 text-sky-500" />,
      title: "Digital Receipts",
      description: "Get instant downloadable receipts and booking confirmations."
    },
    {
      icon: <Users className="h-10 w-10 text-sky-500" />,
      title: "Family Bookings",
      description: "Easily book sessions for multiple family members at once."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-sky-500" />,
      title: "Membership Options",
      description: "Access special rates and priority booking with membership plans."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose SwimEase?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our platform offers everything you need for a hassle-free swimming experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-sky-50 dark:bg-gray-900 p-6 rounded-lg border border-sky-100 dark:border-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
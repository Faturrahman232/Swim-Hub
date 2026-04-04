"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How do I book a swimming session?",
      answer: "Booking a swimming session is easy! Create an account, navigate to the Booking page, select your preferred date and time slot, choose the number of people, and complete the payment. You'll receive a confirmation email with all the details."
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes, you can cancel or reschedule your booking up to 24 hours before your session. Go to your Dashboard, locate the booking, and click on the cancel or reschedule option. For cancellations made at least 24 hours in advance, you'll receive a full refund."
    },
    {
      question: "How can I check the current pool conditions?",
      answer: "You can view real-time pool conditions on the Dashboard page. This includes information about current occupancy, water temperature, cleanliness status, and whether the pool is open or closed."
    },
    {
      question: "Are there any age restrictions for booking?",
      answer: "Children under 14 must be accompanied by an adult. Anyone 14 years or older can book and swim independently. For safety reasons, we require at least one adult for every three children under 8 years old."
    },
    {
      question: "Do you offer swimming lessons?",
      answer: "Yes, we offer swimming lessons for all ages and skill levels. You can book lessons through the Booking page by selecting the 'Swimming Lessons' option. Our certified instructors provide both group and private lessons."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, PayPal, and bank transfers. All payments are processed securely through our platform."
    },
    {
      question: "Is there a membership option available?",
      answer: "Yes, we offer several membership plans that provide benefits such as discounted rates, priority booking, and extended cancellation periods. You can view and purchase membership plans from your Account page."
    },
    {
      question: "What should I bring for my swimming session?",
      answer: "Please bring your swimming attire, towel, and any personal swimming equipment you prefer to use. We provide lockers for storing your belongings, but you may want to bring your own lock. Shower facilities are available, and swim caps are required for all swimmers."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about using SwimEase
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
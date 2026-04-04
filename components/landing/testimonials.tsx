"use client";

import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Swimmer",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "SwimEase has transformed how I schedule my swimming sessions. The real-time monitoring feature helps me avoid crowded times, and booking is so convenient!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Swim Instructor",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "As a swim instructor, I love how easy it is to check pool conditions and schedule my classes. The detailed booking system helps me organize my students effectively.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "Booking swimming sessions for my kids used to be such a hassle. SwimEase makes it simple and the email reminders ensure we never miss an appointment!",
      rating: 4
    },
    {
      name: "David Thompson",
      role: "Fitness Enthusiast",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "The mobile app is fantastic! I can book my morning swim while commuting and check if the pool is busy before heading over. Highly recommend!",
      rating: 5
    },
    {
      name: "Jessica Kim",
      role: "Competitive Swimmer",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "SwimEase helps me maintain my training schedule with minimal disruption. The calendar view makes it easy to plan weeks in advance.",
      rating: 4
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-sky-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hear from swimmers who are making a splash with SwimEase
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-sky-200 dark:border-sky-900 h-full">
                    <CardContent className="flex flex-col p-6 h-full">
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                      </div>
                      
                      <blockquote className="mb-4 flex-grow">
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          "{testimonial.quote}"
                        </p>
                      </blockquote>
                      
                      <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative" />
            <CarouselNext className="relative" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
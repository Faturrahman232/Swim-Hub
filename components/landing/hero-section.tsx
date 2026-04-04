"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  // The animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const waveAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-swim-50 via-swim-100 to-swim-300 text-swim-900">
      {/* Background wave patterns */}
      <div className="absolute inset-0 z-0 opacity-20">
        <motion.svg 
          viewBox="0 0 1200 800"
          initial="hidden"
          animate="visible"
          className="w-full h-full"
        >
          <motion.path
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            variants={waveAnimation}
          />
          <motion.path
            d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,160C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            variants={waveAnimation}
          />
        </motion.svg>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 ">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            Dive Into Convenience with SwimEase
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-swim-700"
            variants={itemVariants}
          >
            Book your swimming sessions online, monitor pool conditions in real-time, and make a splash without the hassle.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="bg-swim-600 hover:bg-swim-700 text-white px-6 py-3 text-lg">
              <Link href="/booking">Book Now</Link>
            </Button>
            
            {/* <Button asChild variant="outline" className="border-swim-600 text-swim-600 hover:bg-swim-50 px-6 py-3 text-lg">
              <Link href="/dashboard">View Live Status</Link>
            </Button> */}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
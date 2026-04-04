"use client";

import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PoolGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 24,
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  const images = [
    "/img/pool1.jpg",
    "/img/pool2.jpg",
    "/img/pool3.jpg",
    "/img/pool4.jpg",
  ];

  return (
    <section id="about" className="py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Our Pool Gallery
        </h2>

        <div className="relative">
          {/* Arrow Buttons */}
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-110 transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-white" />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-110 transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-white" />
              </button>
            </>
          )}

          {/* Slider */}
          <div ref={sliderRef} className="keen-slider">
            {images.map((src, index) => (
              <div
                key={index}
                className="keen-slider__slide rounded-xl overflow-hidden relative h-64"
              >
                <Image
                  src={src}
                  alt={`Kolam renang ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {loaded && instanceRef.current && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from(
              { length: instanceRef.current.track.details.slides.length },
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === idx
                      ? "bg-sky-600"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

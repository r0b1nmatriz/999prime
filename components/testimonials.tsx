"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Ash's innovative approach has completely transformed how we think about technology. His solutions and ideas are truly next-level.",
      author: "Alex Chen",
      position: "CTO, FutureTech Industries",
    },
    {
      quote:
        "Working with Ashwin has been a game-changer. His forward-thinking delivered solutions we didn't even know we needed until he proved us the possibilities along with his capability at this young age.",
      author: "Samantha Rodriguez",
      position: "Innovation Director, Global Systems",
    },
    {
      quote:
        "The cosmic buzz is real! 999Prime doesn't just meet expectations—they redefine them. Their quantum ideas gonna change the world fr.",
      author: "Dr. Marcus Wei",
      position: "Lead Researcher, Quantum Dynamics Lab",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [current, autoplay]);

  return (
    <section id="testimonials" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from organizations that have experienced the 999Prime
            difference.
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-black/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-gray-800">
                    <Quote className="h-10 w-10 text-purple-500 mb-6" />
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">
                      {testimonial.quote}
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-gray-400">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full bg-black/50 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center border border-gray-800 hover:border-purple-500 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full bg-black/50 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center border border-gray-800 hover:border-purple-500 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  current === index ? "bg-purple-500" : "bg-gray-700"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

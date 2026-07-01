"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, isDesktop ? reviews.length - 2 : reviews.length - 1);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const translateAmount = isDesktop ? activeIndex * 50 : activeIndex * 100;

  return (
    <div className="relative mt-8">
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${translateAmount}%)`,
          }}
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="w-full shrink-0 px-2 md:w-1/2"
            >
              <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
                <div>
                  <div className="flex items-center gap-1 mb-4 text-electric-yellow">
                    {[...Array(review.rating)].map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 italic">&ldquo;{review.text}&rdquo;</p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{review.name}</span>
                  <span className="text-slate-500">{review.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={handlePrev}
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="Önceki yorum"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="Sonraki yorum"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

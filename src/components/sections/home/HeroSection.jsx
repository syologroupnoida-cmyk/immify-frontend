import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "./homeData";
import HeroImage1 from "@/images/hero-slider-img1.png";
import HeroImage2 from "@/images/hero-slider-img2.png";
import HeroImage3 from "@/images/hero-slider-img3.png";

const slideImages = [HeroImage1, HeroImage2, HeroImage3];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(slideImages[0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentImage(slideImages[activeSlide] || HeroImage3);
    setIsImageLoaded(false);
  }, [activeSlide]);

  const slide = heroSlides[activeSlide];

  return (
    <section className="w-full overflow-hidden bg-white px-4 pt-24 pb-6 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32 lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
            {slide.badge}
          </span>
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
            {slide.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Explore Services
            </a>
            <a
              href="#categories"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Browse Categories
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Visa & PR", value: "100+" },
              { label: "Study Abroad", value: "50+" },
              { label: "Relocation", value: "24/7" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 p-3">
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[430px] overflow-hidden bg-transparent shadow-none">
          <Image
            key={`${slide.title}-${currentImage}`}
            src={currentImage}
            alt={slide.title}
            className={`h-full w-full object-contain object-center transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
              <div className="h-12 w-12 animate-pulse rounded-full bg-white/70" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

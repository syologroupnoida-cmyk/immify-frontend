import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "./homeData";

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleCharacterCount(0);
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];
  const typedTitle = slide.title.slice(0, visibleCharacterCount);

  useEffect(() => {
    if (visibleCharacterCount >= slide.title.length) return undefined;

    const typingTimer = window.setTimeout(() => {
      setVisibleCharacterCount((currentCount) => Math.min(currentCount + 1, slide.title.length));
    }, 42);

    return () => window.clearTimeout(typingTimer);
  }, [slide.title, visibleCharacterCount]);

  return (
    <section className="relative min-h-[680px] w-full overflow-hidden bg-slate-950 px-4 pt-28 pb-10 sm:px-6 sm:pt-32 lg:px-8">
      {heroSlides.map((item, index) => (
        <Image
          key={item.image}
          src={item.image}
          alt={item.title}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/55 to-slate-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[540px] max-w-7xl items-center">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
            {slide.badge}
          </span>
          <h1 className="min-h-[7.5rem] max-w-2xl text-4xl font-semibold leading-tight text-white sm:min-h-[7rem] sm:text-5xl lg:text-6xl">
            {typedTitle}
            <span className="ml-1 inline-block h-9 w-0.5 translate-y-1 animate-pulse bg-sky-200 sm:h-12" />
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/85">
            {slide.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Explore Services
            </a>
            <a
              href="#categories"
              className="rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
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
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="text-sm text-white/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
  const imagePosition = slide.imagePosition || "center";

  useEffect(() => {
    if (visibleCharacterCount >= slide.title.length) return undefined;

    const typingTimer = window.setTimeout(() => {
      setVisibleCharacterCount((currentCount) => Math.min(currentCount + 1, slide.title.length));
    }, 42);

    return () => window.clearTimeout(typingTimer);
  }, [slide.title, visibleCharacterCount]);

  return (
    <section className="relative mt-[88px] min-h-[520px] w-full overflow-hidden bg-slate-950 px-4 py-8 sm:min-h-[580px] sm:px-6 lg:aspect-[1672/680] lg:min-h-[620px] lg:max-h-[720px] lg:px-8">
      {heroSlides.map((item, index) => (
        <Image
          key={item.image}
          src={item.image}
          alt={item.title}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1400ms] ease-in-out ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: index === activeSlide ? imagePosition : item.imagePosition || "center" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/62 to-slate-950/12" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-slate-950/15" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[456px] max-w-7xl items-center sm:min-h-[516px] lg:min-h-[556px]">
        <div className="max-w-2xl">
          <span className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {slide.badge}
          </span>
          <h1 className="min-h-[5rem] max-w-2xl text-3xl font-semibold leading-tight text-white sm:min-h-[5.5rem] sm:text-4xl lg:text-4xl">
            {typedTitle}
            <span className="ml-1 inline-block h-7 w-0.5 translate-y-1 animate-pulse bg-sky-200 sm:h-9" />
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-white/85">
            {slide.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
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

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Visa & PR", value: "100+" },
              { label: "Study Abroad", value: "50+" },
              { label: "Relocation", value: "24/7" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/20 bg-slate-950/20 p-3 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">{item.value}</p>
                <p className="text-xs text-white/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

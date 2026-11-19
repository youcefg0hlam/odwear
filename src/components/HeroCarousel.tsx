import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageSquareText, Sparkles, Truck, ShieldCheck, MapPin, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroCarousel: React.FC = () => {
  const { t, language, generateWhatsAppUrl } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/hero_menswear_chlef_1794272552067.jpg",
      badge: t.hero.badge,
      title: t.hero.title,
      subtitle: t.hero.subtitle,
      highlight: "2026 Collection"
    },
    {
      image: "/images/product_sneaker_luxury_1794272552580.jpg",
      badge: "SNEAKERS & BASKETS",
      title: t.hero.slide1Title,
      subtitle: t.hero.slide1Sub,
      highlight: "Alexander McQueen · Off-White · On Cloud"
    },
    {
      image: "/images/product_jacket_suit_1794272553427.jpg",
      badge: "SARTORIAL & LUXE",
      title: t.hero.slide2Title,
      subtitle: t.hero.slide2Sub,
      highlight: "Tony Moro · Zegna · Boss"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#100C09]">
      {/* Carousel Viewport */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full bg-stone-950">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Measured Contrast Scrim */}
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100C09] via-[#100C09]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#100C09]/80 via-[#100C09]/30 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {/* Clean unboxed kicker */}
                  <div className="flex items-center gap-2 mb-3 text-xs tracking-widest uppercase text-[#BA5418] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                    <span className="text-stone-600">·</span>
                    <span className="text-stone-300 font-normal">{slide.highlight}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FCF1E1] mb-4 leading-tight font-serif text-balance">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base lg:text-lg text-stone-300 mb-8 leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={scrollToCatalog}
                      className="px-6 py-3 rounded-lg bg-[#BA5418] text-[#FCF1E1] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#D2702B] transition-colors shadow-lg cursor-pointer whitespace-nowrap"
                    >
                      {t.hero.ctaPrimary}
                    </button>

                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-stone-500 font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <MessageSquareText className="w-4 h-4 text-emerald-400" />
                      <span>{t.hero.ctaWhatsApp}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-stone-700 text-[#FCF1E1] flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-stone-700 text-[#FCF1E1] flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                i === currentSlide ? 'w-8 bg-[#BA5418]' : 'w-2 bg-stone-600 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust & Local Delivery KPI strip */}
      <div className="border-y border-stone-800/80 bg-[#18120D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-[#BA5418] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-100">{t.trust.wilayas58Title}</h4>
                <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 leading-snug">{t.trust.wilayas58Sub}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-100">{t.trust.codTitle}</h4>
                <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 leading-snug">{t.trust.codSub}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-[#BA5418] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-100">{t.trust.storeTitle}</h4>
                <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 leading-snug">{t.trust.storeSub}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-100">{t.trust.supportTitle}</h4>
                <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 leading-snug">{t.trust.supportSub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

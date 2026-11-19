import React from 'react';
import { MapPin, Clock, Phone, Instagram, Facebook, MessageSquareText, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const StoreLocation: React.FC = () => {
  const { language, t } = useStore();
  const isAr = language === 'ar';

  return (
    <section id="boutique-chlef" className="py-12 sm:py-16 bg-[#16100C] border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#BA5418] mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>WILAYA DE CHLEF (02)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FCF1E1] font-serif">
            {t.store.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-400">
            {t.store.subtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Address & Hours */}
          <div className="bg-[#211911] border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#BA5418] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>{t.store.addressTitle}</span>
              </div>
              <p className="text-sm font-semibold text-stone-200 leading-relaxed">
                {t.store.addressValue}
              </p>
              <a
                href="https://maps.app.goo.gl/1tRVeovBwU1AWMUaA"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#BA5418] hover:underline font-semibold"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.store.viewOnMap}</span>
              </a>
            </div>

            <div className="border-t border-stone-800/80 pt-6">
              <div className="flex items-center gap-2 text-stone-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-[#BA5418]" />
                <span>{t.store.hoursTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t.store.hoursValue}
              </p>
            </div>
          </div>

          {/* Card 2: Phone & Contact */}
          <div className="bg-[#211911] border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-stone-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{t.store.phoneTitle}</span>
              </div>
              <div className="space-y-2 mt-3">
                {t.store.phones.map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#BA5418] text-stone-100 hover:text-[#FCF1E1] transition-colors cursor-pointer group"
                  >
                    <span className="font-mono font-bold text-sm">{phone}</span>
                    <span className="text-[11px] text-[#BA5418] group-hover:underline">
                      {isAr ? 'اتصال مباشر' : 'Appeler'}
                    </span>
                  </a>
                ))}
                <a
                  href={`mailto:${t.store.email}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#BA5418] text-stone-100 hover:text-[#FCF1E1] transition-colors cursor-pointer group"
                >
                  <span className="font-mono font-bold text-xs break-all">{t.store.email}</span>
                  <span className="text-[11px] text-[#BA5418] group-hover:underline">
                    {isAr ? 'راسلنا' : 'E-mail'}
                  </span>
                </a>
              </div>
            </div>

            <div className="border-t border-stone-800/80 pt-6">
              <a
                href="https://wa.me/213660005597"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'محادثة فورية مع المتجر على واتساب' : 'Discuter avec la boutique sur WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Card 3: Social Footprint & Instagram */}
          <div className="bg-[#211911] border border-stone-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-stone-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>{t.store.socialsTitle}</span>
              </div>
              <h4 className="text-base font-bold text-[#FCF1E1] mt-1">@odwearstore</h4>
              <p className="text-xs text-stone-400 mt-1">
                {t.store.instagramFollowers}
              </p>
              <p className="text-xs text-stone-500 mt-2">
                {isAr
                  ? 'تابعونا يومياً لمشاهدة وصول التشكيلات الحصرية ومقاطع الفيديو من داخل المحل.'
                  : 'Rejoignez notre communauté pour découvrir les nouveaux arrivages en vidéo et les essayages exclusifs.'}
              </p>
            </div>

            <div className="pt-6 border-t border-stone-800/80 flex items-center gap-3">
              <a
                href="https://www.instagram.com/odwearstore/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-[#FCF1E1] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/p/OD-WEAR-61578813924077/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

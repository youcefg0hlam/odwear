import React from 'react';
import { MapPin, Phone, ShieldCheck, Heart, Instagram, Facebook, MessageSquareText, LayoutDashboard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC<{ onEnterAdmin: () => void }> = ({ onEnterAdmin }) => {
  const { language, t } = useStore();
  const isAr = language === 'ar';

  return (
    <footer className="bg-[#0A0806] border-t border-stone-800/80 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer group"
              aria-label="OD WEAR — retour à l'accueil"
              title="Retour à l'accueil"
            >
              <img src="/logo.jpeg" alt="OD WEAR" className="h-11 w-11 rounded-lg object-cover bg-[#FCF1E1] ring-1 ring-[#BA5418]/40" />
              <span className="text-base font-extrabold tracking-widest uppercase font-serif text-[#FCF1E1] group-hover:text-[#BA5418] transition-colors">
                OD <span className="text-[#BA5418]">WEAR</span>
              </span>
            </button>
            <p className="text-stone-400 text-xs leading-relaxed">
              {t.tagline}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#BA5418]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'ضمان الجودة والتوصيل 58 ولاية' : 'Garantie d\'authenticité & livraison 58 wilayas'}</span>
            </div>
          </div>

          {/* Boutique Chlef */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              {t.store.title}
            </h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              {t.store.addressValue}
            </p>
            <p className="text-stone-500 text-[11px]">
              {t.store.hoursValue}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              {isAr ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <a href="#catalog-section" className="hover:text-[#FCF1E1] cursor-pointer transition-colors">
                  {t.nav.catalog}
                </a>
              </li>
              <li>
                <button onClick={onEnterAdmin} className="inline-flex items-center gap-1.5 hover:text-[#BA5418] cursor-pointer transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{t.nav.admin}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              {t.store.phoneTitle}
            </h4>
            <div className="space-y-1 text-stone-300">
              <a href="tel:060005597" className="block font-mono hover:text-[#BA5418] transition-colors">060005597</a>
              <a href="mailto:oussamadll@gmail.com" className="block hover:text-[#BA5418] transition-colors break-all">oussamadll@gmail.com</a>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <a href="https://www.instagram.com/odwearstore/" target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-[#BA5418] text-stone-300 hover:text-[#BA5418] transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.facebook.com/p/OD-WEAR-61578813924077/" target="_blank" rel="noopener noreferrer" title="Facebook" className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-[#BA5418] text-stone-300 hover:text-[#BA5418] transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://wa.me/213660005597" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-[#BA5418] text-stone-300 hover:text-[#BA5418] transition-colors">
                <MessageSquareText className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              WhatsApp & Appel direct
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} OD WEAR. {isAr ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </div>
          <div className="flex items-center gap-1">
            <span>Chlef, Algérie</span>
            <span>·</span>
            <span>Paiement à la livraison (COD)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

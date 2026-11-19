import React, { useState } from 'react';
import { X, ShieldCheck, Truck, MessageSquareText, MapPin, Phone, User, Home, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ALGERIA_WILAYAS } from '../data/wilayas';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    createOrder, 
    generateWhatsAppUrl,
    language, 
    t 
  } = useStore();

  const isAr = language === 'ar';
  
  // Default to Chlef (Wilaya 02)
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(2);
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [communeAddress, setCommuneAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const currentWilaya = ALGERIA_WILAYAS.find(w => w.code === selectedWilayaCode) || ALGERIA_WILAYAS[1];
  const isFreeDelivery = cartSubtotal >= 18000;
  const deliveryFee = isFreeDelivery ? 0 : (deliveryType === 'home' ? currentWilaya.homeDeliveryFee : currentWilaya.deskDeliveryFee);
  const grandTotal = cartSubtotal + deliveryFee;

  // Validation for Algerian telephone numbers (05, 06, 07 followed by 8 digits)
  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = t.checkout.nameError;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    const algerianPhoneRegex = /^(05|06|07)[0-9]{8}$/;
    if (!algerianPhoneRegex.test(cleanPhone)) {
      errs.phone = t.checkout.phoneError;
    }

    if (!communeAddress.trim() || communeAddress.trim().length < 3) {
      errs.commune = isAr ? 'يرجى تحديد البلدية أو العنوان بالتفصيل' : 'Veuillez préciser la commune et l\'adresse';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitCOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        wilayaCode: currentWilaya.code,
        wilayaName: isAr ? currentWilaya.nameAr : currentWilaya.nameFr,
        communeAddress: communeAddress.trim(),
        deliveryType,
        deliveryFee,
        items: cart,
        subtotal: cartSubtotal,
        total: grandTotal,
        status: 'pending',
        paymentMethod: 'cod',
        notes: notes.trim() || undefined
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleOrderWhatsApp = () => {
    const url = generateWhatsAppUrl({
      name: fullName.trim(),
      phone: phone.trim(),
      wilaya: isAr ? currentWilaya.nameAr : currentWilaya.nameFr,
      address: communeAddress.trim(),
      items: cart,
      total: grandTotal
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#18120D] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[#FCF1E1] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#BA5418]" />
              <span>{t.checkout.title}</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">{t.checkout.subtitle}</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Fermer"
            className="p-1.5 rounded-lg text-stone-400 hover:text-[#FCF1E1] hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitCOD} className="p-5 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#BA5418]" />
              <span>{t.checkout.fullName} <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder={t.checkout.fullNamePlaceholder}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border text-sm text-[#FCF1E1] placeholder-stone-500 focus:outline-none transition-colors ${
                errors.fullName ? 'border-rose-500 focus:border-rose-500' : 'border-stone-700/80 focus:border-[#BA5418]'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#BA5418]" />
              <span>{t.checkout.phone} <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              placeholder={t.checkout.phonePlaceholder}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border text-sm text-[#FCF1E1] placeholder-stone-500 focus:outline-none transition-colors ${
                errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-stone-700/80 focus:border-[#BA5418]'
              }`}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-500">{t.checkout.phoneHelp}</p>
            )}
          </div>

          {/* Wilaya Selector (All 58 Algerian Provinces) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#BA5418]" />
                <span>{t.checkout.wilaya} <span className="text-rose-400">*</span></span>
              </label>
              <select
                value={selectedWilayaCode}
                onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border border-stone-700/80 text-sm text-[#FCF1E1] focus:outline-none focus:border-[#BA5418] cursor-pointer"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {isAr ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Type Option: Domicile vs Stop Desk */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                {t.checkout.deliveryType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('home')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                    deliveryType === 'home'
                      ? 'border-[#BA5418] bg-[#BA5418]/15 text-[#FCF1E1]'
                      : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-[#FCF1E1]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-[#BA5418]" />
                  <span>{t.checkout.deliveryHome}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('desk')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                    deliveryType === 'desk'
                      ? 'border-[#BA5418] bg-[#BA5418]/15 text-[#FCF1E1]'
                      : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-[#FCF1E1]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.checkout.deliveryDesk}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Commune & Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              {t.checkout.commune} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={communeAddress}
              onChange={(e) => {
                setCommuneAddress(e.target.value);
                if (errors.commune) setErrors({ ...errors, commune: '' });
              }}
              placeholder={t.checkout.communePlaceholder}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-900 border text-sm text-[#FCF1E1] placeholder-stone-500 focus:outline-none transition-colors ${
                errors.commune ? 'border-rose-500 focus:border-rose-500' : 'border-stone-700/80 focus:border-[#BA5418]'
              }`}
            />
            {errors.commune && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.commune}</span>
              </p>
            )}
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              {t.checkout.notes}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.checkout.notesPlaceholder}
              className="w-full px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-[#BA5418]"
            />
          </div>

          {/* Price Summary Breakdown */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              {t.checkout.summary}
            </h4>
            <div className="flex justify-between text-xs text-stone-300">
              <span>{t.checkout.productsTotal} ({cart.length} articles) :</span>
              <span className="font-semibold text-[#FCF1E1] tabular-nums">
                {cartSubtotal.toLocaleString()} {t.product.dzd}
              </span>
            </div>
            <div className="flex justify-between text-xs text-stone-300">
              <span>{t.checkout.deliveryFee} ({isAr ? currentWilaya.nameAr : currentWilaya.nameFr}) :</span>
              <span className="font-semibold text-[#FCF1E1] tabular-nums">
                {isFreeDelivery ? (
                  <span className="text-emerald-400 font-bold">{t.checkout.free}</span>
                ) : (
                  `${deliveryFee.toLocaleString()} ${t.product.dzd}`
                )}
              </span>
            </div>
            <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline text-sm">
              <span className="font-bold text-[#FCF1E1]">{t.checkout.grandTotal} :</span>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-extrabold text-[#BA5418] tabular-nums">
                  {grandTotal.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#BA5418] ml-1">
                  {t.product.dzd}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isAr ? 'الدفع نقداً عند استلام الطرد وفحصه' : 'Paiement en espèces lors de la réception'}</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="space-y-3 pt-2">
            {/* Primary COD Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-[#BA5418] hover:bg-[#D2702B] text-[#FCF1E1] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>{isSubmitting ? t.checkout.processing : t.checkout.confirmButton}</span>
            </button>

            {/* Direct WhatsApp Option */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-800 w-full" />
              <span className="bg-[#18120D] px-3 text-[11px] uppercase tracking-wider text-stone-500 whitespace-nowrap">
                {isAr ? 'أو' : 'OU'}
              </span>
              <div className="border-t border-stone-800 w-full" />
            </div>

            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="w-full py-3 px-4 rounded-xl border border-emerald-600/50 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4 text-emerald-400" />
              <span>{t.checkout.whatsappDirect}</span>
            </button>
            <p className="text-[11px] text-stone-500 text-center">{t.checkout.whatsappNotice}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

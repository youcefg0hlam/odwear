import React from 'react';
import { CheckCircle2, MessageSquareText, Printer, ArrowLeft, Package, MapPin, Phone, User, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { lastConfirmedOrder, setLastConfirmedOrder, language, t, generateWhatsAppUrl } = useStore();

  if (!lastConfirmedOrder) return null;

  const isAr = language === 'ar';

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppFollowUp = () => {
    const isArLang = language === 'ar';
    const message = isArLang
      ? `السلام عليكم OD WEAR، لقد قمت بتأكيد طلبي رقم (${lastConfirmedOrder.orderNumber}) عبر الموقع الإلكتروني بمبلغ إجمالي ${lastConfirmedOrder.total.toLocaleString()} د.ج. أرجو تأكيد الشحن وشكراً!`
      : `Bonjour OD WEAR, j'ai validé ma commande N° ${lastConfirmedOrder.orderNumber} sur le site web pour un montant total de ${lastConfirmedOrder.total.toLocaleString()} DZD. Merci de confirmer l'expédition !`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/213660005597?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#18120D] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon & Header */}
        <div className="text-center pb-6 border-b border-stone-800">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FCF1E1]">
            {t.orderSuccess.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-md mx-auto">
            {t.orderSuccess.message}
          </p>

          {/* Reference pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-stone-900 border border-stone-700/80">
            <span className="text-xs text-stone-400">{t.orderSuccess.number}</span>
            <span className="text-sm font-extrabold text-[#BA5418] tracking-wider font-mono">
              {lastConfirmedOrder.orderNumber}
            </span>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="my-6 p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-3 text-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Date :</span>
            </span>
            <span className="text-stone-200 font-mono">
              {new Date(lastConfirmedOrder.createdAt).toLocaleDateString()} · {new Date(lastConfirmedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center justify-between text-stone-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.checkout.fullName} :</span>
            </span>
            <span className="text-stone-200 font-semibold">{lastConfirmedOrder.customerName}</span>
          </div>

          <div className="flex items-center justify-between text-stone-400">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.checkout.phone} :</span>
            </span>
            <span className="text-stone-200 font-mono">{lastConfirmedOrder.customerPhone}</span>
          </div>

          <div className="flex items-center justify-between text-stone-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.checkout.wilaya} :</span>
            </span>
            <span className="text-stone-200">{lastConfirmedOrder.wilayaName} ({lastConfirmedOrder.communeAddress})</span>
          </div>

          <div className="border-t border-stone-800/80 pt-3 space-y-2">
            <span className="font-semibold text-stone-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#BA5418]" />
              <span>Articles commandés ({lastConfirmedOrder.items.length}) :</span>
            </span>
            <div className="divide-y divide-stone-900">
              {lastConfirmedOrder.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-center text-stone-300">
                  <span className="truncate max-w-[280px]">
                    {item.quantity}x {isAr ? item.product.name.ar : item.product.name.fr} ({item.selectedSize})
                  </span>
                  <span className="font-mono text-stone-200">
                    {(item.product.price * item.quantity).toLocaleString()} {t.product.dzd}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline text-sm font-bold">
            <span className="text-[#FCF1E1]">{t.checkout.grandTotal} :</span>
            <span className="text-[#BA5418] text-base font-extrabold tabular-nums">
              {lastConfirmedOrder.total.toLocaleString()} {t.product.dzd}
            </span>
          </div>
        </div>

        {/* Follow up & CTAs */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppFollowUp}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#FCF1E1] font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>{t.orderSuccess.whatsappFollow}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.orderSuccess.printReceipt}</span>
            </button>

            <button
              onClick={() => setLastConfirmedOrder(null)}
              className="py-2.5 px-3 rounded-xl bg-[#BA5418] hover:bg-[#D2702B] text-[#FCF1E1] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.orderSuccess.backHome}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

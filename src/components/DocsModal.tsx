import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Layout, 
  Layers, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DocsModal: React.FC = () => {
  const { language, t } = useStore();
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'wireframe' | 'whatsapp' | 'steps'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const schemaJson = `{
  "users": {
    "user_id_101": {
      "uid": "user_id_101",
      "fullName": "Amine Benali",
      "phone": "0550123456",
      "email": "amine.benali@example.com",
      "role": "customer",
      "preferredWilaya": 2,
      "addressBook": [
        {
          "commune": "Chlef Centre",
          "street": "Boulevard Emir Abdelkader",
          "isDefault": true
        }
      ],
      "createdAt": "2026-11-09T10:00:00Z"
    }
  },
  "products": {
    "prod_mcqueen_01": {
      "id": "prod_mcqueen_01",
      "name": {
        "fr": "Baskets Alexander McQueen Court Classic",
        "ar": "حذاء ألكسندر ماكوين كورت كلاسيك"
      },
      "brand": "Alexander McQueen",
      "category": "sneakers",
      "priceDZD": 14500,
      "stockCount": 12,
      "inStock": true,
      "sizes": ["40", "41", "42", "43", "44", "45"],
      "imageUrls": ["/assets/sneakers/mcqueen_01.jpg"]
    }
  },
  "orders": {
    "BSC-26-8941": {
      "orderId": "BSC-26-8941",
      "customerId": "user_id_101",
      "customerName": "Amine Benali",
      "customerPhone": "0550123456",
      "wilayaCode": 2,
      "wilayaName": "02 - Chlef (Local)",
      "communeAddress": "Chlef Centre, Cité El Mokrani",
      "deliveryType": "home",
      "deliveryFeeDZD": 350,
      "paymentMethod": "COD",
      "status": "pending",
      "items": [
        {
          "productId": "prod_mcqueen_01",
          "productName": "Baskets Alexander McQueen",
          "size": "42",
          "quantity": 1,
          "unitPriceDZD": 14500
        }
      ],
      "subtotalDZD": 14500,
      "totalDZD": 14850,
      "createdAt": "2026-11-09T16:20:00Z"
    }
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-stone-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#BA5418] mb-2">
          <FileCode2 className="w-4 h-4" />
          <span>SPECIFICATIONS & ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FCF1E1] font-serif">
          {t.docs.title}
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          {t.docs.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'architecture', label: '1. App Architecture', icon: Layers },
          { id: 'schema', label: '2. Database Schema (JSON)', icon: Database },
          { id: 'wireframe', label: '3. UI/UX Wireframes', icon: Layout },
          { id: 'whatsapp', label: '4. WhatsApp Integration Logic', icon: FileCode2 },
          { id: 'steps', label: '5. Local Setup 5-Steps', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#BA5418] text-[#FCF1E1] shadow-md'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-[#FCF1E1] hover:border-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="bg-[#18120D] border border-stone-800 rounded-2xl p-6 sm:p-8">
        {activeTab === 'architecture' && (
          <div className="space-y-6 text-sm text-stone-300">
            <h3 className="text-lg font-bold text-[#FCF1E1] font-serif flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#BA5418]" />
              <span>Boutique Architecture & Modular Design</span>
            </h3>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Designed around high responsiveness, RTL/LTR dual rendering, and zero-latency client state management with Algerian market localization.
            </p>

            <div className="bg-stone-950 p-4 rounded-xl font-mono text-xs text-stone-300 overflow-x-auto border border-stone-800">
              <pre>{`brand-store-chlef/
├── src/
│   ├── assets/images/       # High-fidelity visual assets (hero, sneakers, suits)
│   ├── components/
│   │   ├── Header.tsx       # Zone 1-2-3 Top Bar, language toggle & cart counter
│   │   ├── HeroCarousel.tsx # Responsive campaign carousel & 4-column trust strip
│   │   ├── ProductCard.tsx  # Luxury card with DZD price & fast size selector
│   │   ├── ProductModal.tsx # Full PDP view with sizing & guarantee badges
│   │   ├── CartDrawer.tsx   # Slide-over cart with free shipping bar
│   │   ├── CheckoutModal.tsx# Algerian COD form & 58 Wilayas dropdown
│   │   ├── OrderSuccessModal# Official order receipt & print view
│   │   ├── AdminDashboard.tsx# Live order tracking, inventory & wilaya stats
│   │   └── StoreLocation.tsx# Boutique info in Chlef centre-ville
│   ├── context/
│   │   └── StoreContext.tsx # Centralized state (Cart, Orders, Products, Lang)
│   ├── data/
│   │   ├── wilayas.ts       # All 58 Algerian wilayas & shipping tariffs
│   │   ├── products.ts      # Curated catalog (McQueen, Boss, Tony Moro...)
│   │   └── translations.ts  # Complete French & Arabic copy
│   └── types/
│       └── index.ts         # TypeScript data contracts`}</pre>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#FCF1E1] font-serif flex items-center gap-2">
                <Database className="w-5 h-5 text-[#BA5418]" />
                <span>NoSQL / Firestore / Supabase Database Schema</span>
              </h3>
              <button
                onClick={() => copyToClipboard(schemaJson, 'schema')}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-900 border border-stone-700 text-xs text-stone-300 hover:text-[#FCF1E1] cursor-pointer"
              >
                {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'schema' ? 'Copié !' : 'Copier JSON'}</span>
              </button>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl font-mono text-xs text-[#BA5418] overflow-x-auto border border-stone-800">
              <pre>{schemaJson}</pre>
            </div>
          </div>
        )}

        {activeTab === 'wireframe' && (
          <div className="space-y-6 text-sm text-stone-300">
            <h3 className="text-lg font-bold text-[#FCF1E1] font-serif flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#BA5418]" />
              <span>UI/UX Wireframe & Screen Specifications</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="font-bold text-[#BA5418] text-xs uppercase tracking-wider">
                  A. Home Screen (Écran d'Accueil)
                </h4>
                <ul className="space-y-2 text-xs text-stone-400 list-disc pl-4">
                  <li><strong>Announcement Bar:</strong> 58 Wilayas delivery notice + Chlef store indicator.</li>
                  <li><strong>Top Navigation:</strong> Brand Wordmark · Collection · Boutique Chlef · Admin · Lang Switcher · Cart Bag.</li>
                  <li><strong>Hero Slider:</strong> 3 curated campaigns with high contrast imagery, typography, and dual CTAs.</li>
                  <li><strong>Trust Strip:</strong> 4 pillars (58 Wilayas, Cash on Delivery, Chlef Physical Boutique, 7/7 Support).</li>
                  <li><strong>Interactive Filter:</strong> Segmented tabs (Baskets, Chemises, Pantalons, Vestes, Parfums...) + Search query.</li>
                  <li><strong>Product Grid:</strong> 3-column desktop / 2-column mobile luxury cards with DZD pricing.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="font-bold text-[#BA5418] text-xs uppercase tracking-wider">
                  B. Product Detail & Algerian Checkout
                </h4>
                <ul className="space-y-2 text-xs text-stone-400 list-disc pl-4">
                  <li><strong>PDP Gallery:</strong> High-res photo presentation with zoom and stock availability pill.</li>
                  <li><strong>Purchase Block:</strong> Size selector buttons (40-45 / S-XXL) + Color swatch buttons.</li>
                  <li><strong>Direct Action CTAs:</strong> "Ajouter au Panier" + "Commander Maintenant" + "WhatsApp direct".</li>
                  <li><strong>Local Checkout Form:</strong> Full Name, Algerian phone number (05/06/07 validation).</li>
                  <li><strong>Wilaya Selector:</strong> Complete 58 Algerian provinces with automated shipping tariff calculation.</li>
                  <li><strong>Receipt Screen:</strong> Printable order confirmation code <code>BSC-26-XXXX</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="space-y-4 text-xs sm:text-sm text-stone-300">
            <h3 className="text-lg font-bold text-[#FCF1E1] font-serif flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp Direct Ordering Implementation</span>
            </h3>

            <p className="text-stone-400">
              Generates a formatted, localized WhatsApp message sending all customer delivery and cart details directly to OD WEAR's official business phone (<code>060005597</code>).
            </p>

            <div className="bg-stone-950 p-4 rounded-xl font-mono text-xs text-stone-300 overflow-x-auto border border-stone-800">
              <pre>{`// WhatsApp URL Generator logic in OD WEAR:
const generateWhatsAppUrl = ({ name, phone, wilaya, address, items, total }) => {
  const storePhone = "213660005597"; // +213 660 00 55 97
  
  let msg = "Bonjour OD WEAR, je souhaite commander :\\n\\n";
  items.forEach((item, i) => {
    msg += \`\${i + 1}. \${item.quantity}x \${item.product.name.fr} (Taille \${item.selectedSize}) - \${item.product.price} DZD\\n\`;
  });
  msg += \`\\n💰 Total : \${total} DZD\\n\`;
  msg += \`👤 Nom : \${name}\\n📱 Tél : \${phone}\\n📍 Wilaya : \${wilaya}\\n🏠 Adresse : \${address}\\n\`;
  msg += "\\n✅ Paiement à la livraison (COD). Merci de confirmer l'expédition !";

  return \`https://wa.me/\${storePhone}?text=\${encodeURIComponent(msg)}\`;
};`}</pre>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-6 text-xs sm:text-sm text-stone-300">
            <h3 className="text-lg font-bold text-[#FCF1E1] font-serif flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#BA5418]" />
              <span>5-Step Setup Guide (Local & Production Deployment)</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-[#BA5418] block mb-1">Étape 1 : Cloner le Répertoire & Installer les Dépendances</span>
                <p className="text-stone-400 mb-2">Clonez le projet et lancez l'installation des packages Node.js :</p>
                <div className="bg-black/80 p-2.5 rounded font-mono text-stone-200">
                  <code>npm install</code>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-[#BA5418] block mb-1">Étape 2 : Lancer le Serveur de Développement Local</span>
                <p className="text-stone-400 mb-2">Démarrez Vite en local sur le port 3000 :</p>
                <div className="bg-black/80 p-2.5 rounded font-mono text-stone-200">
                  <code>npm run dev</code>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-[#BA5418] block mb-1">Étape 3 : Configurer Firebase ou Supabase</span>
                <p className="text-stone-400 mb-2">Créez votre projet Firebase Firestore avec les collections <code>products</code>, <code>orders</code>, et <code>users</code> en utilisant le schéma JSON fourni à l'onglet 2.</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-[#BA5418] block mb-1">Étape 4 : Configurer le Numéro WhatsApp Commercial</span>
                <p className="text-stone-400 mb-2">Renseignez votre numéro de boutique (ex: <code>213660005597</code>) dans <code>StoreContext.tsx</code> pour recevoir directement les commandes des clients.</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-[#BA5418] block mb-1">Étape 5 : Compiler & Déployer en Production</span>
                <p className="text-stone-400 mb-2">Générez les fichiers statiques optimisés pour le déploiement Cloud Run / Vercel :</p>
                <div className="bg-black/80 p-2.5 rounded font-mono text-stone-200">
                  <code>npm run build</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

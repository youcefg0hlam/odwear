/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CatalogSection } from './components/CatalogSection';
import { StoreLocation } from './components/StoreLocation';
import { AdminDashboard } from './components/AdminDashboard';
import { DocsModal } from './components/DocsModal';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { ADMIN_ACCESS_CODE, ADMIN_QUERY_PARAM, ADMIN_SESSION_KEY } from './data/config';
import { auth, isFirebaseConfigured } from './lib/firebase';
import { seedProductsIfEmpty } from './lib/cloudData';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  MessageSquareText,
  ShoppingBag,
  MapPin,
  LockKeyhole,
  LogOut,
  LayoutDashboard,
  FileCode2,
  ShieldCheck
} from 'lucide-react';

const isAdminUrl = () => new URLSearchParams(window.location.search).has(ADMIN_QUERY_PARAM);

/* ---------------------------------- Storefront --------------------------------- */

const Storefront: React.FC<{ onEnterAdmin: () => void }> = ({ onEnterAdmin }) => {
  const { cartCount, setIsCartOpen, generateWhatsAppUrl } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#100C09] text-[#FCF1E1]">
      <Header />

      <main className="flex-1">
        <HeroCarousel />
        <CatalogSection />
        <StoreLocation />
      </main>

      <Footer onEnterAdmin={onEnterAdmin} />

      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />

      {/* Quick Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30 flex items-center gap-2 p-1.5 bg-[#211911]/90 backdrop-blur-md border border-stone-800 rounded-2xl shadow-2xl">
        <a
          href={generateWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#FCF1E1] font-bold text-xs tracking-wide transition-colors cursor-pointer"
        >
          <MessageSquareText className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <a
          href="#boutique-chlef"
          className="flex items-center justify-center p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-[#FCF1E1] transition-colors"
          title="OD WEAR"
        >
          <MapPin className="w-4 h-4 text-[#BA5418]" />
        </a>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#BA5418] text-[#FCF1E1] font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="ml-1.5 text-xs font-black">
              ({cartCount})
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

/* --------------------------------- Admin Login --------------------------------- */

const AdminLogin: React.FC<{ onSuccess: () => void; onBack: () => void }> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('admin@odwear.store');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isFirebaseConfigured && auth) {
      setIsSubmitting(true);
      try {
        await signInWithEmailAndPassword(auth, email.trim(), code);
        onSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Connexion impossible.';
        setError(
          message.includes('invalid-credential') || message.includes('wrong-password') || message.includes('user-not-found')
            ? 'Email ou mot de passe incorrect.'
            : message
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (code.trim() === ADMIN_ACCESS_CODE) {
      onSuccess();
    } else {
      setError('Code incorrect. Réessayez.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#100C09] px-4">
      <div className="w-full max-w-sm bg-[#18120D] border border-stone-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-[#BA5418] text-[11px] font-bold uppercase tracking-widest mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Espace sécurisé</span>
        </div>

        <h1 className="text-2xl font-extrabold font-serif text-[#FCF1E1]">Administration OD WEAR</h1>
        <p className="text-xs text-stone-400 mt-2 mb-6">
          Réservé au gestionnaire de la boutique. La boutique client reste accessible sans connexion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isFirebaseConfigured && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">Email administrateur</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@odwear.store"
                className="w-full px-3 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-sm text-[#FCF1E1] placeholder-stone-600 focus:outline-none focus:border-[#BA5418]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              {isFirebaseConfigured ? 'Mot de passe' : "Code d'accès admin"}
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BA5418]" />
              <input
                type="password"
                required
                autoFocus={!isFirebaseConfigured}
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-sm text-[#FCF1E1] placeholder-stone-600 focus:outline-none focus:border-[#BA5418]"
              />
            </div>
            {error && <p className="mt-1.5 text-[11px] text-rose-400">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-[#BA5418] hover:bg-[#D2702B] text-[#FCF1E1] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Connexion...' : "Accéder à l'administration"}
          </button>
        </form>

        {isFirebaseConfigured && (
          <p className="mt-4 text-[10px] leading-relaxed text-stone-500">
            Authentification sécurisée Firebase. Créez le compte administrateur dans
            Firebase Authentication → Sign-in method → Email/Password.
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-5 w-full text-center text-[11px] text-stone-500 hover:text-[#FCF1E1] transition-colors cursor-pointer"
        >
          ← Retour à la boutique
        </button>
      </div>
    </div>
  );
};

/* -------------------------------- Admin Console -------------------------------- */

const AdminShell: React.FC<{ onExit: () => void; userEmail?: string }> = ({ onExit, userEmail }) => {
  const [section, setSection] = useState<'dashboard' | 'docs'>('dashboard');

  return (
    <div className="min-h-screen bg-[#100C09] text-[#FCF1E1]">
      <header className="sticky top-0 z-40 bg-[#100C09]/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="OD WEAR" className="h-9 w-9 rounded-lg object-cover bg-[#FCF1E1] ring-1 ring-[#BA5418]/50" />
            <div>
              <span className="block text-sm font-extrabold tracking-widest uppercase font-serif">
                OD <span className="text-[#BA5418]">WEAR</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#BA5418]">Administration</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userEmail && (
              <span className="hidden lg:block max-w-[180px] truncate text-[10px] text-stone-500" title={userEmail}>
                {userEmail}
              </span>
            )}
            <button
              onClick={() => setSection('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                section === 'dashboard'
                  ? 'bg-[#BA5418] text-[#FCF1E1]'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-[#FCF1E1]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </button>

            <button
              onClick={() => setSection('docs')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                section === 'docs'
                  ? 'bg-[#BA5418] text-[#FCF1E1]'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-[#FCF1E1]'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Documentation</span>
            </button>

            <button
              onClick={onExit}
              title="Quitter l'administration"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-rose-300 hover:border-rose-800/60 text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </div>
        </div>
      </header>

      <main>{section === 'dashboard' ? <AdminDashboard /> : <DocsModal />}</main>
    </div>
  );
};

/* ----------------------------------- Router ------------------------------------ */

export default function App() {
  const [adminMode, setAdminMode] = useState(isAdminUrl);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth?.currentUser ?? null);
  const [localAdmin, setLocalAdmin] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  );

  // Real auth state comes from Firebase; the local flag is only a dev fallback.
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) void seedProductsIfEmpty().catch((err) => console.error('Seed:', err));
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => setAdminMode(isAdminUrl());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAuthenticated = isFirebaseConfigured ? Boolean(firebaseUser) : localAdmin;

  const enterAdmin = () => {
    window.history.pushState({}, '', `?${ADMIN_QUERY_PARAM}=1`);
    setAdminMode(true);
  };

  const exitAdmin = () => {
    if (isFirebaseConfigured && auth) void signOut(auth).catch(console.error);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setLocalAdmin(false);
    setFirebaseUser(null);
    window.history.pushState({}, '', window.location.pathname);
    setAdminMode(false);
  };

  const handleLogin = () => {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    setLocalAdmin(true);
  };

  if (adminMode) {
    return (
      <StoreProvider includeOrders>
        {isAuthenticated ? (
          <AdminShell onExit={exitAdmin} userEmail={firebaseUser?.email ?? undefined} />
        ) : (
          <AdminLogin onSuccess={handleLogin} onBack={exitAdmin} />
        )}
      </StoreProvider>
    );
  }

  return (
    <StoreProvider>
      <Storefront onEnterAdmin={enterAdmin} />
    </StoreProvider>
  );
}

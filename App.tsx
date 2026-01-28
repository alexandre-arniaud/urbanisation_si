import React, { useState, useCallback, useRef } from 'react';
import { INITIAL_PRODUCTS } from './constants';
import { SIState, Order } from './types';
import { ClientInterface } from './components/ClientInterface';
import { AdminInterface } from './components/AdminInterface';
import { KPIDashboard } from './components/KPIDashboard';
import { Leaf, Monitor, Settings, BarChart3, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<SIState>({
    products: INITIAL_PRODUCTS,
    orders: []
  });

  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOrder = useCallback((productId: string, quantity: number) => {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock < quantity) return;

    setState((prevState) => {
      const updatedProducts = prevState.products.map(p =>
        p.id === productId ? { ...p, stock: Math.round((p.stock - quantity) * 100) / 100 } : p
      );

      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        productId,
        productName: product.name,
        quantity,
        timestamp: new Date()
      };

      return {
        products: updatedProducts,
        orders: [...prevState.orders, newOrder]
      };
    });
  }, [state.products]);

  const handleUpdateStock = useCallback((productId: string, newStock: number) => {
    setState((prevState) => ({
      ...prevState,
      products: prevState.products.map(p =>
        p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p
      )
    }));
  }, []);

  const handleUpdateOrderStatus = useCallback((orderId: string, status: 'pending' | 'ready' | 'collected') => {
    setState((prevState) => ({
      ...prevState,
      orders: prevState.orders.map(o =>
        o.id === orderId ? { ...o, status } : o
      )
    }));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 paper-texture pointer-events-none z-50" />

      <header className="fixed top-0 left-0 right-0 z-40 bg-bark-800/95 backdrop-blur-sm border-b border-bark-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-sage-400" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-white">Le Verger du Coin</h1>
                <p className="text-sage-400 text-xs">POC Urbanisation SI</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => scrollToSection(section1Ref)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sage-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Monitor className="w-4 h-4" />
                Interface Client
              </button>
              <button
                onClick={() => scrollToSection(section2Ref)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sage-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Administration
              </button>
              <button
                onClick={() => scrollToSection(section3Ref)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sage-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Pilotage
              </button>
            </nav>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex flex-col justify-center items-center relative bg-gradient-to-br from-bark-800 via-bark-700 to-sage-900 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sage-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            Démonstration POC Urbanisation SI
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
            Le Verger du Coin
          </h1>

          <p className="text-xl md:text-2xl text-sage-300 mb-4">
            Modernisation du Système d'Information
          </p>

          <p className="text-sage-400 max-w-2xl mx-auto mb-12">
            Ce POC illustre la transition numérique d'une exploitation agricole :
            du cahier papier vers un système intégré où la commande client,
            la gestion des stocks et le pilotage communiquent en temps réel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => scrollToSection(section1Ref)}
              className="px-8 py-4 bg-sage-500 hover:bg-sage-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-sage-500/25 hover:shadow-sage-500/40"
            >
              Découvrir le parcours
            </button>
            <button
              onClick={() => scrollToSection(section3Ref)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
            >
              Voir les indicateurs
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            <div>
              <div className="text-3xl font-display font-bold text-white">{state.products.length}</div>
              <div className="text-sage-400 text-sm">Produits</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white">{state.orders.length}</div>
              <div className="text-sage-400 text-sm">Commandes</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white">3</div>
              <div className="text-sage-400 text-sm">Interfaces</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection(section1Ref)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sage-400 hover:text-white transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Défiler</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </section>

      <section ref={section1Ref} className="min-h-screen py-24 bg-gradient-to-b from-cream-100 to-sage-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 text-sage-700 text-xs font-medium mb-4">
              <Monitor className="w-3.5 h-3.5" />
              INTERFACE 1
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-bark-800 mb-4">
              Site Client — Click & Collect
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              L'interface que voit le client final pour passer sa commande.
              Simple, intuitive, accessible sur smartphone ou ordinateur.
            </p>
          </div>

          <ClientInterface products={state.products} onOrder={handleOrder} />
        </div>
      </section>

      <section ref={section2Ref} className="min-h-screen py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-4">
              <Settings className="w-3.5 h-3.5" />
              INTERFACE 2
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-bark-800 mb-4">
              Back-Office Administration
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              L'interface de gestion pour l'exploitant : suivi des commandes en temps réel,
              gestion des stocks, préparation des paniers Click & Collect.
            </p>
          </div>

          <AdminInterface
            state={state}
            onUpdateStock={handleUpdateStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </div>
      </section>

      <section ref={section3Ref} className="min-h-screen py-24 bg-gradient-to-b from-sage-50 to-cream-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium mb-4">
              <BarChart3 className="w-3.5 h-3.5" />
              INTERFACE 3
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-bark-800 mb-4">
              Tableau de Bord — Pilotage
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              La donnée opérationnelle transformée en indicateurs de décision.
              Vision synthétique pour piloter l'activité au quotidien.
            </p>
          </div>

          <KPIDashboard state={state} />
        </div>
      </section>

      <footer className="bg-bark-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sage-500/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-sage-400" />
                </div>
                <span className="font-display text-xl font-bold">Le Verger du Coin</span>
              </div>
              <p className="text-sage-400 text-sm leading-relaxed max-w-md">
                Ce POC illustre les principes d'urbanisation des systèmes d'information
                appliqués à une exploitation agricole fictive. Il démontre l'intégration
                entre les couches de présentation, métier et décisionnelle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Principes démontrés</h3>
              <ul className="space-y-2 text-sm text-sage-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  Unicité de la donnée (référentiel unique)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  Suppression des ressaisies manuelles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  Transformation en données de pilotage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  Architecture modulaire et communicante
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-bark-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sage-500 text-sm">
              POC Urbanisation et Gouvernance des SI — 2025/2026
            </p>
            <p className="text-sage-400 text-sm">
              Réalisé par <span className="text-white font-medium">Alexandre ARNIAUD</span> & <span className="text-white font-medium">Arthur DESAUBLIAUX</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

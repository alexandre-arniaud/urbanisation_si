import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check, MapPin, Clock, Phone, X } from 'lucide-react';
import { Product } from '../types';

interface ClientInterfaceProps {
  products: Product[];
  onOrder: (productId: string, quantity: number) => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const ClientInterface: React.FC<ClientInterfaceProps> = ({ products, onOrder }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(0, Math.min(item.quantity + delta, item.product.stock));
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const confirmOrder = () => {
    cart.forEach(item => {
      onOrder(item.product.id, item.quantity);
    });
    setCart([]);
    setShowCart(false);
    setOrderConfirmed(true);
    setTimeout(() => setOrderConfirmed(false), 5000);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-sage-100">
        <div className="bg-sage-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍎</span>
              <div>
                <h3 className="font-display font-bold text-lg">Le Verger du Coin</h3>
                <p className="text-sage-200 text-xs">Fruits frais • Production locale</p>
              </div>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta-500 rounded-full text-xs font-bold flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-6 text-sm text-sage-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>12 Chemin des Vergers, 69XXX</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Retrait : 9h-18h</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-display font-semibold text-bark-800 mb-1">Commandez en ligne</h4>
            <p className="text-sage-500 text-sm">Retirez vos produits au kiosque quand vous voulez</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {products.map(product => {
              const cartItem = cart.find(item => item.product.id === product.id);
              const inCart = cartItem ? cartItem.quantity : 0;
              const stockPercent = (product.stock / product.initialStock) * 100;
              const isLowStock = stockPercent < 20;

              return (
                <div
                  key={product.id}
                  className="bg-cream-50 rounded-xl p-4 border border-sage-100 hover:border-sage-200 transition-all hover:shadow-md"
                >
                  <div className="text-center mb-3">
                    <span className="text-5xl block mb-2">{product.emoji}</span>
                    <h5 className="font-display font-semibold text-bark-800">{product.name}</h5>
                    <p className="text-sage-500 text-sm">{product.price.toFixed(2)}€ / {product.unit}</p>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={isLowStock ? 'text-terracotta-500 font-medium' : 'text-sage-500'}>
                        {isLowStock ? 'Stock limité' : 'En stock'}
                      </span>
                      <span className="text-sage-600">{product.stock} {product.unit}</span>
                    </div>
                    <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLowStock ? 'bg-terracotta-400' : 'bg-sage-400'}`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>

                  {inCart > 0 ? (
                    <div className="flex items-center justify-between bg-sage-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-8 h-8 rounded-md bg-white flex items-center justify-center hover:bg-sage-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-bark-600" />
                      </button>
                      <span className="font-semibold text-bark-800">{inCart} {product.unit}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={inCart >= product.stock}
                        className="w-8 h-8 rounded-md bg-white flex items-center justify-center hover:bg-sage-50 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 text-bark-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full py-2.5 bg-sage-600 hover:bg-sage-700 text-white font-medium rounded-lg transition-colors disabled:bg-sage-300 disabled:cursor-not-allowed"
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-sage-50 rounded-xl border border-sage-100">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-sage-500" />
              <div>
                <p className="text-sm font-medium text-bark-700">Besoin d'aide ?</p>
                <p className="text-xs text-sage-500">Appelez-nous au 04 XX XX XX XX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-sage-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-display font-bold">Votre panier</h3>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-center text-sage-500 py-8">Votre panier est vide</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-sage-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.product.emoji}</span>
                          <div>
                            <p className="font-medium text-bark-700">{item.product.name}</p>
                            <p className="text-sm text-sage-500">{item.quantity} {item.product.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-bark-800">{(item.product.price * item.quantity).toFixed(2)}€</p>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-6 h-6 rounded bg-white flex items-center justify-center text-sage-600 hover:bg-sage-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-6 h-6 rounded bg-white flex items-center justify-center text-sage-600 hover:bg-sage-100 disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-sage-100 pt-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sage-600">Sous-total</span>
                      <span className="font-medium text-bark-700">{getCartTotal().toFixed(2)}€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-bark-800">Total</span>
                      <span className="font-display text-2xl font-bold text-bark-800">{getCartTotal().toFixed(2)}€</span>
                    </div>
                    <p className="text-xs text-sage-500 mt-2">Paiement au retrait uniquement</p>
                  </div>

                  <button
                    onClick={confirmOrder}
                    className="w-full py-4 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
                  >
                    Confirmer la commande
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {orderConfirmed && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-success">
          <div className="bg-sage-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Commande confirmée !</p>
              <p className="text-sage-200 text-sm">Rendez-vous au kiosque pour le retrait</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

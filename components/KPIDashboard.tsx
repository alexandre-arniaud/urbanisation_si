import React from 'react';
import { TrendingUp, Package, Euro, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, Target } from 'lucide-react';
import { SIState } from '../types';

interface KPIDashboardProps {
  state: SIState;
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ state }) => {
  const totalOrders = state.orders.length;

  const totalRevenue = state.orders.reduce((sum, order) => {
    const product = state.products.find(p => p.id === order.productId);
    return sum + (order.quantity * (product?.price || 0));
  }, 0);

  const totalQuantitySold = state.orders.reduce((sum, order) => sum + order.quantity, 0);

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const salesByProduct = state.orders.reduce((acc, order) => {
    const product = state.products.find(p => p.id === order.productId);
    if (!acc[order.productId]) {
      acc[order.productId] = { quantity: 0, revenue: 0, name: order.productName, emoji: product?.emoji || '' };
    }
    acc[order.productId].quantity += order.quantity;
    acc[order.productId].revenue += order.quantity * (product?.price || 0);
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number; name: string; emoji: string }>);

  const sortedProducts = Object.entries(salesByProduct).sort((a, b) => b[1].revenue - a[1].revenue);
  const bestSeller = sortedProducts[0];

  const lowStockProducts = state.products.filter(p => (p.stock / p.initialStock) * 100 < 20);
  const mediumStockProducts = state.products.filter(p => {
    const percent = (p.stock / p.initialStock) * 100;
    return percent >= 20 && percent < 50;
  });

  const totalInitialValue = state.products.reduce((sum, p) => sum + p.initialStock * p.price, 0);
  const currentStockValue = state.products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const stockUtilization = ((totalInitialValue - currentStockValue) / totalInitialValue) * 100;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-sage-600" />
            </div>
            {totalOrders > 0 && (
              <span className="flex items-center gap-1 text-sage-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                Actif
              </span>
            )}
          </div>
          <p className="text-sage-500 text-sm mb-1">Commandes totales</p>
          <p className="font-display text-4xl font-bold text-bark-800">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6 text-amber-600" />
            </div>
            {totalRevenue > 0 && (
              <span className="flex items-center gap-1 text-sage-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                +{totalRevenue.toFixed(0)}€
              </span>
            )}
          </div>
          <p className="text-sage-500 text-sm mb-1">Chiffre d'affaires</p>
          <p className="font-display text-4xl font-bold text-bark-800">{totalRevenue.toFixed(0)}€</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sage-500 text-sm mb-1">Quantité vendue</p>
          <p className="font-display text-4xl font-bold text-bark-800">{totalQuantitySold.toFixed(0)}</p>
          <p className="text-sage-400 text-xs mt-1">unités (kg/L)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sage-500 text-sm mb-1">Panier moyen</p>
          <p className="font-display text-4xl font-bold text-bark-800">{averageOrderValue.toFixed(1)}€</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {bestSeller && (
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-sage-200" />
              <span className="text-sage-200 text-sm font-medium">Produit phare</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl float-gentle">{bestSeller[1].emoji}</span>
              <div>
                <p className="font-display text-2xl font-bold">{bestSeller[1].name}</p>
                <p className="text-sage-200">
                  {bestSeller[1].quantity.toFixed(0)} unités • {bestSeller[1].revenue.toFixed(2)}€
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-sage-500/30">
              <p className="text-sage-200 text-sm">
                Représente {totalRevenue > 0 ? ((bestSeller[1].revenue / totalRevenue) * 100).toFixed(0) : 0}% du CA
              </p>
            </div>
          </div>
        )}

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <h3 className="font-display font-semibold text-bark-800 mb-4">Répartition des ventes</h3>
          <div className="space-y-4">
            {state.products.map(product => {
              const productSales = salesByProduct[product.id];
              const revenue = productSales?.revenue || 0;
              const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

              return (
                <div key={product.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{product.emoji}</span>
                      <span className="font-medium text-bark-700">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-bark-800">{revenue.toFixed(2)}€</span>
                      <span className="text-sage-400 text-sm ml-2">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="h-3 bg-sage-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-bark-800">État des stocks</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-sage-400" />
                <span className="text-sage-600">OK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sage-600">Attention</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-terracotta-400" />
                <span className="text-sage-600">Critique</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {state.products.map(product => {
              const stockPercent = (product.stock / product.initialStock) * 100;
              const isLowStock = stockPercent < 20;
              const isMediumStock = stockPercent >= 20 && stockPercent < 50;

              return (
                <div key={product.id} className="flex items-center gap-4">
                  <span className="text-2xl w-10">{product.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-bark-700">{product.name}</span>
                      <span className={`text-sm font-semibold ${
                        isLowStock ? 'text-terracotta-600' : isMediumStock ? 'text-amber-600' : 'text-sage-600'
                      }`}>
                        {product.stock} / {product.initialStock} {product.unit}
                      </span>
                    </div>
                    <div className="h-4 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLowStock ? 'bg-terracotta-400' : isMediumStock ? 'bg-amber-400' : 'bg-sage-400'
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                  {isLowStock && (
                    <AlertTriangle className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-sage-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sage-600">Taux d'écoulement global</span>
              <span className="font-display text-2xl font-bold text-bark-800">{stockUtilization.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sage-100">
          <h3 className="font-display font-semibold text-bark-800 mb-6">Alertes & Actions</h3>

          <div className="space-y-4">
            {lowStockProducts.length > 0 && (
              <div className="p-4 bg-terracotta-50 rounded-xl border border-terracotta-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-terracotta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-terracotta-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-terracotta-800">Stock critique</p>
                    <p className="text-sm text-terracotta-600">
                      {lowStockProducts.map(p => p.name).join(', ')} — moins de 20% restant
                    </p>
                    <p className="text-xs text-terracotta-500 mt-1">Réapprovisionnement urgent recommandé</p>
                  </div>
                </div>
              </div>
            )}

            {mediumStockProducts.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">Stock à surveiller</p>
                    <p className="text-sm text-amber-600">
                      {mediumStockProducts.map(p => p.name).join(', ')} — entre 20% et 50%
                    </p>
                    <p className="text-xs text-amber-500 mt-1">Prévoir un réapprovisionnement</p>
                  </div>
                </div>
              </div>
            )}

            {lowStockProducts.length === 0 && mediumStockProducts.length === 0 && (
              <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-800">Stocks en bon état</p>
                    <p className="text-sm text-sage-600">Tous les produits ont un niveau de stock supérieur à 50%</p>
                  </div>
                </div>
              </div>
            )}

            {totalOrders > 0 && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Activité en cours</p>
                    <p className="text-sm text-blue-600">
                      {totalOrders} commande{totalOrders > 1 ? 's' : ''} enregistrée{totalOrders > 1 ? 's' : ''} pour un total de {totalRevenue.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-bark-700 to-bark-800 rounded-2xl p-8 text-white">
        <h3 className="font-display text-xl font-bold mb-4">Ce que ce tableau de bord démontre</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sage-300 text-sm mb-2">Donnée opérationnelle</p>
            <p className="text-white">Chaque vente enregistrée alimente automatiquement les indicateurs</p>
          </div>
          <div>
            <p className="text-sage-300 text-sm mb-2">Transformation en temps réel</p>
            <p className="text-white">Les données brutes deviennent des KPIs actionnables instantanément</p>
          </div>
          <div>
            <p className="text-sage-300 text-sm mb-2">Aide à la décision</p>
            <p className="text-white">Alertes automatiques pour anticiper les ruptures de stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

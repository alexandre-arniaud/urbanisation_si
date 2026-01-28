import React, { useState } from 'react';
import { Package, ClipboardList, AlertTriangle, Check, Clock, ShoppingBag, Edit3, Save, X, RefreshCw } from 'lucide-react';
import { SIState } from '../types';

interface AdminInterfaceProps {
  state: SIState;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'ready' | 'collected') => void;
}

export const AdminInterface: React.FC<AdminInterfaceProps> = ({ state, onUpdateStock, onUpdateOrderStatus }) => {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const startEdit = (productId: string, currentStock: number) => {
    setEditingProductId(productId);
    setEditStock(currentStock);
  };

  const saveEdit = () => {
    if (editingProductId) {
      onUpdateStock(editingProductId, editStock);
      setEditingProductId(null);
    }
  };

  const cancelEdit = () => {
    setEditingProductId(null);
  };

  const pendingOrders = state.orders.filter(o => !o.status || o.status === 'pending');
  const readyOrders = state.orders.filter(o => o.status === 'ready');
  const collectedOrders = state.orders.filter(o => o.status === 'collected');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ready': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'collected': return 'bg-sage-100 text-sage-700 border-sage-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'collected': return 'Retiré';
      default: return 'En attente';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-lg border border-sage-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">Gestion des Stocks</h3>
              <p className="text-blue-200 text-sm">Référentiel produits</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {state.products.map(product => {
              const stockPercent = (product.stock / product.initialStock) * 100;
              const isLowStock = stockPercent < 20;
              const isMediumStock = stockPercent >= 20 && stockPercent < 50;
              const isEditing = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isLowStock ? 'bg-terracotta-50 border-terracotta-200' :
                    isMediumStock ? 'bg-amber-50 border-amber-200' :
                    'bg-sage-50 border-sage-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-bark-800">{product.name}</h4>
                        <p className="text-sm text-sage-600">{product.price.toFixed(2)}€ / {product.unit}</p>
                      </div>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-terracotta-100 text-terracotta-700 rounded-lg text-xs font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Stock critique
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-sage-600">Stock actuel</span>
                        <span className="font-medium text-bark-700">{Math.round(stockPercent)}%</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLowStock ? 'bg-terracotta-500' : isMediumStock ? 'bg-amber-500' : 'bg-sage-500'
                          }`}
                          style={{ width: `${stockPercent}%` }}
                        />
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(parseFloat(e.target.value) || 0)}
                          className="w-20 px-3 py-2 border border-sage-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                          min="0"
                          max={product.initialStock}
                        />
                        <span className="text-sm text-sage-500">{product.unit}</span>
                        <button
                          onClick={saveEdit}
                          className="p-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-sage-200 text-sage-700 rounded-lg hover:bg-sage-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-white rounded-lg border border-sage-200">
                          <span className="font-display text-xl font-bold text-bark-800">{product.stock}</span>
                          <span className="text-sage-500 ml-1">{product.unit}</span>
                        </div>
                        <button
                          onClick={() => startEdit(product.id, product.stock)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Modifier le stock"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onUpdateStock(product.id, product.initialStock)}
                          className="p-2 bg-sage-100 text-sage-600 rounded-lg hover:bg-sage-200 transition-colors"
                          title="Réapprovisionner"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700">
              <strong>Astuce :</strong> Cliquez sur <Edit3 className="w-3.5 h-3.5 inline" /> pour ajuster manuellement
              ou <RefreshCw className="w-3.5 h-3.5 inline" /> pour réapprovisionner au niveau initial.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-sage-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Commandes Click & Collect</h3>
                <p className="text-amber-100 text-sm">Préparation et retrait</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold">{pendingOrders.length}</p>
              <p className="text-amber-100 text-xs">en attente</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <p className="text-2xl font-display font-bold text-blue-700">{pendingOrders.length}</p>
              <p className="text-xs text-blue-600">À préparer</p>
            </div>
            <div className="flex-1 p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <p className="text-2xl font-display font-bold text-amber-700">{readyOrders.length}</p>
              <p className="text-xs text-amber-600">Prêts</p>
            </div>
            <div className="flex-1 p-3 bg-sage-50 rounded-xl border border-sage-100 text-center">
              <p className="text-2xl font-display font-bold text-sage-700">{collectedOrders.length}</p>
              <p className="text-xs text-sage-600">Retirés</p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scroll">
            {state.orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-sage-400" />
                </div>
                <p className="text-sage-500 font-medium">Aucune commande</p>
                <p className="text-sage-400 text-sm">Les commandes apparaîtront ici</p>
              </div>
            ) : (
              state.orders.slice().reverse().map((order, idx) => {
                const product = state.products.find(p => p.id === order.productId);
                const status = order.status || 'pending';

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border bg-white transition-all ${idx === 0 && status === 'pending' ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product?.emoji}</span>
                        <div>
                          <p className="font-semibold text-bark-800">{order.productName}</p>
                          <p className="text-sm text-sage-500">
                            {order.quantity} {product?.unit} •
                            <span className="font-medium"> {((order.quantity) * (product?.price || 0)).toFixed(2)}€</span>
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusLabel(status)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-sage-400">
                        <Clock className="w-3.5 h-3.5" />
                        {order.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-sage-300">•</span>
                        <span className="font-mono">{order.id}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {status === 'pending' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-200 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Prêt
                          </button>
                        )}
                        {status === 'ready' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'collected')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-100 text-sage-700 rounded-lg text-xs font-medium hover:bg-sage-200 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Retiré
                          </button>
                        )}
                        {status === 'collected' && (
                          <span className="flex items-center gap-1.5 text-sage-500 text-xs">
                            <Check className="w-3.5 h-3.5" />
                            Terminé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

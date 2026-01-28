import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Pommes', stock: 100, initialStock: 100, unit: 'kg', price: 3.50, emoji: '🍎' },
  { id: '2', name: 'Poires', stock: 80, initialStock: 80, unit: 'kg', price: 4.20, emoji: '🍐' },
  { id: '3', name: 'Jus de pomme', stock: 50, initialStock: 50, unit: 'L', price: 5.00, emoji: '🧃' }
];

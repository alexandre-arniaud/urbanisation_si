export interface Product {
  id: string;
  name: string;
  stock: number;
  initialStock: number;
  unit: string;
  price: number;
  emoji: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  timestamp: Date;
  status?: 'pending' | 'ready' | 'collected';
}

export interface SIState {
  products: Product[];
  orders: Order[];
}

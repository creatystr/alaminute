// Product Types
export interface ProductVariant {
  sku: string;
  size: string;
  frame: string;
  glass: string;
  price: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  artist?: string;
  category: 'minimalist' | 'nature' | 'abstract' | 'typography';
  tags: string[];
  images: string[];
  basePrice: number;
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface OrderCustomer {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  address: CustomerAddress;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderNo: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentId?: string;
  trackingNo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface UserAddress {
  title: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: UserAddress[];
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

// Size, Frame, Glass Options
export const SIZE_OPTIONS = [
  { value: '21x30', label: '21x30 cm (A4)', multiplier: 1.0 },
  { value: '30x40', label: '30x40 cm', multiplier: 1.3 },
  { value: '40x50', label: '40x50 cm', multiplier: 1.6 },
  { value: '50x70', label: '50x70 cm', multiplier: 2.0 },
  { value: '70x100', label: '70x100 cm', multiplier: 3.0 },
] as const;

export const FRAME_OPTIONS = [
  { value: 'none', label: 'Çerçevesiz', price: 0 },
  { value: 'black', label: 'Siyah', price: 80 },
  { value: 'white', label: 'Beyaz', price: 80 },
  { value: 'natural', label: 'Doğal Ahşap', price: 100 },
  { value: 'walnut', label: 'Ceviz', price: 150 },
] as const;

export const GLASS_OPTIONS = [
  { value: 'none', label: 'Camsız', price: 0 },
  { value: 'standard', label: 'Standart Cam', price: 40 },
  { value: 'anti-reflective', label: 'Yansıma Önleyici', price: 100 },
  { value: 'acrylic', label: 'Akrilik', price: 80 },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'nature', label: 'Doğa' },
  { value: 'abstract', label: 'Soyut' },
  { value: 'typography', label: 'Tipografi' },
] as const;

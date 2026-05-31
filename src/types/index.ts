export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  stock: number;
  variants: ProductVariant[] | null;
  rating?: number;
  reviewCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  variantId: string | null;
  name: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface Cart {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  fullName?: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  postcode?: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

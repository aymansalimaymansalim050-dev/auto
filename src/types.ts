export type UserRole = 'buyer' | 'seller_private' | 'seller_dealer' | 'affiliate' | 'admin';

export type SaleType = 'direct' | 'secure_affiliate';

export type PromotionTier = 'standard' | 'highlighted' | 'top_europe' | 'inspected';

export interface User {
  id: number;
  uid: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  country: string;
  city?: string | null;
  avatarUrl?: string | null;
  companyName?: string | null;
  verified: boolean;
  affiliateCode?: string | null;
  createdAt?: string;
}

export interface Car {
  id: number;
  sellerId: number;
  title: string;
  brand: string;
  model: string;
  version?: string | null;
  year: number;
  price: number; // in EUR
  mileage: number; // in km
  fuelType: string; // 'Gasolina', 'Diésel', 'Híbrido', 'Híbrido Enchufable', 'Eléctrico', 'GLP'
  transmission: string; // 'Manual', 'Automático'
  bodyType: string; // 'SUV', 'Sedán', 'Compacto', 'Familiar', 'Coupé', 'Cabrio', 'Furgoneta'
  powerHp: number;
  engineSize?: string | null;
  doors: number;
  seats: number;
  color?: string | null;
  co2Emissions?: number | null;
  consumption?: string | null;
  country: string;
  city: string;
  postalCode?: string | null;
  description: string;
  features: string[]; // parsed from JSON
  images: string[]; // parsed from JSON
  saleType: SaleType;
  affiliateId?: number | null;
  affiliateFee?: number | null;
  promotionLevel: PromotionTier;
  promotionExpiresAt?: string | null;
  status: 'active' | 'reserved' | 'sold' | 'pending_approval';
  viewsCount: number;
  favoritesCount: number;
  createdAt?: string;
  seller?: User;
  affiliate?: User;
}

export interface CarFilters {
  search?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: string;
  country?: string;
  city?: string;
  transmission?: string;
  bodyType?: string;
  saleType?: SaleType | 'all';
  promotionOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'views_desc';
}

export interface Conversation {
  id: number;
  carId: number;
  buyerId: number;
  sellerId: number;
  affiliateId?: number | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  createdAt?: string;
  car?: Car;
  buyer?: User;
  seller?: User;
  affiliate?: User;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  message: string;
  offerAmount?: number | null;
  isOffer: boolean;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | null;
  createdAt: string;
  sender?: User;
}

export interface AffiliateAssignment {
  id: number;
  affiliateId: number;
  carId: number;
  sellerId: number;
  buyerId?: number | null;
  status: 'assigned' | 'inspecting' | 'docs_in_progress' | 'completed' | 'cancelled';
  commissionAmount: number;
  commissionPaid: boolean;
  inspectionReport?: string | null;
  notes?: string | null;
  createdAt: string;
  car?: Car;
  seller?: User;
  buyer?: User;
  affiliate?: User;
}

export interface SavedSearch {
  id: number;
  userId: number;
  name: string;
  filters: CarFilters;
  createdAt: string;
}

export interface PromotionPlan {
  tier: PromotionTier;
  name: string;
  price: number; // EUR
  badgeColor: string;
  durationDays: number;
  benefits: string[];
}

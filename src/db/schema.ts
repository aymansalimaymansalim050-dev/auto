import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (Buyers, Private Sellers, Professional Dealers, Affiliates, Admins)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or internal fallback
  email: text('email').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull().default('buyer'), // 'buyer', 'seller_private', 'seller_dealer', 'affiliate', 'admin'
  country: text('country').notNull().default('España'),
  city: text('city'),
  avatarUrl: text('avatar_url'),
  companyName: text('company_name'),
  verified: boolean('verified').notNull().default(false),
  affiliateCode: text('affiliate_code'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cars listed on the European marketplace
export const cars = pgTable('cars', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  version: text('version'),
  year: integer('year').notNull(),
  price: integer('price').notNull(), // EUR
  mileage: integer('mileage').notNull(), // km
  fuelType: text('fuel_type').notNull(), // 'Gasolina', 'Diésel', 'Híbrido', 'Híbrido Enchufable', 'Eléctrico', 'GLP'
  transmission: text('transmission').notNull(), // 'Manual', 'Automático'
  bodyType: text('body_type').notNull(), // 'SUV', 'Sedán', 'Compacto', 'Familiar', 'Coupé', 'Cabrio', 'Furgoneta'
  powerHp: integer('power_hp').notNull().default(150),
  engineSize: text('engine_size').default('2.0 L'),
  doors: integer('doors').default(5),
  seats: integer('seats').default(5),
  color: text('color').default('Blanco'),
  co2Emissions: integer('co2_emissions').default(120),
  consumption: text('consumption').default('5.2 l/100km'),
  country: text('country').notNull().default('España'), // European countries
  city: text('city').notNull(),
  postalCode: text('postal_code'),
  description: text('description').notNull(),
  features: text('features').notNull().default('[]'), // JSON array of string features
  images: text('images').notNull().default('[]'), // JSON array of image URLs
  saleType: text('sale_type').notNull().default('direct'), // 'direct' or 'secure_affiliate'
  affiliateId: integer('affiliate_id').references(() => users.id),
  affiliateFee: integer('affiliate_fee').default(450), // EUR
  promotionLevel: text('promotion_level').notNull().default('standard'), // 'standard', 'highlighted', 'top_europe', 'inspected'
  promotionExpiresAt: timestamp('promotion_expires_at'),
  status: text('status').notNull().default('active'), // 'active', 'reserved', 'sold', 'pending_approval'
  viewsCount: integer('views_count').notNull().default(0),
  favoritesCount: integer('favorites_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Promotions purchased to highlight cars
export const carPromotions = pgTable('car_promotions', {
  id: serial('id').primaryKey(),
  carId: integer('car_id').references(() => cars.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  tier: text('tier').notNull(), // 'highlighted', 'top_europe', 'inspected'
  pricePaid: integer('price_paid').notNull(), // EUR
  durationDays: integer('duration_days').notNull().default(30),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Favorites
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  carId: integer('car_id').references(() => cars.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Saved Searches
export const savedSearches = pgTable('saved_searches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  filters: text('filters').notNull(), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
});

// Chat Conversations between Buyer, Seller and optional Affiliate
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  carId: integer('car_id').references(() => cars.id).notNull(),
  buyerId: integer('buyer_id').references(() => users.id).notNull(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  affiliateId: integer('affiliate_id').references(() => users.id),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Chat Messages
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => conversations.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  offerAmount: integer('offer_amount'),
  isOffer: boolean('is_offer').notNull().default(false),
  offerStatus: text('offer_status'), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp('created_at').defaultNow(),
});

// Affiliate Safe Sale Operations & Commission Records
export const affiliateAssignments = pgTable('affiliate_assignments', {
  id: serial('id').primaryKey(),
  affiliateId: integer('affiliate_id').references(() => users.id).notNull(),
  carId: integer('car_id').references(() => cars.id).notNull(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  buyerId: integer('buyer_id').references(() => users.id),
  status: text('status').notNull().default('assigned'), // 'assigned', 'inspecting', 'docs_in_progress', 'completed', 'cancelled'
  commissionAmount: integer('commission_amount').notNull().default(450),
  commissionPaid: boolean('commission_paid').notNull().default(false),
  inspectionReport: text('inspection_report'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  cars: many(cars),
  favorites: many(favorites),
  savedSearches: many(savedSearches),
  sentMessages: many(messages),
  affiliateAssignments: many(affiliateAssignments),
}));

export const carsRelations = relations(cars, ({ one, many }) => ({
  seller: one(users, {
    fields: [cars.sellerId],
    references: [users.id],
  }),
  affiliate: one(users, {
    fields: [cars.affiliateId],
    references: [users.id],
  }),
  promotions: many(carPromotions),
  favorites: many(favorites),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  car: one(cars, {
    fields: [conversations.carId],
    references: [cars.id],
  }),
  buyer: one(users, {
    fields: [conversations.buyerId],
    references: [users.id],
  }),
  seller: one(users, {
    fields: [conversations.sellerId],
    references: [users.id],
  }),
  affiliate: one(users, {
    fields: [conversations.affiliateId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const affiliateAssignmentsRelations = relations(affiliateAssignments, ({ one }) => ({
  car: one(cars, {
    fields: [affiliateAssignments.carId],
    references: [cars.id],
  }),
  seller: one(users, {
    fields: [affiliateAssignments.sellerId],
    references: [users.id],
  }),
  buyer: one(users, {
    fields: [affiliateAssignments.buyerId],
    references: [users.id],
  }),
  affiliate: one(users, {
    fields: [affiliateAssignments.affiliateId],
    references: [users.id],
  }),
}));

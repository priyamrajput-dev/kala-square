import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { artists } from './artists.js';

export interface EnquiryNote {
  id: string;
  text: string;
  createdAt: string;
}

export const enquiries = pgTable('enquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  artistId: uuid('artist_id').references(() => artists.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  city: varchar('city', { length: 100 }),
  eventDate: varchar('event_date', { length: 50 }),
  eventType: varchar('event_type', { length: 100 }),
  budgetRange: varchar('budget_range', { length: 50 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('new'), // new, contacted, booked, closed
  notes: jsonb('notes').$type<EnquiryNote[]>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;

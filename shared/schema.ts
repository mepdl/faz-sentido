import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth types
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // UUID String
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(), // UUID String
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  status: text("status").notNull().default("draft"), // 'draft', 'published'
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  authorId: text("author_id"),
  authorName: text("author_name"),
  categoryId: text("category_id").references(() => categories.id), // UUID String
  isFeatured: boolean("is_featured").default(false),
  readTime: integer("read_time").default(5), // Integer in DB
  seoKeywords: text("seo_keywords"),
  views: integer("views").default(0),
  affiliateLinks: jsonb("affiliate_links").default([]),
});

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletter = pgTable("newsletter", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===

export const insertPostSchema = createInsertSchema(posts, {
  readTime: z.coerce.number().default(5),
  categoryId: z.coerce.string().nullable().optional(),
  isFeatured: z.coerce.boolean().default(false),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});

export const insertNewsletterSchema = createInsertSchema(newsletter).omit({
  id: true,
  createdAt: true
});

// === EXPLICIT API CONTRACT TYPES ===

import type { User } from "./models/auth";

// Base types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Newsletter = typeof newsletter.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;

// Request types
export type CreatePostRequest = InsertPost;
export type UpdatePostRequest = Partial<InsertPost>;
export type CreateCategoryRequest = InsertCategory;

// Response types
export type PostResponse = Post & { category?: Category | null, author?: User | null };
export type CategoryResponse = Category;
export type PostsListResponse = PostResponse[];

// Query/filter types
export interface PostsQueryParams {
  category?: string;
  status?: 'draft' | 'published';
  search?: string;
  limit?: number;
}

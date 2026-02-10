import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
// Import auth models to ensure they are available
export * from "./models/auth";
import { users } from "./models/auth";

// === TABLE DEFINITIONS ===

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  status: text("status").notNull().default("draft"), // 'draft', 'published'
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  authorId: text("author_id").references(() => users.id), // Changed to text to match Replit Auth user ID
  categoryId: integer("category_id").references(() => categories.id),
  isFeatured: boolean("is_featured").default(false),
  readTime: integer("read_time").default(5), // in minutes
  seoKeywords: text("seo_keywords"),
});

// === RELATIONS ===

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

// === BASE SCHEMAS ===

export const insertPostSchema = createInsertSchema(posts).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCategorySchema = createInsertSchema(categories).omit({ 
  id: true 
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Request types
export type CreatePostRequest = InsertPost;
export type UpdatePostRequest = Partial<InsertPost>;
export type CreateCategoryRequest = InsertCategory;

// Response types
export type PostResponse = Post & { category?: Category | null, author?: typeof users.$inferSelect | null };
export type CategoryResponse = Category;
export type PostsListResponse = PostResponse[];

// Query/filter types
export interface PostsQueryParams {
  category?: string;
  status?: 'draft' | 'published';
  search?: string;
  limit?: number;
}

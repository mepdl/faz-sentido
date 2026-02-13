import { db } from "./db";
import { 
  posts, categories, contacts, newsletter,
  type Post, type InsertPost, type UpdatePostRequest,
  type Category, type InsertCategory,
  type PostsQueryParams,
  type InsertContact, type Contact,
  type InsertNewsletter, type Newsletter
} from "@shared/schema";
import { users } from "@shared/models/auth";
import { eq, desc, ilike, and } from "drizzle-orm";

export interface IStorage {
  // Posts
  getPosts(params?: PostsQueryParams): Promise<(Post & { category: Category | null, author: typeof users.$inferSelect | null })[]>;
  getPost(id: number): Promise<(Post & { category: Category | null, author: typeof users.$inferSelect | null }) | undefined>;
  getPostBySlug(slug: string): Promise<(Post & { category: Category | null, author: typeof users.$inferSelect | null }) | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: UpdatePostRequest): Promise<Post>;
  deletePost(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  // Contact & Newsletter
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  deleteContact(id: number): Promise<void>;
  subscribeNewsletter(email: InsertNewsletter): Promise<Newsletter>;
  getSubscribers(): Promise<Newsletter[]>;
  deleteSubscriber(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPosts(params?: PostsQueryParams) {
    let query = db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      status: posts.status,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      isFeatured: posts.isFeatured,
      readTime: posts.readTime,
      seoKeywords: posts.seoKeywords,
      category: categories,
      author: users
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(users, eq(posts.authorId, users.id));

    const conditions = [];
    
    if (params?.status) {
      conditions.push(eq(posts.status, params.status));
    }
    
    if (params?.category) {
      const category = await this.getCategoryBySlug(params.category);
      if (category) {
        conditions.push(eq(posts.categoryId, category.id));
      }
    }

    if (params?.search) {
      conditions.push(ilike(posts.title, `%${params.search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(posts.publishedAt)) as any;

    if (params?.limit) {
      query = query.limit(params.limit) as any;
    }

    const results = await query;
    return results.map(row => ({
      ...row,
      category: row.category,
      author: row.author
    }));
  }

  async getPost(id: number) {
    const [result] = await db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      status: posts.status,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      isFeatured: posts.isFeatured,
      readTime: posts.readTime,
      seoKeywords: posts.seoKeywords,
      category: categories,
      author: users
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id));
    
    if (!result) return undefined;
    return {
      ...result,
      category: result.category,
      author: result.author
    };
  }

  async getPostBySlug(slug: string) {
    const [result] = await db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      status: posts.status,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      isFeatured: posts.isFeatured,
      readTime: posts.readTime,
      seoKeywords: posts.seoKeywords,
      category: categories,
      author: users
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, slug));
    
    if (!result) return undefined;
    return {
      ...result,
      category: result.category,
      author: result.author
    };
  }

  async createPost(post: InsertPost) {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: UpdatePostRequest) {
    const [updatedPost] = await db.update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number) {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getCategories() {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async getCategoryBySlug(slug: string) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createContact(contact: InsertContact) {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async subscribeNewsletter(sub: InsertNewsletter) {
    const [newSub] = await db.insert(newsletter).values(sub).returning();
    return newSub;
  }

  async getContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async deleteContact(id: number) {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  async getSubscribers() {
    return await db.select().from(newsletter).orderBy(desc(newsletter.createdAt));
  }

  async deleteSubscriber(id: number) {
    await db.delete(newsletter).where(eq(newsletter.id, id));
  }
}

export const storage = new DatabaseStorage();

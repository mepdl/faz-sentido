import { supabase } from "./supabase";
import {
  type Post, type InsertPost, type UpdatePostRequest,
  type Category, type InsertCategory,
  type PostsQueryParams,
  type InsertContact, type Contact,
  type InsertNewsletter, type Newsletter
} from "@shared/schema";
import { type User } from "@shared/models/auth";

export interface IStorage {
  // Posts
  getPosts(params?: PostsQueryParams): Promise<(Post & { category: Category | null, author: User | null })[]>;
  getPost(id: string): Promise<(Post & { category: Category | null, author: User | null }) | undefined>;
  getPostBySlug(slug: string): Promise<(Post & { category: Category | null, author: User | null }) | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: UpdatePostRequest): Promise<Post>;
  deletePost(id: string): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  // Contact & Newsletter
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  deleteContact(id: string): Promise<void>;
  subscribeNewsletter(email: InsertNewsletter): Promise<Newsletter>;
  getSubscribers(): Promise<Newsletter[]>;
  deleteSubscriber(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPosts(params?: PostsQueryParams) {
    let query = supabase
      .from('posts')
      .select('*');

    if (params?.status) {
      query = query.eq('status', params.status);
    }

    if (params?.category) {
      const { data: category } = await supabase.from('categories').select('id').eq('slug', params.category).single();
      if (category) {
        query = query.eq('category_id', category.id);
      } else {
        return []; // Category not found
      }
    }

    if (params?.search) {
      query = query.ilike('title', `%${params.search}%`);
    }

    query = query.order('published_at', { ascending: false });

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data: postsData, error } = await query;
    if (error) throw error;
    if (!postsData) return [];

    // Manually fetch relations to avoid foreign key errors
    const categoryIds = Array.from(new Set(postsData.map((p: any) => p.category_id).filter(Boolean)));
    const authorIds = Array.from(new Set(postsData.map((p: any) => p.author_id).filter(Boolean)));

    let categoriesMap = new Map();
    if (categoryIds.length > 0) {
      const { data: categories } = await supabase.from('categories').select('*').in('id', categoryIds);
      if (categories) {
        categories.forEach((c: any) => categoriesMap.set(c.id, c));
      }
    }

    let authorsMap = new Map();
    if (authorIds.length > 0) {
      const { data: authors } = await supabase.from('users').select('*').in('id', authorIds);
      if (authors) {
        authors.forEach((a: any) => authorsMap.set(a.id, this.mapUserFromDB(a)));
      }
    }

    return postsData.map((post: any) => {
      const mappedPost = this.mapPostFromDB(post);
      mappedPost.category = categoriesMap.get(post.category_id) || null;
      mappedPost.author = authorsMap.get(post.author_id) || null;
      return mappedPost;
    });
  }

  async getPost(id: string) {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) return undefined;

    const mappedPost = this.mapPostFromDB(post);

    if (post.category_id) {
      const { data: category } = await supabase.from('categories').select('*').eq('id', post.category_id).single();
      mappedPost.category = category || null;
    }

    if (post.author_id) {
      const { data: author } = await supabase.from('users').select('*').eq('id', post.author_id).single();
      mappedPost.author = author ? this.mapUserFromDB(author) : null;
    }

    return mappedPost;
  }

  async getPostBySlug(slug: string) {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !post) return undefined;

    const mappedPost = this.mapPostFromDB(post);

    if (post.category_id) {
      const { data: category } = await supabase.from('categories').select('*').eq('id', post.category_id).single();
      mappedPost.category = category || null;
    }

    if (post.author_id) {
      const { data: author } = await supabase.from('users').select('*').eq('id', post.author_id).single();
      mappedPost.author = author ? this.mapUserFromDB(author) : null;
    }

    return mappedPost;
  }

  async createPost(post: InsertPost) {
    const dbPost = this.mapPostToDB(post);

    // Set published_at if status is 'published' and it's not already set
    if (dbPost.status === 'published' && !dbPost.published_at) {
      dbPost.published_at = new Date();
    }

    const { data, error } = await supabase.from('posts').insert(dbPost).select().single();
    if (error) throw error;
    return this.mapPostFromDB(data);
  }

  async updatePost(id: string, updates: UpdatePostRequest) {
    // Get existing post to check current published_at
    const existingPost = await this.getPost(id);
    const dbUpdates = this.mapPostToDB(updates);

    // Set published_at if status is changed to 'published' and it wasn't published before
    if (dbUpdates.status === 'published' && (!existingPost || !existingPost.publishedAt)) {
      dbUpdates.published_at = new Date();
    }

    const { data, error } = await supabase
      .from('posts')
      .update({ ...dbUpdates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapPostFromDB(data);
  }

  async deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  }

  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  }

  async createCategory(category: InsertCategory) {
    const { data, error } = await supabase.from('categories').insert(category).select().single();
    if (error) throw error;
    return data;
  }

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
    if (error || !data) return undefined;
    return data;
  }

  async createContact(contact: InsertContact) {
    const { data, error } = await supabase.from('contacts').insert({
      name: contact.name,
      email: contact.email,
      message: contact.message
    }).select().single();
    if (error) throw error;
    return this.mapContactFromDB(data);
  }

  async subscribeNewsletter(sub: InsertNewsletter) {
    const { data, error } = await supabase.from('newsletter').insert(sub).select().single();
    if (error) throw error;
    return this.mapNewsletterFromDB(data);
  }

  async getContacts() {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data ? data.map(this.mapContactFromDB) : [];
  }

  async deleteContact(id: string) {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
  }

  async getSubscribers() {
    const { data, error } = await supabase.from('newsletter').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data ? data.map(this.mapNewsletterFromDB) : [];
  }

  async deleteSubscriber(id: string) {
    const { error } = await supabase.from('newsletter').delete().eq('id', id);
    if (error) throw error;
  }

  // Mappers to handle snake_case (DB) <-> camelCase (App)
  private mapPostToDB(post: any) {
    const mapped: any = { ...post };
    if (post.coverImage !== undefined) { mapped.cover_image = post.coverImage; delete mapped.coverImage; }
    if (post.authorId !== undefined) { mapped.author_id = post.authorId; delete mapped.authorId; }
    if (post.categoryId !== undefined) { mapped.category_id = post.categoryId; delete mapped.categoryId; }
    if (post.isFeatured !== undefined) { mapped.is_featured = post.isFeatured; delete mapped.isFeatured; }
    if (post.readTime !== undefined) { mapped.read_time = post.readTime; delete mapped.readTime; }
    if (post.seoKeywords !== undefined) { mapped.seo_keywords = post.seoKeywords; delete mapped.seoKeywords; }
    if (post.authorName !== undefined) { mapped.author_name = post.authorName; delete mapped.authorName; }
    if (post.publishedAt !== undefined) { mapped.published_at = post.publishedAt; delete mapped.publishedAt; }
    if (post.affiliateLinks !== undefined) { mapped.affiliate_links = post.affiliateLinks; delete mapped.affiliateLinks; }
    return mapped;
  }

  private mapPostFromDB(dbPost: any): any {
    return {
      ...dbPost,
      coverImage: dbPost.cover_image,
      authorId: dbPost.author_id,
      categoryId: dbPost.category_id,
      isFeatured: dbPost.is_featured,
      readTime: dbPost.read_time,
      seoKeywords: dbPost.seo_keywords,
      authorName: dbPost.author_name,
      publishedAt: dbPost.published_at ? new Date(dbPost.published_at) : null,
      createdAt: dbPost.created_at ? new Date(dbPost.created_at) : null,
      updatedAt: dbPost.updated_at ? new Date(dbPost.updated_at) : null,
      affiliateLinks: dbPost.affiliate_links || [],

      // Relations
      category: dbPost.category,
      author: dbPost.author ? this.mapUserFromDB(dbPost.author) : null
    };
  }

  private mapUserFromDB(dbUser: any): any {
    return {
      ...dbUser,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      profileImageUrl: dbUser.profile_image_url,
      createdAt: dbUser.created_at ? new Date(dbUser.created_at) : null,
      updatedAt: dbUser.updated_at ? new Date(dbUser.updated_at) : null,
    };
  }

  private mapContactFromDB(dbContact: any): any {
    return {
      ...dbContact,
      createdAt: dbContact.created_at ? new Date(dbContact.created_at) : null
    }
  }

  private mapNewsletterFromDB(dbNews: any): any {
    return {
      ...dbNews,
      createdAt: dbNews.created_at ? new Date(dbNews.created_at) : null
    }
  }
}

export const storage = new DatabaseStorage();

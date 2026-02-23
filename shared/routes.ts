import { z } from 'zod';
import { insertPostSchema, insertCategorySchema, posts, categories, newsletter, contacts, PostResponse, CategoryResponse } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts',
      input: z.object({
        category: z.string().optional(),
        status: z.enum(['draft', 'published']).optional(),
        search: z.string().optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<PostResponse>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/posts/:idOrSlug',
      responses: {
        200: z.custom<PostResponse>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts',
      input: insertPostSchema,
      responses: {
        201: z.custom<PostResponse>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/posts/:id',
      input: insertPostSchema.partial(),
      responses: {
        200: z.custom<PostResponse>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/posts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories',
      responses: {
        200: z.array(z.custom<CategoryResponse>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/categories',
      input: insertCategorySchema,
      responses: {
        201: z.custom<CategoryResponse>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  subscribers: {
    list: {
      method: 'GET' as const,
      path: '/api/subscribers',
      responses: {
        200: z.array(z.custom<typeof newsletter.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/subscribers/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  contacts: {
    list: {
      method: 'GET' as const,
      path: '/api/contacts',
      responses: {
        200: z.array(z.custom<typeof contacts.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/contacts/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type PostInput = z.infer<typeof api.posts.create.input>;
export type PostUpdateInput = z.infer<typeof api.posts.update.input>;
export type CategoryInput = z.infer<typeof api.categories.create.input>;
export type InsertCategory = CategoryInput;

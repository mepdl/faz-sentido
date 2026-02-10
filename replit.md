# Diário de Crescimento - Blog Platform

## Overview

Diário de Crescimento ("Growth Diary") is a Portuguese-language blog platform focused on personal growth, business, finance, mindset, and technology. It transforms educational content, interviews, and expert ideas into practical, accessible articles. The platform includes a public-facing blog with category browsing and an admin dashboard for content management. It is designed for monetization through Google AdSense and affiliate marketing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state (data fetching, caching, mutations)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Rich Text Editor**: Tiptap (with StarterKit, Image, and Link extensions) for blog post authoring
- **Styling**: Tailwind CSS with CSS custom properties for theming. Three font families: Outfit (display/headings), Plus Jakarta Sans (body), Inter (sans/UI)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Public Pages
- Home (`/`) - Hero section with featured post, recent posts, category sections
- Post Detail (`/post/:slug`) - Full article view
- Category Page (`/category/:slug`) - Posts filtered by category
- About, Privacy, Terms, Contact - Static/informational pages

### Admin Pages
- Dashboard (`/admin`)
- Posts List (`/admin/posts`)
- Post Editor (`/admin/posts/new` and `/admin/posts/edit/:id`)
- Categories List (`/admin/categories`)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript, executed via tsx in development
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **API Contract**: Shared route definitions in `shared/routes.ts` with Zod schemas for input validation and response typing
- **Build**: Custom build script using Vite for client and esbuild for server, outputting to `dist/`
- **Dev Server**: Vite dev server with HMR proxied through Express middleware
- **Production**: Static files served from `dist/public/` with SPA fallback

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod integration
- **Schema location**: `shared/schema.ts` and `shared/models/auth.ts`
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Tables**:
  - `users` - User accounts (varchar ID, email, name, profile image, timestamps)
  - `sessions` - Session storage for authentication (sid, sess JSON, expiry)
  - `posts` - Blog posts (title, slug, content, excerpt, cover image, status draft/published, featured flag, read time, foreign keys to author and category)
  - `categories` - Post categories (name, slug)
- **Relations**: Posts belong to one user (author) and one category; categories have many posts

### Authentication
- **Provider**: Replit Auth via OpenID Connect (OIDC)
- **Session**: Express sessions stored in PostgreSQL via `connect-pg-simple`
- **Auth Flow**: Passport.js with OIDC strategy, session-based with 1-week TTL
- **Protected Routes**: Admin routes require authentication via `isAuthenticated` middleware
- **Client-side**: `useAuth` hook fetches current user from `/api/auth/user`

### Key Design Decisions
1. **Shared types between client and server**: The `shared/` directory contains database schema, route contracts, and Zod validation schemas used by both frontend and backend, ensuring type safety across the full stack.
2. **Schema-first API contract**: `shared/routes.ts` defines all API endpoints with their methods, paths, input schemas, and response schemas. This acts as a single source of truth.
3. **Slug-based routing**: Posts and categories use URL-friendly slugs for SEO-friendly URLs. The post API endpoint accepts either ID or slug.
4. **SPA architecture**: All client routes are handled by React Router (wouter) with server-side fallback to `index.html`.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection via `DATABASE_URL` environment variable. Used for all data storage including sessions.
- **Replit Auth (OIDC)**: Authentication provider. Requires `ISSUER_URL` (defaults to `https://replit.com/oidc`), `REPL_ID`, and `SESSION_SECRET` environment variables.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **express**: HTTP server framework
- **passport** + **openid-client**: Authentication
- **@tanstack/react-query**: Client-side data fetching
- **@tiptap/react**: Rich text editor for admin post editing
- **date-fns**: Date formatting (with Portuguese locale support)
- **zod**: Runtime validation for API inputs/outputs
- **wouter**: Client-side routing
- **shadcn/ui** (Radix UI + Tailwind): Component library

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `REPL_ID` - Replit environment identifier (for auth)
- `ISSUER_URL` - OIDC issuer URL (optional, defaults to Replit)
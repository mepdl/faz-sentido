-- =============================================
-- Faz Sentido. - Script de Criação do Banco de Dados
-- Compatível com Supabase (PostgreSQL)
-- =============================================

-- 1. TABELA: users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. TABELA: categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- 3. TABELA: posts
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  author_id TEXT REFERENCES users(id),
  author_name TEXT,
  category_id INTEGER REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  read_time INTEGER DEFAULT 5,
  seo_keywords TEXT
);

-- 4. TABELA: contacts
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 5. TABELA: newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- 6. TABELA: sessions (para autenticação via connect-pg-simple)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- =============================================
-- DADOS INICIAIS (opcional - categorias padrão)
-- =============================================

INSERT INTO categories (name, slug) VALUES
  ('Negócios', 'negocios'),
  ('Dinheiro', 'dinheiro'),
  ('Mentalidade', 'mentalidade'),
  ('Tech', 'tech')
ON CONFLICT (slug) DO NOTHING;

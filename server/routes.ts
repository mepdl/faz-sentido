import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { posts, categories } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === PUBLIC API ===

  app.get(api.posts.list.path, async (req, res) => {
    try {
      const input = api.posts.list.input?.parse(req.query);
      const posts = await storage.getPosts(input);
      res.json(posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get(api.posts.get.path, async (req, res) => {
    const idOrSlug = String(req.params.idOrSlug);
    let post;
    
    // Check if it's a number (ID) or string (slug)
    if (!isNaN(Number(idOrSlug))) {
      post = await storage.getPost(Number(idOrSlug));
    } else {
      post = await storage.getPostBySlug(idOrSlug);
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // === PROTECTED API (ADMIN) ===

  app.post(api.posts.create.path, isAuthenticated, async (req, res) => {
    try {
      // Add authorId from authenticated user
      const input = api.posts.create.input.parse({
        ...req.body,
        authorId: (req.user as any).claims.sub,
        seoKeywords: req.body.seoKeywords || null
      });
      const post = await storage.createPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.posts.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.posts.update.input.parse(req.body);
      const post = await storage.updatePost(Number(req.params.id), input);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.posts.delete.path, isAuthenticated, async (req, res) => {
    try {
      await storage.deletePost(Number(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      res.status(404).json({ message: "Post not found" });
    }
  });

  app.post(api.categories.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.categories.create.input.parse(req.body);
      const category = await storage.createCategory(input);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCategories = await storage.getCategories();
  if (existingCategories.length === 0) {
    const cats = [
      { name: "Negócios", slug: "negocios" },
      { name: "Dinheiro", slug: "dinheiro" },
      { name: "Mentalidade", slug: "mentalidade" },
      { name: "Hábitos", slug: "habitos" },
      { name: "Tecnologia", slug: "tecnologia" },
    ];
    
    for (const cat of cats) {
      await storage.createCategory(cat);
    }
  }

  // Ensure system user exists
  let systemUser = await authStorage.getUser("system");
  if (!systemUser) {
    try {
      systemUser = await authStorage.upsertUser({
        id: "system",
        email: "system@example.com",
        firstName: "System",
        lastName: "Admin",
        profileImageUrl: "",
      });
    } catch (e) {
      console.error("Failed to create system user:", e);
      // Fallback: try to find any user or just skip seeding posts if strict FK
    }
  }

  // Check if we have posts
  const existingPosts = await storage.getPosts({ limit: 1 });
  if (existingPosts.length === 0 && systemUser) {
    const categories = await storage.getCategories();
    const mindsetCat = categories.find(c => c.slug === "mentalidade");
    const moneyCat = categories.find(c => c.slug === "dinheiro");

    if (mindsetCat) {
      await storage.createPost({
        title: "Como desenvolver uma mentalidade de crescimento",
        slug: "como-desenvolver-mentalidade-crescimento",
        content: `
          <h2>O que é mentalidade de crescimento?</h2>
          <p>Mentalidade de crescimento é a crença de que suas habilidades podem ser desenvolvidas através de dedicação e trabalho duro.</p>
          <h3>Principais aprendizados:</h3>
          <ul>
            <li>Inteligência não é fixa.</li>
            <li>Desafios são oportunidades.</li>
            <li>O esforço é o caminho para a maestria.</li>
          </ul>
          <h3>Como aplicar na prática:</h3>
          <p>Comece substituindo "Eu não consigo" por "Eu não consigo AINDA".</p>
        `,
        excerpt: "Descubra como transformar seus desafios em oportunidades de aprendizado.",
        status: "published",
        categoryId: mindsetCat.id,
        isFeatured: true,
        publishedAt: new Date(),
        authorId: systemUser.id,
        coverImage: "https://images.unsplash.com/photo-1555445054-d92212967270?auto=format&fit=crop&q=80"
      });
    }
    
    if (moneyCat) {
      await storage.createPost({
        title: "Investimentos para iniciantes: Por onde começar?",
        slug: "investimentos-para-iniciantes",
        content: `
          <h2>Comece pelo básico</h2>
          <p>Antes de investir, crie sua reserva de emergência.</p>
        `,
        excerpt: "Guia completo para quem quer começar a investir com segurança.",
        status: "published",
        categoryId: moneyCat.id,
        isFeatured: false,
        publishedAt: new Date(),
        authorId: systemUser.id,
        coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80"
      });
    }
  }
}

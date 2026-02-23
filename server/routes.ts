import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth";
import { posts, categories, contacts, newsletter, insertContactSchema, insertNewsletterSchema } from "@shared/schema";


export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === PUBLIC API ===

  app.post("/api/contact", async (req, res) => {
    try {
      const input = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(input);
      res.status(201).json(contact);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const input = insertNewsletterSchema.parse(req.body);
      const sub = await storage.subscribeNewsletter(input);
      res.status(201).json(sub);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      if ((err as any).code === "23505") {
        return res.status(400).json({ message: "E-mail já cadastrado" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

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

    // Validate if it's a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    if (isUUID) {
      post = await storage.getPost(idOrSlug);
    }

    // If not UUID or not found by ID (fallback for legacy IDs or potential collisions), try slug
    if (!post) {
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
      const input = api.posts.create.input.parse({
        ...req.body,
        authorId: (req.session as any).userId,
        seoKeywords: req.body.seoKeywords || null
      });
      const post = await storage.createPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Create validation error details:", JSON.stringify(err.errors, null, 2));
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
      const post = await storage.updatePost(String(req.params.id), input);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("PUT Validation Error:", JSON.stringify({
          errors: err.errors,
          body: req.body
        }, null, 2));
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("PUT Internal Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.posts.delete.path, isAuthenticated, async (req, res) => {
    try {
      await storage.deletePost(String(req.params.id));
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

  app.get(api.subscribers.list.path, isAuthenticated, async (req, res) => {
    const subs = await storage.getSubscribers();
    res.json(subs);
  });

  app.delete(api.subscribers.delete.path, isAuthenticated, async (req, res) => {
    try {
      await storage.deleteSubscriber(String(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      res.status(404).json({ message: "Subscriber not found" });
    }
  });

  app.get(api.contacts.list.path, isAuthenticated, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.delete(api.contacts.delete.path, isAuthenticated, async (req, res) => {
    try {
      await storage.deleteContact(String(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      res.status(404).json({ message: "Contact not found" });
    }
  });

  // Seed Data
  try {
    await seedDatabase();
  } catch (error) {
    console.error("Failed to seed database:", error);
    // Continue server startup even if seeding fails
  }

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

  // Check if we have posts
  const existingPosts = await storage.getPosts({ limit: 1 });
  if (existingPosts.length === 0) {
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
        authorId: "system",
        coverImage: "https://images.unsplash.com/photo-1555445054-d92212967270?auto=format&fit=crop&q=80",
        readTime: 5
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
        authorId: "system",
        coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80",
        readTime: 5
      });
    }
  }
}

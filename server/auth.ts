import "dotenv/config";
import session from "express-session";
import MemoryStore from "memorystore";
import type { Express, RequestHandler } from "express";

const MemoryStoreSession = MemoryStore(session);

// ─── Session Setup ────────────────────────────────────────────────────────────

export function setupAuth(app: Express) {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

    app.use(
        session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
            store: new MemoryStoreSession({ checkPeriod: sessionTtl }),
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: sessionTtl,
            },
        })
    );
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export const isAuthenticated: RequestHandler = (req, res, next) => {
    if ((req.session as any).userId) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────

export function registerAuthRoutes(app: Express) {
    // POST /api/login — verifica credenciais do .env
    app.post("/api/login", (req, res) => {
        const { email, password } = req.body as { email: string; password: string };

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return res
                .status(500)
                .json({ message: "ADMIN_EMAIL e ADMIN_PASSWORD não configurados no .env" });
        }

        if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() || password !== adminPassword.trim()) {
            console.log(`[AUTH] Login falhou para: ${email.trim().toLowerCase()}`);
            console.log(`[AUTH] Esperado (email/senha comprimentos): ${adminEmail.trim().length}/${adminPassword.trim().length}`);
            console.log(`[AUTH] Recebido (email/senha comprimentos): ${email.trim().length}/${password.length}`);
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        (req.session as any).userId = "admin";
        (req.session as any).user = {
            id: "admin",
            email: adminEmail,
            firstName: "Admin",
            lastName: "",
            profileImageUrl: null,
        };

        return res.json({ ok: true });
    });

    // GET /api/logout — destroi sessão
    app.get("/api/logout", (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });

    // GET /api/auth/user — retorna usuário da sessão
    app.get("/api/auth/user", isAuthenticated, (req, res) => {
        const user = (req.session as any).user;
        return res.json(user);
    });
}

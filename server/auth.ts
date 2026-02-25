import "dotenv/config";
import session from "express-session";
import MemoryStore from "memorystore";
import type { Express, RequestHandler } from "express";

const MemoryStoreSession = MemoryStore(session);

// ─── Session Setup ────────────────────────────────────────────────────────────

export function setupAuth(app: Express) {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const isProduction = process.env.NODE_ENV === "production";

    // Vercel runs behind a reverse proxy — needed for secure cookies
    if (isProduction) {
        app.set("trust proxy", 1);
    }

    app.use(
        session({
            secret: process.env.SESSION_SECRET || "fallback-dev-secret",
            resave: false,
            saveUninitialized: false,
            store: new MemoryStoreSession({ checkPeriod: sessionTtl }),
            cookie: {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
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
        try {
            console.log("[AUTH] Login attempt received");
            console.log("[AUTH] req.body type:", typeof req.body);
            console.log("[AUTH] req.body:", JSON.stringify(req.body));

            const { email, password } = req.body as { email: string; password: string };

            const adminEmail = process.env.ADMIN_EMAIL?.trim();
            const adminPassword = process.env.ADMIN_PASSWORD?.trim();

            console.log("[AUTH] ADMIN_EMAIL configured:", !!adminEmail);
            console.log("[AUTH] ADMIN_PASSWORD configured:", !!adminPassword);

            if (!adminEmail || !adminPassword) {
                console.error("[AUTH] ADMIN_EMAIL or ADMIN_PASSWORD not configured");
                return res
                    .status(500)
                    .json({ message: "Servidor não configurado corretamente (ADMIN_EMAIL/PASSWORD)" });
            }

            const inputEmail = email?.trim().toLowerCase();
            const inputPassword = password?.trim();

            console.log("[AUTH] Comparing emails:", inputEmail, "vs", adminEmail.toLowerCase());
            console.log("[AUTH] Password match:", inputPassword === adminPassword);

            if (inputEmail !== adminEmail.toLowerCase() || inputPassword !== adminPassword) {
                console.log(`[AUTH] Login failed for: ${inputEmail}`);
                return res.status(401).json({ message: "E-mail ou senha incorretos" });
            }

            (req.session as any).userId = "admin";
            (req.session as any).user = {
                id: "admin",
                email: adminEmail,
                firstName: "Admin",
                lastName: "",
                profileImageUrl: null,
            };

            console.log("[AUTH] Login successful for:", inputEmail);
            return res.json({ ok: true });
        } catch (err: any) {
            console.error("[AUTH] Unexpected error in login handler:", err);
            return res.status(500).json({ message: "Erro interno no login: " + err.message });
        }
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

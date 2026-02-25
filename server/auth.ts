import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { supabase } from "./supabase.js";

/**
 * Middleware para verificar se o usuário está autenticado via Supabase.
 * Espera um token Bearer no header Authorization ou um cookie.
 */
export const isAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : (req.cookies?.sb_token);

        if (!token) {
            return res.status(401).json({ message: "Não autorizado: Token ausente" });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("[AUTH] Erro ao validar token:", error?.message);
            return res.status(401).json({ message: "Não autorizado: Token inválido" });
        }

        // Anexa o usuário à requisição para uso posterior
        (req as any).user = user;
        (req as any).userId = user.id;

        next();
    } catch (err) {
        console.error("[AUTH] Erro inesperado no middleware:", err);
        res.status(500).json({ message: "Erro interno na autenticação" });
    }
};

// Funções de setup vazias para manter compatibilidade com routes.ts sem quebrar tudo de uma vez
export function setupAuth(_app: any) {
    // express-session removido em favor do Supabase Auth
}

export function registerAuthRoutes(_app: any) {
    // POST /api/login movido para o client-side (Supabase SDK)
}

import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { PostResponse } from "@shared/schema";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: PostResponse;
  variant?: "default" | "featured" | "compact";
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })
    : post.status === 'published' ? "Publicado" : "Rascunho";

  if (variant === "featured") {
    return (
      <Link href={`/post/${post.slug}`} className="group block relative overflow-hidden rounded-2xl shadow-xl transition-all hover:shadow-2xl">
        <div className="grid md:grid-cols-2 h-full bg-white dark:bg-zinc-900">
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={post.coverImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"} // Fallback image
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {post.category.name}
                </Badge>
              )}
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readTime} min
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-balance group-hover:text-primary/80 transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 line-clamp-3 font-serif">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-auto">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                {post.author?.profileImageUrl ? (
                  <img src={post.author.profileImageUrl} alt="Author" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                    {(post.authorName || post.author?.firstName)?.[0] || "A"}
                  </div>
                )}
              </div>
              <div className="text-sm">
                <p className="font-medium" data-testid="text-author-name">{post.authorName || `${post.author?.firstName || "Autor"} ${post.author?.lastName || ""}`.trim()}</p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/post/${post.slug}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.coverImage || "https://images.unsplash.com/photo-1554774853-719586f8c277?auto=format&fit=crop&q=80"}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
            {post.category && (
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                {post.category.name}
              </span>
            )}
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">{post.readTime} min leitura</span>
          </div>
          <h3 className="text-xl font-bold font-display mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow font-serif">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">
              {post.authorName ? `${post.authorName} · ` : ""}{formattedDate}
            </span>
            <span className="text-sm font-semibold text-primary group-hover:underline">
              Ler artigo
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

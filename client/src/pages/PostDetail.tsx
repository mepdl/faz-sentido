import { usePost } from "@/hooks/use-posts";
import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Calendar, Clock, User, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { PostResponse } from "@shared/schema";

export default function PostDetail() {
  const [, params] = useRoute("/post/:slug");
  const slug = params?.slug || "";
  const { data: postData, isLoading, error } = usePost(slug);
  const post = postData as PostResponse | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
            <Button variant="outline" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.publishedAt 
    ? format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })
    : "Rascunho";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{post.title} | Diário de Crescimento</title>
        <meta name="description" content={post.excerpt || "Artigo sobre desenvolvimento pessoal e finanças."} />
        {post.seoKeywords && <meta name="keywords" content={post.seoKeywords} />}
        {/* Open Graph Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Navbar />

      <main className="flex-grow pb-20">
        {/* Header */}
        <header className="bg-muted/30 pt-16 pb-12 mb-12 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex gap-2 mb-6">
              {post.category && (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                  {post.category.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-balance text-primary">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-serif leading-relaxed mb-8 border-l-4 border-blue-600 pl-6">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-border/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                     {post.author?.profileImageUrl ? (
                       <img src={post.author.profileImageUrl} alt="Author" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                         {(post.authorName || post.author?.firstName)?.[0] || "A"}
                       </div>
                     )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground" data-testid="text-post-author">
                      {post.authorName || `${post.author?.firstName || "Autor"} ${post.author?.lastName || ""}`.trim()}
                    </p>
                    <p className="text-xs text-muted-foreground">Editor</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min leitura
                </div>
              </div>

              <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                <Share2 className="w-4 h-4" /> Compartilhar
              </Button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="container mx-auto px-4 max-w-5xl mb-12">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-4 max-w-3xl">
          <div 
            className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Action Box */}
          <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-8 rounded-xl">
            <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">✓</span>
              Como aplicar isso hoje?
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0" />
                <p>Reflita sobre os pontos principais deste artigo e anote 3 ações práticas.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0" />
                <p>Compartilhe este conhecimento com alguém que também busca crescimento.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0" />
                <p>Inscreva-se na nossa newsletter para não perder o próximo conteúdo.</p>
              </li>
            </ul>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

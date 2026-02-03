import { useRoute } from "wouter";
import { usePosts } from "@/hooks/use-posts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { Loader2 } from "lucide-react";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";
  
  // In a real app we might fetch the category details first to get the proper name
  const { data: posts, isLoading } = usePosts({ 
    category: slug === 'all' ? undefined : slug, 
    status: 'published' 
  });

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 block">
              Explorar
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-primary">
              {slug === 'all' ? 'Todos os Artigos' : categoryName}
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts && posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground text-lg">
                Nenhum artigo encontrado nesta categoria ainda.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

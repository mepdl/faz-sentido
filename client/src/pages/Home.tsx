import { usePosts } from "@/hooks/use-posts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Category } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Home() {
  const { toast } = useToast();
  const { data: posts, isLoading } = usePosts({ status: 'published' });
  const { data: categories } = useQuery<Category[]>({ queryKey: ['/api/categories'] });
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  const featuredPost = posts?.[0];
  const allPosts = posts?.slice(1) || [];

  const filteredPosts = activeFilter === "todos"
    ? allPosts
    : allPosts.filter(p => {
        const cat = categories?.find(c => c.id === p.categoryId);
        return cat?.slug === activeFilter;
      });

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/newsletter", { email });
    },
    onSuccess: () => {
      toast({
        title: "Inscrição confirmada!",
        description: "Agora você receberá nossos melhores insights diretamente no seu e-mail.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Erro ao se inscrever",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (email) {
      mutation.mutate(email);
      (e.target as HTMLFormElement).reset();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filterItems = [
    { label: "Todos", slug: "todos" },
    ...(categories?.map(c => ({ label: c.name, slug: c.slug })) || []),
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Helmet>
        <title>Faz Sentido. | Negócios, Mentalidade e Finanças</title>
        <meta name="description" content="Sua dose diária de estratégias de negócios, mentalidade de crescimento e liberdade financeira. Aprenda com os melhores especialistas." />
        <meta property="og:title" content="Faz Sentido. | Evolua Todos os Dias" />
        <meta property="og:description" content="Transformamos grandes ideias em aprendizados práticos para sua vida e negócios." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-background py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mb-12">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight leading-tight">
                Construa sua <span className="gradient-text">melhor versão</span> e conquiste a liberdade.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl font-serif">
                Estratégias de negócios, inteligência financeira e crescimento pessoal para quem não aceita o mediano.
              </p>
            </div>

            {featuredPost && (
              <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <PostCard post={featuredPost} variant="featured" />
              </div>
            )}
          </div>
        </section>

        {/* Filter + Posts Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <h2 className="text-2xl font-bold font-display">Artigos</h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar" data-testid="category-filter-bar">
                {filterItems.map(item => (
                  <button
                    key={item.slug}
                    data-testid={`filter-${item.slug}`}
                    onClick={() => setActiveFilter(item.slug)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                      activeFilter === item.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground border border-border hover-elevate"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Nenhum artigo encontrado nesta categoria.</p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => setActiveFilter("todos")}
                  data-testid="button-clear-filter"
                >
                  Ver todos os artigos
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Pronto para o próximo nível?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Junte-se a leitores que recebem semanalmente insights exclusivos sobre crescimento e negócios.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                name="email"
                type="email"
                required
                placeholder="Seu email principal"
                data-testid="input-newsletter-cta"
                className="px-6 py-3 rounded-lg text-foreground bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                size="lg"
                disabled={mutation.isPending}
                data-testid="button-newsletter-cta"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Inscrever-se
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { usePosts } from "@/hooks/use-posts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const { data: posts, isLoading } = usePosts({ status: 'published' });

  // Separate featured post (latest) and rest
  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1, 4) || [];
  const mindsetPosts = posts?.filter(p => p.categoryId === 3).slice(0, 3) || [];
  const moneyPosts = posts?.filter(p => p.categoryId === 2).slice(0, 3) || [];

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
              <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <PostCard post={featuredPost} variant="featured" />
              </div>
            )}
          </div>
        </section>

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-display">Recentes</h2>
                <Link href="/category/all">
                  <Button variant="ghost" className="gap-2">
                    Ver todos <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {recentPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Sections */}
        <div className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Mindset Column */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold font-display flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-600 rounded-full" />
                  Mentalidade
                </h3>
                <Link href="/category/mentalidade" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Ver mais
                </Link>
              </div>
              <div className="space-y-6">
                {mindsetPosts.length > 0 ? mindsetPosts.map(post => (
                  <Link key={post.id} href={`/post/${post.slug}`} className="group flex gap-4 items-start">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={post.coverImage || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-muted-foreground italic">Nenhum post nesta categoria ainda.</p>
                )}
              </div>
            </div>

            {/* Money Column */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold font-display flex items-center gap-2">
                  <span className="w-2 h-8 bg-green-600 rounded-full" />
                  Dinheiro & Negócios
                </h3>
                <Link href="/category/dinheiro" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Ver mais
                </Link>
              </div>
              <div className="space-y-6">
                {moneyPosts.length > 0 ? moneyPosts.map(post => (
                  <Link key={post.id} href={`/post/${post.slug}`} className="group flex gap-4 items-start">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={post.coverImage || "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-green-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-muted-foreground italic">Nenhum post nesta categoria ainda.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Pronto para o próximo nível?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Junte-se a mais de 10.000 leitores que recebem semanalmente insights exclusivos sobre crescimento e negócios.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                name="email"
                type="email" 
                required
                placeholder="Seu email principal" 
                className="px-6 py-3 rounded-lg text-foreground bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                type="submit"
                size="lg" 
                disabled={mutation.isPending}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Inscrever-se Grátis
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { AdminLayout } from "./AdminLayout";
import { usePosts } from "@/hooks/use-posts";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Mail, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Newsletter, Contact } from "@shared/schema";

export default function Dashboard() {
  const { data: posts } = usePosts();
  const { data: subscribers } = useQuery<Newsletter[]>({ queryKey: ['/api/subscribers'] });
  const { data: contacts } = useQuery<Contact[]>({ queryKey: ['/api/contacts'] });

  const totalPosts = posts?.length || 0;
  const publishedPosts = posts?.filter(p => p.status === 'published').length || 0;
  const draftPosts = posts?.filter(p => p.status === 'draft').length || 0;
  const totalSubscribers = subscribers?.length || 0;
  const totalContacts = contacts?.length || 0;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <Link href="/admin/posts/new">
          <Button className="bg-primary hover:bg-primary/90">
            Novo Artigo
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-posts">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {draftPosts} rascunhos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-published-posts">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground">
              artigos publicados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatos</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-contacts">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              mensagens recebidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-subscribers">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              inscritos na newsletter
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Artigos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Título</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Categoria</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Data</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts?.slice(0, 5).map(post => (
                  <tr key={post.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        post.status === 'published'
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}>
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {post.category?.name || post.categoryId || '-'}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {format(new Date(post.updatedAt || new Date()), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/posts/edit/${post.id}`}>
                        <Button variant="ghost" size="sm" className="h-8">Editar</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!posts || posts.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Nenhum artigo encontrado. Crie o seu primeiro!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

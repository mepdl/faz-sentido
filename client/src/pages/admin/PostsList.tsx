import { AdminLayout } from "./AdminLayout";
import { usePosts, useDeletePost } from "@/hooks/use-posts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function PostsList() {
  const { data: posts, isLoading } = usePosts();
  const { mutate: deletePost } = useDeletePost();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      deletePost(id, {
        onSuccess: () => {
          toast({ title: "Artigo excluído com sucesso" });
        },
        onError: () => {
          toast({ title: "Erro ao excluir artigo", variant: "destructive" });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Artigos</h1>
          <p className="text-muted-foreground">Gerencie todo o conteúdo do blog.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Novo Artigo
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  {post.title}
                  <div className="text-xs text-muted-foreground mt-1 truncate max-w-[300px]">
                    {post.slug}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    post.status === 'published'
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}>
                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </TableCell>
                <TableCell>{post.category?.name || '-'}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(post.updatedAt || new Date()), "dd MMM, yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/admin/posts/edit/${post.id}`}>
                        <DropdownMenuItem>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/post/${post.slug}`} target="_blank">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> Visualizar
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {posts?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum artigo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

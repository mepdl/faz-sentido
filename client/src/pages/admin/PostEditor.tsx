import { useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { usePost, useCreatePost, useUpdatePost } from "@/hooks/use-posts";
import { useCategories } from "@/hooks/use-categories";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

// Extended schema for form validation
const formSchema = insertPostSchema.extend({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  categoryId: z.coerce.number().optional(),
  excerpt: z.string().optional().transform(v => v || ""),
  coverImage: z.string().optional().transform(v => v || ""),
  seoKeywords: z.string().optional().transform(v => v || ""),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostEditor() {
  const [, params] = useRoute("/admin/posts/edit/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? parseInt(params.id) : undefined;
  const isEditing = !!id;

  const { data: post, isLoading: isLoadingPost } = usePost(id || 0);
  const { data: categories } = useCategories();
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      status: "draft",
      readTime: 5,
      isFeatured: false,
      seoKeywords: "",
    },
  });

  // Load data into form when editing
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        coverImage: post.coverImage || "",
        status: post.status as "draft" | "published",
        categoryId: post.categoryId || undefined,
        readTime: post.readTime || 5,
        isFeatured: post.isFeatured || false,
        seoKeywords: post.seoKeywords || "",
      });
    }
  }, [post, form]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (isEditing && id) {
      updatePost(
        { id, ...data },
        {
          onSuccess: () => {
            toast({ title: "Artigo atualizado com sucesso!" });
            setLocation("/admin/posts");
          },
          onError: (err) => {
            toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createPost(data, {
        onSuccess: () => {
          toast({ title: "Artigo criado com sucesso!" });
          setLocation("/admin/posts");
        },
        onError: (err) => {
          toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  if (isEditing && isLoadingPost) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <h1 className="text-3xl font-bold font-display">
          {isEditing ? "Editar Artigo" : "Novo Artigo"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={handleTitleChange} placeholder="Título impactante..." className="text-lg font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="minha-url-amigavel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        content={field.value} 
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo (SEO)</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} placeholder="Breve descrição do artigo..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palavras-chave SEO (separadas por vírgula)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="investimentos, finanças, dicas..." />
                    </FormControl>
                    <FormDescription>
                      Ajuda o Google a entender do que se trata o seu artigo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sidebar Settings Column */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <h3 className="font-bold border-b pb-2">Configurações</h3>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Leitura (min)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Destaque</FormLabel>
                        <FormDescription className="text-xs">
                          Exibir na home page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                <h3 className="font-bold border-b pb-2">Mídia</h3>
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem de Capa</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://..." />
                      </FormControl>
                      {field.value && (
                        <img 
                          src={field.value} 
                          alt="Preview" 
                          className="mt-2 w-full h-32 object-cover rounded-md" 
                        />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCreating || isUpdating}
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditing ? "Salvar Alterações" : "Criar Artigo"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
}

import { AdminLayout } from "./AdminLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { newsletter } from "@shared/schema";
import { api } from "@shared/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Subscriber = typeof newsletter.$inferSelect;

export default function SubscribersList() {
  const { toast } = useToast();
  const { data: subscribers, isLoading } = useQuery<Subscriber[]>({
    queryKey: [api.subscribers.list.path],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subscribers.list.path] });
      toast({ title: "Assinante removido com sucesso" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover assinante",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Assinantes</h1>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Email</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Data de Inscrição</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : subscribers?.map((sub) => (
                  <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-4 font-medium">{sub.email}</td>
                    <td className="p-4 text-muted-foreground">
                      {sub.createdAt ? format(new Date(sub.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja remover este assinante?")) {
                            deleteMutation.mutate(sub.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!isLoading && subscribers?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                      Nenhum assinante encontrado.
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

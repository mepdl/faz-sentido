import { AdminLayout } from "./AdminLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { contacts } from "@shared/schema";
import { api } from "@shared/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Trash2, Mail } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Contact = typeof contacts.$inferSelect;

export default function ContactsList() {
  const { toast } = useToast();
  const { data: messages, isLoading } = useQuery<Contact[]>({
    queryKey: [api.contacts.list.path],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contacts.list.path] });
      toast({ title: "Mensagem removida com sucesso" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover mensagem",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Contatos</h1>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Nome</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Email</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Data</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : messages?.map((msg) => (
                  <tr key={msg.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-4 font-medium">{msg.name}</td>
                    <td className="p-4 text-muted-foreground">{msg.email}</td>
                    <td className="p-4 text-muted-foreground">
                      {msg.createdAt ? format(new Date(msg.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mensagem de {msg.name}</DialogTitle>
                            <DialogDescription>
                              Enviada em {msg.createdAt ? format(new Date(msg.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                              <p>{msg.email}</p>
                            </div>
                            <div>
                              <label className="text-xs font-bold uppercase text-muted-foreground">Mensagem</label>
                              <p className="whitespace-pre-wrap bg-muted p-4 rounded-lg mt-1">{msg.message}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja remover esta mensagem?")) {
                            deleteMutation.mutate(msg.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!isLoading && messages?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      Nenhuma mensagem de contato encontrada.
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

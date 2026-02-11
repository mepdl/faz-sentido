import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Agradecemos o contato. Responderemos em breve.",
      });
      form.reset();
    },
    onError: (err: Error) => {
      toast({
        title: "Erro ao enviar",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-display text-primary">📩 Entre em Contato</h1>
          <p className="text-xl text-muted-foreground">Tem alguma dúvida ou sugestão? Adoraríamos ouvir você.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-8 order-2 md:order-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">E-mail</h3>
                <p className="text-muted-foreground break-all">contato@diariodecrescimento.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Redes Sociais</h3>
                <p className="text-muted-foreground">@diariodecrescimento</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-muted/30 p-6 md:p-8 rounded-2xl border order-1 md:order-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Como podemos ajudar?" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full gap-2" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {mutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

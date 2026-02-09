import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  const lastUpdate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-display text-primary">📜 Termos de Uso — Diário de Crescimento</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p>
              Bem-vindo ao Diário de Crescimento. Ao acessar este site, você concorda em cumprir estes termos de uso, todas as leis e regulamentos aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>
              O acesso e uso do blog Diário de Crescimento estão sujeitos à aceitação destes Termos de Uso. Se você não concorda com algum destes termos, está proibido de usar ou acessar este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Licença de Uso</h2>
            <p>
              É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Diário de Crescimento, apenas para visualização pessoal e não comercial.
            </p>
            <p>Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
            <ul className="list-disc ml-6">
              <li>Modificar ou copiar os materiais;</li>
              <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
              <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Isenção de Responsabilidade</h2>
            <p>
              Os materiais no site do Diário de Crescimento são fornecidos 'como estão'. O Diário de Crescimento não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitações</h2>
            <p>
              Em nenhum caso o Diário de Crescimento ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Diário de Crescimento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Links</h2>
            <p>
              O Diário de Crescimento não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso pelo Diário de Crescimento do site. O uso de qualquer site vinculado é por conta e risco do usuário.
            </p>
          </section>

          <section className="pt-8 border-t text-muted-foreground text-sm">
            <p>✔ Última atualização: {lastUpdate}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

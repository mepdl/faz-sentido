import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  const lastUpdate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-display text-primary">🔐 Política de Privacidade — Diário de Crescimento</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p>
              A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o blog Diário de Crescimento coleta, usa e protege as informações dos usuários que acessam nosso site.
            </p>
            <p>
              Ao utilizar este site, você concorda com as práticas descritas nesta política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📌 Coleta de Informações</h2>
            <p>Podemos coletar informações de duas formas:</p>
            
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="text-xl font-medium">1. Informações fornecidas pelo usuário</h3>
                <p>Quando você:</p>
                <ul className="list-disc ml-6">
                  <li>Se inscreve em newsletter (se houver)</li>
                  <li>Entra em contato por formulários ou e-mail</li>
                  <li>Comenta em artigos (se habilitado)</li>
                </ul>
                <p className="mt-2 font-medium">Essas informações podem incluir:</p>
                <ul className="list-disc ml-6">
                  <li>Nome</li>
                  <li>Endereço de e-mail</li>
                  <li>Outras informações fornecidas voluntariamente</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium">2. Informações coletadas automaticamente</h3>
                <p>Quando você navega no site, podemos coletar:</p>
                <ul className="list-disc ml-6">
                  <li>Endereço IP</li>
                  <li>Tipo de navegador</li>
                  <li>Páginas acessadas</li>
                  <li>Tempo de visita</li>
                  <li>Cookies e tecnologias semelhantes</li>
                </ul>
                <p className="mt-2">Esses dados são usados para melhorar a experiência do usuário e analisar o desempenho do site.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🍪 Uso de Cookies</h2>
            <p>O Diário de Crescimento utiliza cookies para:</p>
            <ul className="list-disc ml-6">
              <li>Personalizar conteúdos</li>
              <li>Exibir anúncios relevantes</li>
              <li>Analisar tráfego</li>
            </ul>
            <p className="mt-4">
              Cookies são pequenos arquivos armazenados no seu navegador. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar algumas funcionalidades do site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📢 Publicidade de Terceiros</h2>
            <p>
              Utilizamos serviços de publicidade, como o Google AdSense, que podem usar cookies (incluindo o cookie DoubleClick) para exibir anúncios relevantes com base nas visitas dos usuários a este e a outros sites.
            </p>
            <p>
              Esses cookies permitem que empresas de publicidade exibam anúncios personalizados. Você pode optar por não receber publicidade personalizada acessando as configurações de anúncios do Google.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🔗 Links de Afiliados</h2>
            <p>
              Alguns artigos do Diário de Crescimento podem conter links de afiliados. Isso significa que podemos receber uma comissão quando você realiza uma compra através desses links, sem custo adicional para você. Esses links ajudam a manter o site no ar e a produzir conteúdos gratuitos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📧 Uso das Informações</h2>
            <p>As informações coletadas podem ser utilizadas para:</p>
            <ul className="list-disc ml-6">
              <li>Melhorar o conteúdo do site</li>
              <li>Responder mensagens e solicitações</li>
              <li>Enviar comunicações (se o usuário autorizar)</li>
              <li>Análises estatísticas</li>
            </ul>
            <p className="mt-4 font-medium italic">
              Nunca vendemos, trocamos ou compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🔒 Proteção de Dados</h2>
            <p>
              Adotamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum sistema é 100% seguro, e não podemos garantir segurança absoluta dos dados transmitidos pela internet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">👥 Compartilhamento com Terceiros</h2>
            <p>Podemos compartilhar dados não pessoais com:</p>
            <ul className="list-disc ml-6">
              <li>Serviços de análise (ex: Google Analytics)</li>
              <li>Plataformas de publicidade</li>
            </ul>
            <p className="mt-4">Esses serviços seguem suas próprias políticas de privacidade.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📜 Seus Direitos (LGPD)</h2>
            <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:</p>
            <ul className="list-disc ml-6">
              <li>Acessar seus dados pessoais</li>
              <li>Solicitar correção ou exclusão</li>
              <li>Revogar consentimento</li>
            </ul>
            <p className="mt-4">Para isso, entre em contato conosco pelo e-mail informado na página de contato.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🔄 Alterações nesta Política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Sempre que houver mudanças, a nova versão será publicada nesta página. Recomendamos que você revise esta política regularmente.
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

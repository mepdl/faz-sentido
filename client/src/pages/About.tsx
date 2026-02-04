import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-display text-primary border-b pb-4">📘 Sobre o Diário de Crescimento</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section>
          <p className="text-xl leading-relaxed">
            O <strong>Diário de Crescimento</strong> nasceu com um objetivo simples: transformar grandes ideias em aprendizados práticos que ajudem pessoas a evoluir todos os dias — na vida pessoal, na carreira e nos negócios.
          </p>
          <p>
            Vivemos em uma era onde existe muito conteúdo, mas pouco tempo para consumir tudo. Entrevistas longas, livros densos e conversas profundas trazem ensinamentos valiosos, porém nem sempre são acessíveis para quem busca aprender de forma rápida e clara.
          </p>
          <p className="font-medium text-primary">
            Por isso, o Diário de Crescimento atua como um filtro inteligente de conhecimento.
          </p>
          <p>
            Aqui, analisamos conteúdos educacionais, entrevistas públicas, ideias de especialistas e grandes líderes, e transformamos tudo em artigos objetivos, organizados e aplicáveis à vida real.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 py-8">
          <section className="bg-muted/30 p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">🎯 Nossa Missão</h2>
            <p>
              Levar conhecimento de qualidade de forma simples, prática e acessível, ajudando nossos leitores a crescerem continuamente.
            </p>
          </section>
          <section className="bg-muted/30 p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">🌱 Nossa Visão</h2>
            <p>
              Ser uma referência em conteúdo de crescimento pessoal e profissional, onde pessoas encontrem aprendizados confiáveis para evoluir todos os dias.
            </p>
          </section>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-6 border-l-4 border-primary pl-4">💡 O Que Você Vai Encontrar Aqui</h2>
          <p>No Diário de Crescimento, você encontrará conteúdos sobre:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 list-none pl-0">
            <li className="flex items-center gap-2">📈 <span className="font-medium">Negócios e carreira</span></li>
            <li className="flex items-center gap-2">💰 <span className="font-medium">Dinheiro e mentalidade financeira</span></li>
            <li className="flex items-center gap-2">🧠 <span className="font-medium">Hábitos produtivos e desenvolvimento pessoal</span></li>
            <li className="flex items-center gap-2">❤️ <span className="font-medium">Saúde, foco e performance</span></li>
            <li className="flex items-center gap-2">🤖 <span className="font-medium">Tecnologia, inovação e inteligência artificial</span></li>
          </ul>
          <p className="mt-6 italic">Sempre com uma abordagem clara, organizada e prática.</p>
        </section>

        <section className="bg-primary/5 p-8 rounded-xl border border-primary/10">
          <h2 className="text-2xl font-semibold mb-4">✍️ Como Produzimos Nosso Conteúdo</h2>
          <p>Todo o conteúdo publicado é:</p>
          <ul className="space-y-2 mt-4 list-none pl-0">
            <li className="flex items-center gap-2 text-green-600 dark:text-green-400">✔ Original</li>
            <li className="flex items-center gap-2 text-green-600 dark:text-green-400">✔ Transformado em linguagem própria</li>
            <li className="flex items-center gap-2 text-green-600 dark:text-green-400">✔ Baseado em análises e interpretações educativas</li>
            <li className="flex items-center gap-2 text-green-600 dark:text-green-400">✔ Focado em aplicação prática</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Não realizamos transcrições literais nem reproduzimos conteúdos originais de terceiros. Nos inspiramos em materiais públicos como entrevistas, vídeos, livros e artigos educacionais para criar novos conteúdos informativos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">📢 Transparência</h2>
          <p>
            Para manter o blog gratuito e em constante evolução, podemos utilizar:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Anúncios de terceiros</li>
            <li>Links de afiliados para produtos e serviços relevantes</li>
          </ul>
          <p className="mt-4">
            Essas parcerias não influenciam nossa independência editorial. Sempre buscamos indicar apenas conteúdos e ferramentas que agreguem valor aos leitores.
          </p>
        </section>

        <section className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">🤝 Nosso Compromisso</h2>
          <p>Nosso compromisso é com:</p>
          <ul className="grid grid-cols-2 gap-2 mt-4 list-none pl-0">
            <li className="flex items-center gap-2">✔ Qualidade da informação</li>
            <li className="flex items-center gap-2">✔ Ética</li>
            <li className="flex items-center gap-2">✔ Clareza</li>
            <li className="flex items-center gap-2">✔ Crescimento contínuo</li>
          </ul>
        </section>

        <section className="text-center py-12 bg-muted/20 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">📩 Entre em Contato</h2>
          <p className="mb-6">Se você tiver dúvidas, sugestões ou quiser falar conosco, utilize o canal de contato disponível no site.</p>
          <p className="text-xl font-display italic text-primary">✨ Diário de Crescimento — Cresça todos os dias.</p>
        </section>
      </div>
    </div>
  );
}

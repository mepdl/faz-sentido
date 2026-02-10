import { Link } from "wouter";
import { TrendingUp, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 overflow-hidden w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 max-w-full overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground text-primary p-1.5 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">
                Diário de Crescimento
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Sua dose diária de estratégias de negócios, mentalidade de crescimento e liberdade financeira. Construa o futuro que você merece.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 font-display">Categorias</h4>
            <ul className="space-y-2">
              <li><Link href="/category/negocios" className="text-primary-foreground/70 hover:text-white transition-colors">Negócios</Link></li>
              <li><Link href="/category/dinheiro" className="text-primary-foreground/70 hover:text-white transition-colors">Dinheiro</Link></li>
              <li><Link href="/category/mentalidade" className="text-primary-foreground/70 hover:text-white transition-colors">Mentalidade</Link></li>
              <li><Link href="/category/tech" className="text-primary-foreground/70 hover:text-white transition-colors">Tech</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 font-display">Empresa</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-white transition-colors">Contato</Link></li>
              <li><Link href="/privacy" className="text-primary-foreground/70 hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link href="/terms" className="text-primary-foreground/70 hover:text-white transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4 font-display">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Receba as melhores dicas diretamente no seu email.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu melhor email" 
                className="bg-primary-foreground/10 border border-primary-foreground/20 rounded px-3 py-2 text-sm text-white placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-white w-full"
              />
              <button className="bg-white text-primary px-4 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors">
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Diário de Crescimento. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-primary-foreground/50 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-primary-foreground/50 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-primary-foreground/50 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="mailto:contact@example.com" className="text-primary-foreground/50 hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

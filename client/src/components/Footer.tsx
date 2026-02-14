import { Link } from "wouter";
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 overflow-hidden w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 block">
              <div className="flex flex-col leading-none font-display font-bold text-xl tracking-tight">
                <span className="text-white">Faz</span>
                <span className="text-white">Sentido<span className="text-white">.</span></span>
              </div>
            </Link>
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

          {/* Social / Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 font-display">Conecte-se</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Acompanhe nossos conteúdos nas redes sociais.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-primary-foreground/50 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/50 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/50 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="mailto:contato@fazsentido.com" className="text-primary-foreground/50 hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Faz Sentido. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

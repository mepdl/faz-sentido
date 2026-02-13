import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { redirectToLogin } from "@/lib/auth-utils";
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Users,
  Mail,
  LogOut, 
  TrendingUp,
  Loader2,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta área.",
        variant: "destructive"
      });
      window.location.href = "/api/login";
    }
  }, [user, isLoading, toast]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Categorias", href: "/admin/categories", icon: FolderTree },
    { name: "Assinantes", href: "/admin/subscribers", icon: Users },
    { name: "Contatos", href: "/admin/contacts", icon: Mail },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="font-bold font-display text-lg">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {user.firstName?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/10">
      <Toaster />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold font-display">DC Admin</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-background border-r flex-col fixed inset-y-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 w-64 bg-background z-50 flex flex-col transition-transform duration-300 ease-in-out transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import PostDetail from "@/pages/PostDetail";
import CategoryPage from "@/pages/CategoryPage";
import Dashboard from "@/pages/admin/Dashboard";
import PostsList from "@/pages/admin/PostsList";
import PostEditor from "@/pages/admin/PostEditor";
import CategoriesList from "@/pages/admin/CategoriesList";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/post/:slug" component={PostDetail} />
      <Route path="/category/:slug" component={CategoryPage} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/posts" component={PostsList} />
      <Route path="/admin/posts/new" component={PostEditor} />
      <Route path="/admin/posts/edit/:id" component={PostEditor} />
      <Route path="/admin/categories" component={CategoriesList} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

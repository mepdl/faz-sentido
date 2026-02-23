import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react"

import Home from "@/pages/Home";
import PostDetail from "@/pages/PostDetail";
import CategoryPage from "@/pages/CategoryPage";
import Privacy from "@/pages/Privacy";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/admin/Dashboard";
import PostsList from "@/pages/admin/PostsList";
import PostEditor from "@/pages/admin/PostEditor";
import CategoriesList from "@/pages/admin/CategoriesList";
import SubscribersList from "@/pages/admin/SubscribersList";
import ContactsList from "@/pages/admin/ContactsList";
import Login from "@/pages/admin/Login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/post/:slug" component={PostDetail} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/posts" component={PostsList} />
      <Route path="/admin/posts/new" component={PostEditor} />
      <Route path="/admin/posts/edit/:id" component={PostEditor} />
      <Route path="/admin/categories" component={CategoriesList} />
      <Route path="/admin/subscribers" component={SubscribersList} />
      <Route path="/admin/contacts" component={ContactsList} />

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
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

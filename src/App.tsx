import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SpecialRequest from "./pages/SpecialRequest.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import { LanguageProvider } from "@/context/LanguageContext";
import { AccountProvider } from "@/context/AccountContext";
import { AccountModal } from "@/components/AccountModal";
import { PokeballCursor } from "@/components/PokeballCursor";
import { PokemonWorldFX } from "@/components/PokemonWorldFX";
import { SplashIntro } from "@/components/SplashIntro";
import { MobileTouchGuard } from "@/components/MobileTouchGuard";
import { RouteScrollManager } from "@/components/RouteScrollManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AccountProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SplashIntro />
          <MobileTouchGuard />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RouteScrollManager />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/special-request" element={<SpecialRequest />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <AccountModal />
          <PokemonWorldFX />
          <PokeballCursor />
        </TooltipProvider>
      </AccountProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEcuTcu from "./pages/AdminEcuTcu";
import AdminGoogleReviews from "./pages/AdminGoogleReviews";
import AdminSettings from "./pages/AdminSettings";
import Realizations from "./pages/Realizations";
import RealizationDetail from "./pages/RealizationDetail";
import AdminRealizations from "./pages/AdminRealizations";
import AdminSiteContent from "./pages/AdminSiteContent";
import ServicesPage from "./pages/ServicesPage";
import NewHomepage from "./pages/NewHomepage";
import EcuTcuPage from "./pages/EcuTcuPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import { PrivacyPolicyPage, TermsPage } from "./pages/LegalPages";
import SiteLegalFooter from "./components/SiteLegalFooter";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Nowy wygląd jest jedyną stroną główną serwisu. */}
          <Route path="/" element={<NewHomepage />} />
          <Route path="/nowa-strona" element={<Navigate to="/" replace />} />

          <Route path="/ecu-tcu" element={<EcuTcuPage />} />
          <Route path="/regulamin" element={<TermsPage />} />
          <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
          <Route path="/polityka-cookies" element={<CookiePolicyPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/strona" element={<AdminSiteContent />} />
          <Route path="/admin/ecu-tcu" element={<AdminEcuTcu />} />
          <Route path="/admin/uslugi" element={<Admin />} />
          <Route path="/admin/realizacje" element={<AdminRealizations />} />
          <Route path="/admin/opinie" element={<AdminGoogleReviews />} />
          <Route path="/admin/seo" element={<AdminSiteContent />} />
          <Route path="/admin/ustawienia" element={<AdminSettings />} />

          <Route path="/realizacje" element={<Realizations />} />
          <Route path="/realizacje/:slug" element={<RealizationDetail />} />
          <Route path="/uslugi" element={<ServicesPage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SiteLegalFooter />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

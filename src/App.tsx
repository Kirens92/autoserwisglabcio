import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import { PrivacyPolicyPage, TermsPage } from "./pages/LegalPages";
import SiteLegalFooter from "./components/SiteLegalFooter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nowa-strona" element={<NewHomepage />} />
          <Route path="/ecu-tcu" element={<EcuTcuPage />} />
          <Route path="/regulamin" element={<TermsPage />} />
          <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

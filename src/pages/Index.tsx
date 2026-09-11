import LegacyNavbar from "@/components/LegacyNavbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import LatestRealizations from "@/components/LatestRealizations";

const Index = () => {
  return (
    <main>
      <StructuredData />
      <LegacyNavbar />
      <Hero />
      <Stats />
      <Services />
      <LatestRealizations />
      <Process />
      <Reviews />
      <Contact />
      <Footer />
      <CookieConsent />
    </main>
  );
};

export default Index;

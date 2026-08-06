import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reserve from "@/components/Reserve";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";

const Index = () => {
  return (
    <main>
      <StructuredData />
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Process />
      <Reviews />
      <Reserve />
      <Contact />
      <Footer />
      <CookieConsent />
    </main>
  );
};

export default Index;

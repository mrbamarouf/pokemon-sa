import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CardsSection } from "@/components/CardsSection";
import { BoostersSection } from "@/components/BoostersSection";
import { MagnetsSection } from "@/components/MagnetsSection";
import { ApparelSection } from "@/components/ApparelSection";
import { CupsSection } from "@/components/CupsSection";
import { RewardGameSection } from "@/components/RewardGameSection";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileShopDock } from "@/components/MobileShopDock";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t("homeTitle");
    const desc = t("metaDescription");
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, [t]);

  return (
    <main className="has-mobile-shop-dock min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <MobileShopDock />
      <div className="section-divider" />
      <CardsSection />
      <BoostersSection />
      <MagnetsSection />
      <CupsSection />
      <ApparelSection />
      <RewardGameSection />
      <Footer />
      <CartDrawer />
    </main>
  );
};

export default Index;

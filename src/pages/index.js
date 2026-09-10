import HeroSection from "../components/sections/home/HeroSection";
import MarketplaceSection from "../components/sections/home/MarketplaceSection";
import ServicesSection from "../components/sections/home/ServicesSection";
import JobsSection from "../components/sections/home/JobsSection";
import PremiumServicesSection from "../components/sections/home/PremiumServicesSection";
import CategorySection from "../components/sections/home/CategorySection";
import CountrySection from "../components/sections/home/CountrySection";
import TopCitiesSection from "../components/sections/home/TopCitiesSection";
import FreeQuoteSection from "../components/sections/home/FreeQuoteSection";

function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col">
        <HeroSection />
        <MarketplaceSection />
        <CountrySection />
        <ServicesSection />
        <JobsSection />
        <PremiumServicesSection />
        <CategorySection />
        <TopCitiesSection />
        <FreeQuoteSection />
      </div>
    </main>
  );
}

Home.useDefaultLayout = true;

export default Home;

import MbbsAboutSection from "@/components/sections/mbbs/MbbsAboutSection";
import MbbsCtaSection from "@/components/sections/mbbs/MbbsCtaSection";
import MbbsDestinationsSection from "@/components/sections/mbbs/MbbsDestinationsSection";
import MbbsHeroSection from "@/components/sections/mbbs/MbbsHeroSection";
import MbbsJourneySection from "@/components/sections/mbbs/MbbsJourneySection";
import MbbsPartnerMarqueeSection from "@/components/sections/mbbs/MbbsPartnerMarqueeSection";
import MbbsStatsSection from "@/components/sections/mbbs/MbbsStatsSection";
import MbbsTestimonialsSection from "@/components/sections/mbbs/MbbsTestimonialsSection";
import MbbsTrustedPartnersSection from "@/components/sections/mbbs/MbbsTrustedPartnersSection";

export default function MBBSStudyAbroadPage() {
  return (
    <main className="min-h-screen bg-white">
      <MbbsHeroSection />
      <MbbsStatsSection />
      <MbbsDestinationsSection />
      <MbbsTrustedPartnersSection />
      <MbbsAboutSection />
      <MbbsPartnerMarqueeSection />
      <MbbsJourneySection />
      <MbbsTestimonialsSection />
      <MbbsCtaSection />
    </main>
  );
}

MBBSStudyAbroadPage.useDefaultLayout = true;

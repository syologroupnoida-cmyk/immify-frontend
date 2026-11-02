import PortalFeaturePanel from "@/components/common/PortalFeaturePanel";
import PortalContentSections from "@/components/common/PortalContentSections";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";

function FreeEligibilityCheckPage() {
  const page = content["/free-eligibility-check"];
  return (
    <PortalPageLayout page={page} bannerKey="free-eligibility-check">
      <PortalContentSections sections={page.sections} />
      <PortalFeaturePanel title="Request an initial assessment" label="Explore your options">
        <p className="mt-4">You can currently request an initial assessment through our enquiry form. An automated eligibility score is not available here. Share your destination and goal so a relevant provider can discuss possible next steps.</p>
        <LeadGenerationButton label="Request an Initial Assessment" className="mt-5" />
      </PortalFeaturePanel>
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/services" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Explore Services</Link>
        <Link href="/contact" className="px-5 py-3 font-semibold text-blue-700">Contact Immify</Link>
      </div>
    </PortalPageLayout>
  );
}

FreeEligibilityCheckPage.useDefaultLayout = true;
export default FreeEligibilityCheckPage;

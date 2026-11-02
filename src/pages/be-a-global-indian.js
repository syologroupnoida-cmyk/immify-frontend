import PortalFeaturePanel from "@/components/common/PortalFeaturePanel";
import PortalContentSections from "@/components/common/PortalContentSections";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function BeAGlobalIndianPage() {
  const page = content["/be-a-global-indian"];
  return (
    <PortalPageLayout page={page} bannerKey="be-a-global-indian">
      <PortalContentSections sections={page.sections} />
      <PortalFeaturePanel title="Share your journey" label="Your experience matters">
        <p className="mt-4 text-sm leading-7 text-slate-600">Have a practical lesson from studying, working or settling abroad? Contact Immify to suggest a topic or share your experience.</p>
      </PortalFeaturePanel>
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/services" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Explore Services</Link>
        <Link href="/contact" className="px-5 py-3 font-semibold text-blue-700">Contact Immify</Link>
      </div>
    </PortalPageLayout>
  );
}

BeAGlobalIndianPage.useDefaultLayout = true;
export default BeAGlobalIndianPage;

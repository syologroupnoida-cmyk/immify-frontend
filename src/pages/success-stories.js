import PortalFeaturePanel from "@/components/common/PortalFeaturePanel";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function SuccessStoriesPage() {
  const page = content["/success-stories"];
  return (
    <PortalPageLayout page={page} bannerKey="success-stories">
      <PortalFeaturePanel title="Community experiences" label="Community">
        <p className="mt-4 text-sm leading-7 text-slate-600">There are no published stories in this section yet. To share your own experience, contact Immify. Individual experiences do not predict visa, employment or admission outcomes.</p>
        <Link href="/contact" className="mt-4 inline-block font-semibold text-blue-700">Share Your Journey</Link>
      </PortalFeaturePanel>
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/services" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Explore Services</Link>
        <Link href="/contact" className="px-5 py-3 font-semibold text-blue-700">Contact Immify</Link>
      </div>
    </PortalPageLayout>
  );
}

SuccessStoriesPage.useDefaultLayout = true;
export default SuccessStoriesPage;

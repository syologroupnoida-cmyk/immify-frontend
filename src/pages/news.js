import PortalFeaturePanel from "@/components/common/PortalFeaturePanel";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function NewsPage() {
  const page = content["/news"];
  return (
    <PortalPageLayout page={page} bannerKey="news">
      <PortalFeaturePanel title="Latest updates" label="Stay informed">
        <p className="mt-4 text-sm leading-7 text-slate-600">No news articles have been published in this section yet. Before acting on a policy update, check the relevant government or institution website for current requirements.</p>
        <Link href="/blog" className="mt-4 inline-block font-semibold text-blue-700">Explore planning resources</Link>
      </PortalFeaturePanel>
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/services" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Explore Services</Link>
        <Link href="/contact" className="px-5 py-3 font-semibold text-blue-700">Contact Immify</Link>
      </div>
    </PortalPageLayout>
  );
}

NewsPage.useDefaultLayout = true;
export default NewsPage;

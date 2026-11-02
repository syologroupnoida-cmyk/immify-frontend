import PortalFeaturePanel from "@/components/common/PortalFeaturePanel";
import PortalContentSections from "@/components/common/PortalContentSections";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

const resources = [
  ["Compare providers and service scope", "/providers"],
  ["Prepare for a visa enquiry", "/services/visa-services"],
  ["Compare study costs and institutions", "/services/study-abroad-services"],
  ["Prepare for an international job search", "/services/career-employment-services"],
  ["Plan your move abroad", "/services/family-relocation-services"],
  ["Organise application documents", "/services/documentation-services"],
];

function BlogPage() {
  const page = content["/blog"];
  return (
    <PortalPageLayout page={page} bannerKey="blog">
      <PortalContentSections sections={page.sections} />
      <PortalFeaturePanel title="Start with a practical checklist" label="Planning resources">
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {resources.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-blue-700 hover:bg-sky-50">{label}</Link>
          ))}
        </div>
      </PortalFeaturePanel>
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/services" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Explore Services</Link>
        <Link href="/contact" className="px-5 py-3 font-semibold text-blue-700">Contact Immify</Link>
      </div>
    </PortalPageLayout>
  );
}

BlogPage.useDefaultLayout = true;
export default BlogPage;

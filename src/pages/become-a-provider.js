import PortalContentSections from "@/components/common/PortalContentSections";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function BecomeAProviderPage() {
  const page = content["/become-a-provider"];
  return (
    <PortalPageLayout page={page} bannerKey="become-a-provider">
      <PortalContentSections sections={page.sections} />
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/agent/sign-up" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Become a Provider</Link>
        <Link href="/pricing" className="px-5 py-3 font-semibold text-blue-700">View Provider Plans</Link>
      </div>
    </PortalPageLayout>
  );
}

BecomeAProviderPage.useDefaultLayout = true;
export default BecomeAProviderPage;

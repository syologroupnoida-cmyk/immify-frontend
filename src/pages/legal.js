import PortalFeaturePanel from "@/components/common/PortalFeaturePanel";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function LegalPage() {
  const page = content["/legal"];
  return (
    <PortalPageLayout page={page} bannerKey="legal">
      <PortalFeaturePanel title="Before you engage a provider" label="Platform transparency">
        <p className="mt-4 text-sm leading-7 text-slate-600">Confirm the provider&apos;s credentials, written service scope, fees, cancellation terms and document-handling arrangements. Request the applicable platform and provider policies before sharing sensitive information or making a payment.</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">This page explains Immify&apos;s platform role. Read the <Link href="/privacy-policy" className="font-semibold text-blue-700 underline underline-offset-4">Privacy Policy</Link> for information about data and privacy choices. Review the applicable Terms of Use and provider service agreement before proceeding.</p>
      </PortalFeaturePanel>
      <div className="flex flex-wrap gap-4 py-3">
        <Link href="/services" className="rounded-xl bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white">Explore Services</Link>
        <Link href="/contact" className="px-5 py-3 font-semibold text-blue-700">Contact Immify</Link>
      </div>
    </PortalPageLayout>
  );
}

LegalPage.useDefaultLayout = true;
export default LegalPage;

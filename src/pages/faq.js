import PortalFaqs from "@/components/common/PortalFaqs";
import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function FaqPage() {
  const page = content["/faq"];
  return (
    <PortalPageLayout page={page} bannerKey="faq">
      <PortalFaqs pageKey="faq" title="Your questions, answered" standalone />
      <p className="text-sm text-slate-600">Still have a question? <Link href="/contact" className="font-semibold text-blue-700">Contact Immify</Link>. For current subscription details, <Link href="/pricing" className="font-semibold text-blue-700">view provider plans</Link>.</p>
    </PortalPageLayout>
  );
}

FaqPage.useDefaultLayout = true;
export default FaqPage;

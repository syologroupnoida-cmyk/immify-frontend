import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";
import FreeQuoteSection from "@/components/sections/home/FreeQuoteSection";

function ContactPage() {
  const page = content["/contact"];
  return (
    <PortalPageLayout page={page} bannerKey="contact">
      <FreeQuoteSection appearance="page" />
    </PortalPageLayout>
  );
}

ContactPage.useDefaultLayout = true;
export default ContactPage;

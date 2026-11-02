import PortalContentSections from "@/components/common/PortalContentSections";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import content from "@/content/portalContent.json";

function AboutPage() {
  const page = content["/about"];
  return (
    <PortalPageLayout page={page} bannerKey="about">
      <PortalContentSections sections={page.sections} />
    </PortalPageLayout>
  );
}

AboutPage.useDefaultLayout = true;
export default AboutPage;

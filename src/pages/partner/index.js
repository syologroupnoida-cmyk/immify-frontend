import PartnerFooter from "@/components/common/PartnerFooter";
import PartnerHeader from "@/components/common/PartnerHeader";
import PartnerHome from "@/components/sections/partner/PartnerHome";
import PageSeo from "@/components/common/PageSeo";

function PartnerPage() {
  return (
    <>
      <PageSeo title="Immify Partner Program | Grow Your Business Beyond Borders" description="Join the Immify partner network to showcase your immigration and education services, connect with prospective clients and manage enquiries." />
      <PartnerHeader />
      <PartnerHome />
      <PartnerFooter />
    </>
  );
}

PartnerPage.disableDefaultLayout = true;

export default PartnerPage;

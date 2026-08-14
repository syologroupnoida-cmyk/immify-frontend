import PartnerFooter from "@/components/common/PartnerFooter";
import PartnerHeader from "@/components/common/PartnerHeader";
import PartnerHome from "@/components/sections/partner/PartnerHome";

function PartnerPage() {
  return (
    <>
      <PartnerHeader />
      <PartnerHome />
      <PartnerFooter />
    </>
  );
}

PartnerPage.disableDefaultLayout = true;

export default PartnerPage;

import PageSeo from "@/components/common/PageSeo";
import content from "@/content/portalContent.json";
import PricingPageSections from "@/components/sections/pricing/PricingPageSections";

function Pricing() {
  return <><PageSeo title={content["/pricing"].title} description={content["/pricing"].description} /><PricingPageSections /></>;
}

Pricing.useDefaultLayout = true;

export default Pricing;

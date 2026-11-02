import PageSeo from "@/components/common/PageSeo";
import content from "@/content/portalContent.json";
import VendorMarketplaceSection from "@/components/sections/vendor-marketplace/VendorMarketplaceSection";

export default function MarketplaceVendorsPage() {
  return <><PageSeo title={content["/providers"].title} description={content["/providers"].description} /><VendorMarketplaceSection /></>;
}

MarketplaceVendorsPage.useDefaultLayout = true;

import PageSeo from "@/components/common/PageSeo";
import content from "@/content/portalContent.json";
import VendorDirectory from "@/components/sections/vendor-marketplace/VendorDirectory";

export default function MarketplaceVendorsPage() {
  return <><PageSeo title={content["/providers"].title} description={content["/providers"].description} /><VendorDirectory /></>;
}

MarketplaceVendorsPage.useDefaultLayout = true;

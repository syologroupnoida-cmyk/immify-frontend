import VendorDetailSection from "@/components/sections/vendor-marketplace/VendorDetailSection";
import { getVendorMarketplaceListingBySlug, vendorMarketplaceListings } from "@/components/sections/vendor-marketplace/vendorMarketplaceData";

export async function getStaticPaths() {
  return {
    paths: vendorMarketplaceListings.map((vendor) => ({ params: { slug: vendor.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const vendor = getVendorMarketplaceListingBySlug(params?.slug);

  return {
    props: {
      vendor: vendor || null,
      vendorUserId: params?.slug || "",
    },
    revalidate: 60,
  };
}

export default function MarketplaceVendorDetailPage({ vendor, vendorUserId }) {
  return <VendorDetailSection vendor={vendor} vendorUserId={vendorUserId} />;
}

MarketplaceVendorDetailPage.useDefaultLayout = true;

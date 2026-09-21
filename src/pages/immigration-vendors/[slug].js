import ImmigrationVendorLocationDetailSection from "@/components/sections/vendors/ImmigrationVendorLocationDetailSection";
import { getVendorLocationBySlug, vendorLocations } from "@/components/sections/vendors/vendorLocationData";

export default function ImmigrationVendorLocationPage({ location }) {
  return <ImmigrationVendorLocationDetailSection location={location} />;
}

export function getStaticPaths() {
  return {
    paths: vendorLocations.map((location) => ({ params: { slug: location.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const location = getVendorLocationBySlug(params?.slug);

  return {
    props: {
      location: location || null,
    },
  };
}

ImmigrationVendorLocationPage.useDefaultLayout = true;

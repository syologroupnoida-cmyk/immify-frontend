import VendorDetailSection from "@/components/sections/vendor-marketplace/VendorDetailSection";

export async function getServerSideProps({ params }) {
  return {
    props: {
      vendorUserId: params?.vendorUserId || "",
    },
  };
}

export default function DetailVendorPage({ vendorUserId }) {
  return <VendorDetailSection vendorUserId={vendorUserId} />;
}

DetailVendorPage.useDefaultLayout = true;

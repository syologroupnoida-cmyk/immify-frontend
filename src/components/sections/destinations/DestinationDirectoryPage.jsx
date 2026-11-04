import Link from "next/link";
import PageSeo from "@/components/common/PageSeo";
import DestinationDiscoverySection from "@/components/sections/home/DestinationDiscoverySection";
import RelatedDestinationSection from "./RelatedDestinationSection";

export default function DestinationDirectoryPage({ category = "international" }) {
  const label = category === "national" ? "National" : "International";
  return (
    <main className="min-h-screen bg-white pb-10 pt-[88px]">
      <PageSeo title={`${label} Destinations | Immify`} description={category === "national" ? "Explore cities across India and find local immigration, visa and study abroad support." : "Explore countries and find immigration, study abroad and relocation support with Immify."} />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">Back to home</Link>
      </div>
      <DestinationDiscoverySection standalone category={category} />
      <RelatedDestinationSection category={category} />
    </main>
  );
}

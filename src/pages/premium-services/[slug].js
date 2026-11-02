import PremiumServiceDetail from "@/components/sections/premium-services/PremiumServiceDetail";
import { premiumServiceItems } from "@/components/sections/home/homeData";

export async function getStaticPaths() {
  const paths = premiumServiceItems.map((service) => ({ params: { slug: service.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const service = premiumServiceItems.find((item) => item.slug === params.slug);
  if (!service) return { notFound: true };
  return { props: { service } };
}

function PremiumServiceDetailPage({ service }) {
  return <PremiumServiceDetail service={service} />;
}

PremiumServiceDetailPage.useDefaultLayout = true;
export default PremiumServiceDetailPage;

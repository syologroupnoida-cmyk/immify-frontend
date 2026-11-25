import DirectoryVendorDetail from '@/components/sections/vendor-marketplace/DirectoryVendorDetail';

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  return { props: { id: params?.id || '' } };
}

export default function ProviderDetailPage({ id }) {
  return <DirectoryVendorDetail id={id} />;
}

ProviderDetailPage.useDefaultLayout = true;

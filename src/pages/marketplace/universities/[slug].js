export default function LegacyMarketplaceUniversityDetailPage() {
  return null;
}

export function getServerSideProps({ params }) {
  return {
    redirect: {
      destination: `/universities/${encodeURIComponent(params.slug)}`,
      permanent: true,
    },
  };
}

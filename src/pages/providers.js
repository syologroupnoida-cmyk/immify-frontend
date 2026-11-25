import PageSeo from '@/components/common/PageSeo';
import VendorDirectory from '@/components/sections/vendor-marketplace/VendorDirectory';
import content from '@/content/portalContent.json';

export default function ProvidersPage() {
  return <><PageSeo title={content['/providers'].title} description={content['/providers'].description} /><VendorDirectory /></>;
}

ProvidersPage.useDefaultLayout = true;

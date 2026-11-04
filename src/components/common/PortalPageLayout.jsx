import PageSeo from "./PageSeo";
import PortalFaqs from "./PortalFaqs";
import PortalHero from "./PortalHero";

const bannerFiles = { "become-a-provider": "become-a-provider-v2", blog: "blog-v2" };

export default function PortalPageLayout({ page, bannerKey, bannerImage, children }) {
  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-16 pt-[88px]">
      <PageSeo title={page.title} description={page.description} />
      <PortalHero heading={page.heading} label={page.title.split("|")[0].trim()} imageSrc={bannerImage || `/images/page-banners/full-width/${bannerFiles[bannerKey] || bannerKey}.webp`} />
      <div className="mx-auto max-w-[1344px] px-4 pt-6 text-left sm:px-6 lg:px-8">
        {page.intro && <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">{page.intro}</p></div>}
        <div className={`${page.intro ? "mt-6" : ""} space-y-6`}>{children}</div>
        {bannerKey !== "faq" && <PortalFaqs pageKey={bannerKey} />}
      </div>
    </main>
  );
}

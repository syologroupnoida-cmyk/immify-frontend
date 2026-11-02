import PageSeo from "./PageSeo";
import PortalFaqs from "./PortalFaqs";
import PortalHero from "./PortalHero";

const bannerFiles = { "become-a-provider": "become-a-provider-v2", blog: "blog-v2" };

export default function PortalPageLayout({ page, bannerKey, bannerImage, children }) {
  return (
    <main className="min-h-screen bg-white pb-16 pt-[88px]">
      <PageSeo title={page.title} description={page.description} />
      <PortalHero heading={page.heading} label={page.title.split("|")[0].trim()} imageSrc={bannerImage || `/images/page-banners/full-width/${bannerFiles[bannerKey] || bannerKey}.webp`} />
      <div className="mx-auto max-w-6xl px-4 pt-8 text-left sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        {page.intro && <div className="max-w-4xl border-l-[3px] border-[#f5c542] pl-5 sm:pl-6"><p className="whitespace-pre-line text-base leading-8 text-slate-600">{page.intro}</p></div>}
        <div className={`${page.intro ? "mt-8 sm:mt-10" : ""} space-y-6 sm:space-y-8`}>{children}</div>
        {bannerKey !== "faq" && <PortalFaqs pageKey={bannerKey} />}
      </div>
    </main>
  );
}

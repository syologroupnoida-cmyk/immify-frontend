import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import { serviceCategories } from "@/components/sections/home/homeData";
import content from "@/content/portalContent.json";

function ServicesPage() {
  const page = content["/services"];
  return (
    <PortalPageLayout page={page} bannerKey="services">
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category, index) => (
            <Link key={category.slug} href={`/services/${category.slug}`} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5">
              <div className="mb-5 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-[#1f2a77]">{String(index + 1).padStart(2, "0")}</span><span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" aria-hidden="true">↗</span></div>
              <h2 className="text-xl font-bold text-[#1f2a77]">{category.name}</h2>
              <p className="mb-5 mt-3 text-sm leading-7 text-slate-600">{content[`/services/${category.slug}`]?.intro || category.shortDescription}</p>
              <span className="mt-auto border-t border-slate-100 pt-4 text-sm font-semibold text-blue-700">Explore services →</span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">Not sure which category fits? <Link href="/contact" className="font-semibold text-blue-700">Tell us your goal and destination.</Link></p>
    </PortalPageLayout>
  );
}
ServicesPage.useDefaultLayout = true;
export default ServicesPage;

import PortalHero from "@/components/common/PortalHero";
import PortalFaqs from "@/components/common/PortalFaqs";
import PageSeo from "@/components/common/PageSeo";
import PortalContentSections from "@/components/common/PortalContentSections";
import portalContent from "@/content/portalContent.json";
import Link from "next/link";
import { useEffect, useState } from "react";
import LeadGenerationButton from "../../components/common/LeadGenerationButton";
import { serviceCategories } from "../../components/sections/home/homeData";
import {
  fetchServiceCategories,
  fetchServiceListingsByCategoryId,
} from "../../util/serviceListings";

const serviceDummyImage = "/images/services/service-detail-dummy.png";

export async function getStaticPaths() {
  const paths = serviceCategories.map((category) => ({ params: { slug: category.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = serviceCategories.find((item) => item.slug === params.slug);

  if (!category) {
    return { notFound: true };
  }

  return {
    props: { category },
  };
}

function ServiceDetailPage({ category }) {
  const page = portalContent[`/services/${category.slug}`] || { title: `${category.name} | Immify`, description: category.shortDescription, heading: category.name, intro: category.shortDescription, sections: [] };
  const moreCategories = serviceCategories.filter((item) => item.slug !== category.slug).slice(0, 4);
  const [categoryListings, setCategoryListings] = useState([]);
  const [categoryListingsLoading, setCategoryListingsLoading] = useState(true);
  const [categoryListingsError, setCategoryListingsError] = useState("");
  const handleImageFallback = (event) => {
    if (event.currentTarget.src.includes(serviceDummyImage)) return;
    event.currentTarget.src = serviceDummyImage;
  };

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) {
        setCategoryListingsLoading(true);
        setCategoryListingsError("");
      }
    });

    fetchServiceCategories()
      .then((categories) => {
        const matchedCategory = categories.find((item) => (
          item.name?.toLowerCase() === category.name.toLowerCase()
          || item.raw?.slug === category.slug
          || item.id === category.slug
        ));

        if (!matchedCategory?.id) {
          throw new Error("Service category was not found.");
        }

        return fetchServiceListingsByCategoryId(matchedCategory.id);
      })
      .then((items) => {
        if (active) setCategoryListings(items);
      })
      .catch((error) => {
        if (active) {
          setCategoryListings([]);
          setCategoryListingsError(error?.message || "Unable to load vendors for this service.");
        }
      })
      .finally(() => {
        if (active) setCategoryListingsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category.name, category.slug]);

  return (
    <main className="min-h-screen bg-white pb-16 pt-[88px]">
      <PageSeo title={page.title} description={page.description} />
      <PortalHero heading={page.heading} label={category.name} imageSrc="/images/page-banners/full-width/services.webp" />
      <div className="mx-auto max-w-6xl px-4 pt-8 text-left sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="max-w-4xl border-l-[3px] border-[#f5c542] pl-5 sm:pl-6"><p className="text-base leading-8 text-slate-600">{page.intro}</p></div>
        <section className="mt-6 space-y-6">
          <PortalContentSections sections={page.sections} />
          <div className="rounded-2xl bg-[#1f2a77] p-6 text-white sm:p-8">
            <h2 className="text-xl font-bold">Compare options and ask a provider</h2>
            <p className="mt-3 text-sm leading-7 text-white/85">Confirm the service scope, provider credentials, written fees and terms before making a decision.</p>
            <LeadGenerationButton label="Request a Quote" variant="light" className="mt-5 rounded-xl" />
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Available vendors</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">Vendors for {category.name}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Review available providers, service details, prices and locations before sending an enquiry.
                </p>
              </div>
              <Link href={{ pathname: "/marketplace/vendors", query: { category: category.slug } }} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                View all vendors
              </Link>
            </div>

            {categoryListingsLoading ? (
              <p className="py-10 text-center text-sm text-slate-500">Loading vendors for this service...</p>
            ) : categoryListings.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categoryListings.map((listing) => {
                  const vendorName = [listing.vendor?.firstName, listing.vendor?.lastName].filter(Boolean).join(" ") || listing.vendor?.name || "Service provider";

                  return (
                    <Link
                      key={listing.id}
                      href={`/marketplace/${listing.detailSlug}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-sky-200 hover:bg-white hover:shadow-md"
                    >
                      <img
                        src={listing.image || serviceDummyImage}
                        alt={listing.title}
                        className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        onError={handleImageFallback}
                      />
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase text-sky-700">{listing.serviceName || listing.categoryName}</p>
                        <h4 className="mt-2 line-clamp-2 min-h-11 text-base font-bold leading-6 text-slate-900">{listing.title}</h4>
                        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-600">
                          {listing.description || listing.overview || "Explore provider details, service process, and package information."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[listing.city, vendorName, listing.priceLabel].filter(Boolean).slice(0, 3).map((chip) => (
                            <span key={chip} className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-slate-500">
                {categoryListingsError || "No vendors are available for this service category right now."}
              </p>
            )}
          </section>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-900">More services you may need</h3>
              <Link href="/services" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {moreCategories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md"
                >
                  <img src={item.image || serviceDummyImage} alt={item.name} className="h-28 w-full rounded-xl object-cover" onError={handleImageFallback} />
                  <h4 className="mt-3 text-sm font-semibold text-slate-900">{item.name}</h4>
                  <p className="mt-2 text-xs leading-6 text-slate-600">{item.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <PortalFaqs pageKey={category.slug} />
      </div>
    </main>
  );
}

ServiceDetailPage.useDefaultLayout = true;

export default ServiceDetailPage;

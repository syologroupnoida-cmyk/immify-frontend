import Link from "next/link";
import { topCities } from "../../components/sections/home/homeData";
import DestinationEnquiryCard from "@/components/sections/destinations/DestinationEnquiryCard";

export async function getStaticPaths() {
  const paths = topCities.map((city) => ({ params: { slug: city.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const city = topCities.find((item) => item.slug === params.slug);

  if (!city) {
    return { notFound: true };
  }

  return {
    props: { city },
  };
}

function CityDetailPage({ city }) {
  const relatedCities = topCities.filter((item) => item.slug !== city.slug).slice(0, 3);
  const localServices = [
    "Visa application guidance",
    "Document review",
    "Study abroad counselling",
    "PR pathway assessment",
    "Work visa support",
    "Pre-departure planning",
  ];
  const consultationFlow = [
    "Share your requirement and preferred destination.",
    "Compare local consultants and service options.",
    "Move ahead with documentation and application support.",
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-[112px] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="overflow-hidden rounded-[1.5rem] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <img
              src={city.image}
              alt={city.name}
              className="h-64 w-full object-cover sm:h-80 lg:h-full lg:min-h-96"
              onError={(event) => {
                event.currentTarget.src = "/images/services/service-dummy.svg";
              }}
            />
          </div>

          <DestinationEnquiryCard headingAs="h1" eyebrow="National destination" title={city.name} description={city.summary} highlights={city.highlights || ["Visa support", "Documentation", "Consultation"]} action="Get a free quote" />
        </section>


        <section className="mt-10 border-t border-slate-200 pt-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f2a77]">Popular support areas</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700">
                {(city.highlights || ["Visa support", "Documentation", "Consultation"]).map((item) => (
                  <li key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-7 text-slate-600">
                Compare trusted consultants in {city.name} and get personalized support for your migration plan.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f2a77]">Local services</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">What you can arrange in {city.name}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
              {localServices.map((service) => (
                <span key={service} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {service}
                </span>
              ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f2a77]">Consultation flow</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {consultationFlow.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1f2a77] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="related-destinations-title" className="mt-10 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="related-destinations-title" className="text-xl font-bold text-slate-900">Related destinations</h2>
            <Link href="/destinations/national" className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700">Explore all cities <span aria-hidden="true" className="ml-2">→</span></Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {relatedCities.map((item) => (
              <article key={item.slug} className="min-w-0">
              <Link href={`/cities/${item.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                <div className="h-40 overflow-hidden bg-blue-50">
                  <img src={item.image} alt={item.name} width={600} height={360} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" onError={(event) => {
                    const fallback = "/images/services/service-detail-dummy.png";
                    if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback;
                  }} />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                </div>
              </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

CityDetailPage.useDefaultLayout = true;

export default CityDetailPage;

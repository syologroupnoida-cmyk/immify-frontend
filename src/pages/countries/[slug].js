import Image from "next/image";
import Link from "next/link";
import PageSeo from "@/components/common/PageSeo";
import DestinationEnquiryCard from "@/components/sections/destinations/DestinationEnquiryCard";
import { topCountries } from "@/components/sections/home/homeData";
import { featuredDestinations, getDestinationPhoto } from "@/components/sections/home/destinationData";

const supportAreas = [
  { title: "Study abroad", description: "Find support with course choices, university applications and student visa preparation.", href: "/marketplace/universities", action: "Explore universities" },
  { title: "Work opportunities", description: "Discuss your career plans, work visa questions and documentation with relevant providers.", href: "/providers", action: "Explore career services" },
  { title: "Immigration & relocation", description: "Connect with experts to discuss your profile, destination plans and next steps.", href: "/providers", action: "Find a consultant" },
];

export async function getStaticPaths() {
  return { paths: topCountries.map((country) => ({ params: { slug: country.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const country = topCountries.find((item) => item.slug === params.slug);
  return country ? { props: { country } } : { notFound: true };
}

function CountryDetailPage({ country }) {
  const photo = getDestinationPhoto(country.slug);
  const related = featuredDestinations.filter((item) => item.slug !== country.slug).slice(0, 3);
  return (
    <main className="min-h-screen bg-white pb-12 pt-[88px]">
      <PageSeo title={`Explore ${country.name} | Immify`} description={`${country.summary} Connect with providers for your next chapter in ${country.name}.`} />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="font-semibold text-blue-700 hover:underline">Home</Link><span aria-hidden="true">/</span>
          <Link href="/destinations" className="font-semibold text-blue-700 hover:underline">Destinations</Link><span aria-hidden="true">/</span><span aria-current="page">{country.name}</span>
        </nav>
        <section aria-labelledby="destination-title">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-blue-50 sm:aspect-[16/7]">
            <Image src={photo.src} alt={photo.alt} fill preload sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
          </div>
          <div className="grid gap-6 py-6 sm:py-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Discover {country.name}</p>
              <h1 id="destination-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your Next Chapter Deserves a Destination. <span className="text-blue-700">Explore {country.name}.</span></h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{country.summary} From your first questions to planning your move, connect with professionals who understand your goals and help you prepare for what comes next.</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href="/destinations" className="inline-flex min-h-11 items-center rounded-full border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700">Explore destinations</Link>
              </div>
            </div>
            <DestinationEnquiryCard title={`Plan your move to ${country.name}`} description="Connect with professionals and find support that fits your plans." highlights={["Discuss your destination and goals", "Compare relevant service providers", "Plan documents and next steps"]} action="Start your enquiry" />
          </div>
        </section>
        <section aria-labelledby="destination-support-title" className="border-t border-slate-200 py-8">
          <h2 id="destination-support-title" className="text-xl font-bold text-slate-900 sm:text-2xl">Make your plans for {country.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose the support that fits your journey.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {supportAreas.map((area) => (
              <div key={area.title} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold text-slate-900">{area.title}</h3>
                <p className="mb-4 mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
                <Link href={area.href} className="mt-auto inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 hover:underline">{area.action} <span className="ml-2" aria-hidden="true">→</span></Link>
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="destination-steps-title" className="rounded-2xl bg-blue-50 p-5 sm:p-7">
          <h2 id="destination-steps-title" className="text-xl font-bold text-slate-900">From an idea to your next step</h2>
          <ol className="mt-5 grid gap-5 sm:grid-cols-3">
            {["Tell us your destination, goals and timeline.", "Connect with relevant consultants and compare support.", "Discuss your options and prepare your next steps."].map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-blue-700">{index + 1}</span>{step}</li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="related-destinations-title" className="pt-9">
          <h2 id="related-destinations-title" className="text-xl font-bold text-slate-900">More destinations to discover</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {related.map((item) => {
              const image = getDestinationPhoto(item.slug);
              return (
                <Link key={item.slug} href={`/countries/${item.slug}`} className="group rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-blue-50"><Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 392px, (min-width: 640px) 30vw, 100vw" className="object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none" /></div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-blue-700">{item.name}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

CountryDetailPage.useDefaultLayout = true;
export default CountryDetailPage;

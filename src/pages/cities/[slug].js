import Link from "next/link";
import LeadGenerationButton from "../../components/common/LeadGenerationButton";
import { topCities } from "../../components/sections/home/homeData";

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
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="overflow-hidden rounded-[1.5rem] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <img
              src={city.image}
              alt={city.name}
              className="h-80 w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/services/service-dummy.svg";
              }}
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f2a77]">State detail</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">{city.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{city.summary}</p>
            <LeadGenerationButton label="Get Quote" className="mt-8" />
          </div>
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

            <div>
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

        <section className="mt-10 bg-[#1f2a77] px-6 py-7 text-white sm:px-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Need local help?</p>
              <h2 className="mt-2 text-2xl font-semibold">Connect with immigration support in {city.name}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
                Tell us your destination, service type, and timeline. We will help route your enquiry to the right support path.
              </p>
            </div>
            <LeadGenerationButton label="Start Enquiry" variant="light" />
          </div>
        </section>
      </div>
    </main>
  );
}

CityDetailPage.useDefaultLayout = true;

export default CityDetailPage;

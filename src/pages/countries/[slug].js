import Link from "next/link";
import LeadGenerationButton from "../../components/common/LeadGenerationButton";
import { topCountries } from "../../components/sections/home/homeData";

export async function getStaticPaths() {
  const paths = topCountries.map((country) => ({ params: { slug: country.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const country = topCountries.find((item) => item.slug === params.slug);

  if (!country) {
    return { notFound: true };
  }

  return {
    props: { country },
  };
}

function CountryDetailPage({ country }) {
  const studyAbroadDetails = [
    { label: "Popular intake", value: "January, May, September" },
    { label: "Average tuition", value: "INR 12L - 28L per year" },
    { label: "Living cost", value: "INR 70K - 1.4L per month" },
    { label: "Visa support", value: "Documents, SOP, funds and interview prep" },
  ];
  const agentList = [
    {
      name: "Global Edu Advisors",
      city: "New Delhi",
      rating: "4.8",
      services: ["University shortlisting", "Student visa", "SOP review"],
    },
    {
      name: "BrightPath Overseas",
      city: "Mumbai",
      rating: "4.7",
      services: ["Admission filing", "Scholarship guidance", "Pre-departure"],
    },
    {
      name: "StudyBridge Consultants",
      city: "Bengaluru",
      rating: "4.9",
      services: ["Course selection", "Education loan", "Visa documents"],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f2a77]">Study Abroad</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">
              Study in {country.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {country.summary} Get dummy study guidance, expected costs, intake planning, and agent options for this destination.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-slate-900">Study programs available</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {country.programs.map((program) => (
                  <span key={program} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                    {program}
                  </span>
                ))}
              </div>
            </div>

            <LeadGenerationButton label="Get Quote" className="mt-8" />
          </div>

          <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <img
              src={country.image}
              alt={country.name}
              className="h-72 w-full object-contain p-8 sm:h-80"
              onError={(event) => {
                event.currentTarget.src = "/images/services/service-dummy.svg";
              }}
            />
          </div>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f2a77]">Study Abroad</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{country.name} study overview</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Dummy guidance for students comparing courses, budget, intakes, documents, and visa readiness before applying.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {studyAbroadDetails.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f2a77]">Agents</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Suggested study agents</h2>
              <div className="mt-5 space-y-4">
                {agentList.map((agent) => (
                  <div key={agent.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{agent.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{agent.city} | Rating {agent.rating}</p>
                      </div>
                      <LeadGenerationButton label="Connect" variant="outline" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {agent.services.map((service) => (
                        <span key={service} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 bg-[#1f2a77] px-6 py-7 text-white sm:px-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Next step</p>
              <h2 className="mt-2 text-2xl font-semibold">Get country-specific guidance for {country.name}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
                Share your target program, timeline, and profile details. Immify will help you understand the best route, required documents, and practical next actions.
              </p>
            </div>
            <LeadGenerationButton label="Start Enquiry" variant="light" />
          </div>
        </section>
      </div>
    </main>
  );
}

CountryDetailPage.useDefaultLayout = true;

export default CountryDetailPage;

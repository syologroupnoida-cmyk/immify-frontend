import Link from "next/link";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";
import { universities } from "@/components/sections/mbbs/mbbsData";

const highlights = [
  { label: "Course Duration", value: "6 Years" },
  { label: "Medium", value: "English" },
  { label: "Intake", value: "September" },
  { label: "Approval", value: "NMC Guidance" },
];

const supportItems = [
  "University application support",
  "Eligibility and document review",
  "Admission letter coordination",
  "Visa file guidance",
  "Pre-departure support",
  "Parent update assistance",
];

export async function getStaticPaths() {
  const paths = universities.map((university) => ({ params: { slug: university.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const university = universities.find((item) => item.slug === params.slug);

  if (!university) {
    return { notFound: true };
  }

  return {
    props: { university },
  };
}

function MbbsUniversityDetailPage({ university }) {
  return (
    <main className="min-h-screen bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/mbbs-study-abroad" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Back to MBBS Abroad
        </Link>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">MBBS University</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {university.name}
              </h1>
              <p className="mt-4 text-base font-semibold text-slate-500">{university.city}</p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Compare admission support, tuition guidance, intake planning, and visa document help for students
                targeting MBBS admission at {university.name}.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-base font-bold text-[#062c53]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <LeadGenerationButton label="Apply Now" className="px-7 py-3" />
                <LeadGenerationButton label="Get Free Counselling" variant="outline" className="px-7 py-3" />
              </div>
            </div>

            <div className="relative min-h-[320px] bg-slate-100">
              <img
                src={university.logo}
                alt={university.name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/images/services/service-detail-dummy.png";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-5 text-white">
                <p className="text-sm font-semibold">{university.rank}</p>
                <p className="mt-1 text-xs text-white/80">Established {university.established}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Admission Support Includes</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {supportItems.map((item) => (
                <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Fee Details</p>
            <h3 className="mt-3 text-3xl font-bold text-[#062c53]">{university.fee}</h3>
            <p className="mt-2 text-sm text-slate-500">Indicative tuition fee</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Country rank</dt>
                <dd className="font-semibold text-slate-900">{university.rank}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Established</dt>
                <dd className="font-semibold text-slate-900">{university.established}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">City</dt>
                <dd className="text-right font-semibold text-slate-900">{university.city}</dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}

MbbsUniversityDetailPage.useDefaultLayout = true;

export default MbbsUniversityDetailPage;

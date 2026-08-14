import Link from "next/link";
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
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">Country detail</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                {country.flag} {country.name}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">{country.summary}</p>

              <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-semibold text-slate-900">Programs available</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {country.programs.map((program) => (
                    <div key={program} className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                      {program}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Why this country</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Explore immigration and employment support tailored to this destination, including application planning and documentation guidance.
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Need help?</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Speak with our country experts to compare programs and start your application journey.
                </p>
                <button className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Book consultation
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

CountryDetailPage.useDefaultLayout = true;

export default CountryDetailPage;

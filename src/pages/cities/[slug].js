import Link from "next/link";
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
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img
              src={city.image}
              alt={city.name}
              className="h-72 w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/services/service-dummy.svg";
              }}
            />

            <div className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">City detail</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">{city.name}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">{city.summary}</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Popular support areas</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {(city.highlights || ["Visa support", "Documentation", "Consultation"]).map((item) => (
                  <li key={item} className="rounded-xl bg-slate-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Need expert help?</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Compare trusted consultants in {city.name} and get personalized support for your migration plan.
              </p>
              <button className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Book consultation
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

CityDetailPage.useDefaultLayout = true;

export default CityDetailPage;

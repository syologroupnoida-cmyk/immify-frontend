import Link from "next/link";
import { premiumServiceItems } from "../../components/sections/home/homeData";

function PremiumServicesIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-sky-700">
          ← Back to home
        </Link>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">Premium services</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Explore Premium Immigration Services</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Choose a premium service below to view complete details and offerings.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {premiumServiceItems.map((service) => (
              <Link
                key={service.slug}
                href={`/premium-services/${service.slug}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-white"
              >
                <p className="text-2xl">{service.icon}</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{service.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

PremiumServicesIndexPage.useDefaultLayout = true;

export default PremiumServicesIndexPage;

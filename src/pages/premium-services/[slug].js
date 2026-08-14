import Link from "next/link";
import { premiumServiceItems } from "../../components/sections/home/homeData";

export async function getStaticPaths() {
  const paths = premiumServiceItems.map((service) => ({ params: { slug: service.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const service = premiumServiceItems.find((item) => item.slug === params.slug);

  if (!service) {
    return { notFound: true };
  }

  return {
    props: { service },
  };
}

function PremiumServiceDetailPage({ service }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8faff_0%,_#f3f6fb_100%)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          ← Back to home
        </Link>

        <section className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="relative h-[260px] sm:h-[380px] lg:h-[460px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.10),_rgba(15,23,42,0.65))]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_#1f2a77_0%,_#2b3f9f_100%)] opacity-80" />
            <div className="absolute inset-0 flex items-end">
              <div className="p-5 sm:p-7 lg:p-8">
                <div className="max-w-4xl">
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                    Premium service
                  </span>
                  <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-6xl">{service.title}</h1>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
                    {service.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/70">Service type</p>
                      <p className="mt-1 text-lg font-semibold">Premium</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/70">Benefits</p>
                      <p className="mt-1 text-lg font-semibold">{service.benefits.length} included</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/70">Support</p>
                      <p className="mt-1 text-lg font-semibold">Dedicated expert</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">What this premium service includes</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Tailored support built around your goals</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {service.detailBody}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {service.benefits.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-8">
                <h3 className="text-xl font-semibold text-slate-900">Need help?</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Speak with our premium support team for tailored planning and faster execution.
                </p>
                <button className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white hover:bg-sky-800">
                  Book consultation
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
                <h3 className="text-xl font-semibold text-slate-900">Why choose premium</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />Priority support and response handling.</li>
                  <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />Tailored recommendations based on your case.</li>
                  <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />End-to-end planning with expert guidance.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

PremiumServiceDetailPage.useDefaultLayout = true;

export default PremiumServiceDetailPage;

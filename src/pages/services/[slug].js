import Link from "next/link";
import LeadGenerationButton from "../../components/common/LeadGenerationButton";
import { serviceCategories } from "../../components/sections/home/homeData";

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
  const moreCategories = serviceCategories.filter((item) => item.slug !== category.slug).slice(0, 4);
  const handleImageFallback = (event) => {
    if (event.currentTarget.src.includes(serviceDummyImage)) return;
    event.currentTarget.src = serviceDummyImage;
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8faff_0%,_#f3f6fb_100%)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          ← Back to home
        </Link>

        <section className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="relative h-[260px] sm:h-[380px] lg:h-[460px]">
            <img
              src={category.image || serviceDummyImage}
              alt={category.name}
              className="h-full w-full object-cover"
              onError={handleImageFallback}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
              <div className="max-w-4xl">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                  Service detail
                </span>
                <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-6xl">{category.name}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
                  {category.shortDescription}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/70">Services</p>
                    <p className="mt-1 text-lg font-semibold">{category.services.length} options</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/70">Support</p>
                    <p className="mt-1 text-lg font-semibold">Guided process</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/70">Delivery</p>
                    <p className="mt-1 text-lg font-semibold">Step-by-step</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">About this service</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Everything you need in one guided package</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {category.detailBody || category.shortDescription}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                We help you understand the process, gather the right documents, and move forward with clear next steps.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs text-slate-500">Services</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{category.services.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs text-slate-500">Support</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Available</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{category.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs text-slate-500">Guide</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Step-by-step</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,_#1f2a77_0%,_#23328a_100%)] p-6 text-white shadow-[0_12px_36px_rgba(15,23,42,0.12)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Need help?</p>
              <h3 className="mt-3 text-2xl font-bold">Talk to a specialist</h3>
              <p className="mt-4 text-sm leading-7 text-white/80">
                Speak with our experts to get tailored advice and application support for this service.
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/65">Fast response</p>
                  <p className="mt-1 text-sm font-semibold text-white">Usually replies in a few minutes</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/65">Flexible support</p>
                  <p className="mt-1 text-sm font-semibold text-white">Phone, chat, or consultation</p>
                </div>
              </div>

              <LeadGenerationButton label="Get Quote" variant="light" className="mt-6 rounded-xl" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">What&apos;s included</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.services.map((service) => (
                <div key={service} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900">How we help</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />Simple guidance from start to finish.</li>
                <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />Document checklist and review support.</li>
                <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />Clear next steps for your case.</li>
                <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />Support for follow-up and submission.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900">Why choose this service?</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">Transparent guidance</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Clear support at every step of the process.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">Trusted support</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Practical advice from experienced specialists.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-900">More services you may need</h3>
              <Link href="/services/visa-services" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
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
      </div>
    </main>
  );
}

ServiceDetailPage.useDefaultLayout = true;

export default ServiceDetailPage;

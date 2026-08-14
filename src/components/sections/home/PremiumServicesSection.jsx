import Link from "next/link";
import { premiumServiceItems } from "./homeData";

const latestNews = [
  {
    id: 1,
    date: "May 20, 2025",
    title: "Canada Express Entry Draw #325: More Invitations Issued",
    description: "IRCC invites 3,000 candidates in the latest Express Entry draw with a CRS score of 486.",
    badge: "New",
  },
  {
    id: 2,
    date: "May 18, 2025",
    title: "Australia Increases Skilled Migration Quota for 2025-26",
    description: "The Australian Government has increased the skilled migration quota to address labor shortages.",
  },
  {
    id: 3,
    date: "May 15, 2025",
    title: "UK Updates Dependent Visa Rules for International Students",
    description: "New rules will impact dependent visa applications starting January 2026.",
  },
  {
    id: 4,
    date: "May 12, 2025",
    title: "New Zealand Simplifies Work Visa Process",
    description: "Changes aim to make the work visa process faster and easier for skilled workers.",
  },
];

const verticalNewsItems = [...latestNews, ...latestNews];

export default function PremiumServicesSection() {
  return (
    <section
      id="premium-services"
      className="w-full bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#ffffff_55%)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1.95fr_1fr]">
          <div className="p-2 sm:p-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-500">What We Offer</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Premium Immigration Services</h2>
              <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-amber-400" />
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-xl">
                Dedicated high-priority support tailored for clients who need speed, precision, and personalized service.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {premiumServiceItems.map((service) => (
                <article
                  key={service.slug}
                  className="group rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-50 via-slate-50 to-amber-50 text-4xl">
                      {service.icon}
                    </div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      ›
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{service.description}</p>

                  <Link href={`/premium-services/${service.slug}`} className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-blue-700">
                    Learn More
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>

          </div>

          <aside className="flex h-full flex-col p-2 sm:p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-500">Latest News</p>
                <div className="mt-2 h-1 w-12 rounded-full bg-amber-400" />
                <h3 className="mt-4 text-3xl font-bold leading-tight text-slate-900">Stay Updated with Important Immigration News</h3>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                ▦
              </div>
            </div>

            <div className="mt-8 h-[850px] overflow-hidden pr-2">
              <div className="vertical-news-track space-y-6">
                {verticalNewsItems.map((item, index) => (
                  <article key={`${item.id}-${index}`} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-amber-400 bg-white" />
                    <span className="absolute left-[5px] top-5 h-[calc(100%+14px)] w-px bg-amber-200" />

                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      {item.badge && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-600">{item.badge}</span>}
                      <span>{item.date}</span>
                    </div>
                    <h4 className="mt-3 text-xl font-semibold leading-tight text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .vertical-news-track {
          animation: premium-news-vertical 24s linear infinite;
        }

        @keyframes premium-news-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </section>
  );
}

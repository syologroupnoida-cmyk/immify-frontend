import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AnalyticsOutlined,
  CampaignOutlined,
  CheckCircleOutlined,
  GroupsOutlined,
  LocalOfferOutlined,
  PhoneIphoneOutlined,
  RocketLaunchOutlined,
} from "@mui/icons-material";

const adOptions = [
  {
    title: "Marketplace Spotlight",
    text: "Feature your service where active customers browse immigration, travel, study, jobs, and relocation support.",
    icon: <LocalOfferOutlined sx={{ fontSize: 22 }} />,
  },
  {
    title: "Lead Generation",
    text: "Capture high-intent enquiries with phone-first campaign flows built for quick callbacks.",
    icon: <GroupsOutlined sx={{ fontSize: 22 }} />,
  },
  {
    title: "Brand Visibility",
    text: "Promote your business across discovery pages with placements that feel native and easy to trust.",
    icon: <CampaignOutlined sx={{ fontSize: 22 }} />,
  },
];

const stats = [
  { label: "Active marketplace categories", value: "20+" },
  { label: "Lead-focused campaign formats", value: "6" },
  { label: "Business visibility channels", value: "All" },
];

const steps = [
  "Share your mobile number",
  "Choose campaign goal",
  "Go live with guided setup",
];

export default function AdvertisePage() {
  const [mobileNumber, setMobileNumber] = useState("");

  const handleMobileChange = (event) => {
    setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 10));
  };

  return (
    <main className="min-h-screen bg-[#f5f8fb] pt-16">
      <section className="bg-white">
        <div className="mx-auto grid min-h-[560px] w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              <RocketLaunchOutlined sx={{ fontSize: 16 }} />
              Advertise on Immify
            </span>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Grow your business with high-intent marketplace visibility.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Reach customers searching for trusted services, jobs, relocation support, travel help, and immigration guidance.
            </p>

            <form className="mt-7 max-w-md rounded-[10px] border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <label htmlFor="advertiseMobile" className="mb-2 block text-sm font-semibold text-slate-800">
                Enter mobile number
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-3">
                  <PhoneIphoneOutlined sx={{ fontSize: 20, color: "#64748b" }} />
                  <input
                    id="advertiseMobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    placeholder="9876543210"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#1f2a77] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17215f]"
                >
                  Get callback
                </button>
              </div>
            </form>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="border-l-2 border-amber-400 pl-3">
                  <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[8px] bg-white sm:min-h-[420px] lg:min-h-[500px]">
            <Image
              src="/images/advertise-hero.png"
              alt="Advertising dashboard visual"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {adOptions.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1f2a77] text-white">
                {item.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#1f2a77]">Campaign setup</span>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Launch campaigns without a heavy setup cycle.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Immify advertising is built for partners who need quick visibility, clean enquiry capture, and practical support from campaign setup to lead flow.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[8px] bg-[#1f2a77] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center lg:p-8">
          <div>
            <h2 className="text-2xl font-semibold">Ready to advertise your service?</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Start with your phone number and our team can help you choose the right campaign placement.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white px-5 py-3 text-sm font-semibold text-[#1f2a77] transition hover:bg-slate-100"
          >
            <AnalyticsOutlined sx={{ fontSize: 18 }} />
            View marketplace
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Sponsored listing", "Banner placement", "Category promotion", "Lead campaign"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              <CheckCircleOutlined sx={{ fontSize: 18, color: "#10b981" }} />
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

AdvertisePage.useDefaultLayout = true;

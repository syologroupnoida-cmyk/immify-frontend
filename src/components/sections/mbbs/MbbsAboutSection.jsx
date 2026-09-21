import LeadGenerationButton from "@/components/common/LeadGenerationButton";
import { benefits } from "./mbbsData";

export default function MbbsAboutSection() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-blue-600 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white">
            About Us
          </span>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-[620px]">
            <div className="absolute -bottom-5 left-8 right-[-18px] top-8 rounded-[1.75rem] border-[3px] border-blue-600" />
            <img
              src="/images/home/home-hero-documentation.png"
              alt="MBBS counselling"
              className="relative h-[460px] w-full rounded-[1.75rem] object-cover shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
            />
            <div className="absolute -right-8 top-8 rounded-2xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white">
                  %
                </span>
                <div>
                  <p className="text-lg font-bold text-[#062c53]">98%</p>
                  <p className="mt-1 text-xs text-slate-500">Success Rate</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-8 rounded-2xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white">
                  +
                </span>
                <div>
                  <p className="text-lg font-bold text-[#062c53]">5000+</p>
                  <p className="mt-1 text-xs text-slate-500">Happy Students</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="max-w-3xl text-4xl font-bold leading-tight text-[#062c53] sm:text-5xl">
              Empowering <span className="text-blue-600">Future Doctors</span> Since 2009
            </h2>
            <p className="mt-7 text-sm leading-8 text-slate-700 sm:text-base">
              We are India&apos;s trusted MBBS abroad consultancy, helping aspiring medical students secure admissions in NMC and WHO approved universities across Russia, Georgia, Kazakhstan, Kyrgyzstan, Uzbekistan and other countries. Our mission is to make quality medical education accessible, affordable and stress-free for every Indian student who dreams of wearing the white coat.
            </p>

            <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    &#10003;
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <LeadGenerationButton label="Schedule Consultation" className="px-8 py-3" />
              <LeadGenerationButton label="Enquiry Now" variant="outline" className="px-8 py-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

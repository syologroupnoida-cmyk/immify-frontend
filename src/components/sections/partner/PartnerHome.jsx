import Image from "next/image";
import {
  ArrowForward,
  AttachMoney,
  CalendarMonth,
  Castle,
  CorporateFare,
  Description,
  Diversity3,
  FlightTakeoff,
  Gavel,
  Groups,
  LocationOn,
  MenuBook,
  Public,
  School,
  Search,
  SupportAgent,
  WorkspacePremium,
} from "@mui/icons-material";
import HeroImage1 from "@/images/hero-slider-img1.png";
import HeroImage2 from "@/images/hero-slider-img2.png";
import HeroImage3 from "@/images/hero-slider-img3.png";

const heroStats = [
  { label: "Universities", value: "2500+" },
  { label: "Countries", value: "50+" },
  { label: "Visa Success Rate", value: "98%" },
];

const destinations = [
  { name: "Canada", flagCode: "ca" },
  { name: "Australia", flagCode: "au" },
  { name: "United Kingdom", flagCode: "gb" },
  { name: "United States", flagCode: "us" },
  { name: "Germany", flagCode: "de" },
  { name: "New Zealand", flagCode: "nz" },
];

const universities = [
  {
    name: "The University of British Columbia",
    country: "Canada",
    fee: "CAD 29,714",
    intake: "Sep 2025",
    duration: "3-4 Years",
    scholarship: "Up to CAD 5,000 scholarships available",
    rank: "#34",
    image: HeroImage1,
  },
  {
    name: "The University of Oxford",
    country: "United Kingdom",
    fee: "GBP 27,800",
    intake: "Oct 2025",
    duration: "3-4 Years",
    scholarship: "Up to GBP 7,500 scholarships available",
    rank: "#2",
    image: HeroImage2,
  },
  {
    name: "Massachusetts Institute of Technology",
    country: "United States",
    fee: "USD 61,990",
    intake: "Sep 2025",
    duration: "4 Years",
    scholarship: "Up to USD 10,000 scholarships available",
    rank: "#1",
    image: HeroImage3,
  },
];

const courses = [
  { name: "MBA", icon: WorkspacePremium },
  { name: "Computer Science", icon: CorporateFare },
  { name: "Nursing", icon: SupportAgent },
  { name: "Hospitality Management", icon: Castle },
  { name: "Engineering", icon: Gavel },
  { name: "Business Analytics", icon: MenuBook },
];

const processSteps = [
  { title: "Choose University", desc: "Select the best university that fits your goals." },
  { title: "Submit Documents", desc: "We help you prepare and submit all required documents." },
  { title: "Receive Offer Letter", desc: "Get admission offer from your chosen university." },
  { title: "Visa Assistance", desc: "Complete your visa process with expert guidance." },
  { title: "Fly Abroad", desc: "Pack your bags and start your new journey." },
];

const schools = [
  { name: "St. George's International School", city: "Toronto, Canada", curriculum: "IB Curriculum", grades: "Grades 1 - 12", image: "/images/countries/country-3.png" },
  { name: "North Sydney International College", city: "Sydney, Australia", curriculum: "British Curriculum", grades: "Grades K - 12", image: "/images/countries/country-4.png" },
  { name: "EtonHouse International School", city: "Singapore", curriculum: "IB Curriculum", grades: "Grades K - 12", image: "/images/countries/country-5.png" },
  { name: "Dover Court International School", city: "London, UK", curriculum: "British Curriculum", grades: "Grades 3 - 13", image: "/images/countries/country-2.png" },
];

const benefits = [
  { title: "Scholarships", subtitle: "Up to 100% scholarships available", icon: AttachMoney },
  { title: "Visa Guidance", subtitle: "End-to-end visa assistance", icon: Description },
  { title: "Affordable Fees", subtitle: "Best value education options", icon: School },
  { title: "Accommodation", subtitle: "Help with on-campus or off-campus stay", icon: LocationOn },
  { title: "Internship Support", subtitle: "Gain real-world experience while you study", icon: Groups },
  { title: "Career Support", subtitle: "Build your career with global opportunities", icon: Public },
  { title: "24/7 Assistance", subtitle: "We are always here to help you", icon: SupportAgent },
];

const stories = [
  {
    name: "Arjun Mehta",
    country: "Canada",
    text: "The team guided me at every step and helped me get admission in my dream university in Canada.",
    university: "University of Toronto",
    image: HeroImage1,
  },
  {
    name: "Priya Sharma",
    country: "Australia",
    text: "From shortlisting to visa approval, everything was so smooth. Highly recommended.",
    university: "The University of Melbourne",
    image: HeroImage2,
  },
  {
    name: "Rahul Verma",
    country: "UK",
    text: "Excellent support and transparent process. Today I am studying in the UK with a scholarship.",
    university: "University of Manchester",
    image: HeroImage3,
  },
];

function UniversityCard({ uni }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <div className="relative h-44 overflow-hidden">
        <Image src={uni.image} alt={uni.name} className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3 rounded-xl bg-amber-300 px-3 py-2 text-right text-sm font-bold text-slate-900">
          <p>{uni.rank}</p>
          <p className="text-[11px] font-semibold">QS Ranking</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <h3 className="text-xl font-black tracking-tight text-slate-900">{uni.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{uni.country}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <p className="font-semibold">{uni.fee}</p>
            <p>Tuition/Year</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <p className="font-semibold">{uni.intake}</p>
            <p>Intake</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <p className="font-semibold">{uni.duration}</p>
            <p>Duration</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-emerald-700">{uni.scholarship}</p>
          <a href="#" className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">
            View Details
            <ArrowForward sx={{ fontSize: 15 }} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function PartnerHome() {
  return (
    <main className="bg-white pb-0">
      <section className="w-full bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col justify-center">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
                <Diversity3 sx={{ fontSize: 18 }} />
                Partner With Us
              </p>
              <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Study at Top
                <br />
                <span className="text-blue-700">Universities Worldwide</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-8 text-slate-600">
                Explore universities, colleges, and schools across the globe and apply with expert admission support.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#top-universities" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
                  <Search sx={{ fontSize: 18 }} />
                  Find Universities
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700">
                  <SupportAgent sx={{ fontSize: 18 }} />
                  Talk to an Expert
                </a>
              </div>

              <div className="mt-7 grid max-w-md grid-cols-3 gap-4">
                {heroStats.map((item) => (
                  <div key={item.label}>
                    <p className="text-2xl font-black text-slate-900">{item.value}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.5),_transparent_35%),linear-gradient(180deg,#edf3ff,#e8f1ff)]">
              <div className="absolute -right-8 top-8 text-blue-600/85">
                <FlightTakeoff sx={{ fontSize: 52 }} />
              </div>
              <div className="absolute inset-0 flex items-end justify-center">
                <Image src={HeroImage3} alt="Students" className="h-full w-full object-cover object-center" />
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="w-full bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">Popular Study Destinations</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {destinations.map((item) => (
            <div key={item.name} className="text-center">
              <div className="mx-auto h-[82px] w-[82px] rounded-full border border-slate-100 bg-white p-[2px] shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
                <div
                  className="h-full w-full rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(https://flagcdn.com/w160/${item.flagCode}.png)` }}
                  role="img"
                  aria-label={`${item.name} flag`}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-800">{item.name}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section id="top-universities" className="w-full bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Top Universities for You</h2>
          <a href="#" className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">
            View All Universities
            <ArrowForward sx={{ fontSize: 14 }} />
          </a>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {universities.map((uni) => (
            <UniversityCard key={uni.name} uni={uni} />
          ))}
          </div>
        </div>
      </section>

      <section id="popular-courses" className="w-full bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">Popular Courses</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {courses.map((course) => {
            const Icon = course.icon;

            return (
              <div key={course.name} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <div className="mx-auto inline-flex rounded-full bg-blue-50 p-3 text-blue-700">
                  <Icon />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-800">{course.name}</p>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">Our Simple Admission Process</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">{index + 1}</div>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{step.desc}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section id="partner-schools" className="w-full bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Our Partner Schools</h2>
          <a href="#" className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">
            View All Schools
            <ArrowForward sx={{ fontSize: 14 }} />
          </a>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {schools.map((school) => (
            <article key={school.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="relative h-36">
                <Image src={school.image} alt={school.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-base font-extrabold tracking-tight text-slate-900">{school.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{school.city}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{school.curriculum}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{school.grades}</span>
                </div>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                  Apply Now
                  <ArrowForward sx={{ fontSize: 14 }} />
                </a>
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">Why Choose Our Partner Universities?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
                <div className="mx-auto inline-flex rounded-full bg-blue-50 p-3 text-blue-700">
                  <Icon sx={{ fontSize: 20 }} />
                </div>
                <h3 className="mt-3 text-sm font-extrabold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{benefit.subtitle}</p>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      <section id="success-stories" className="w-full bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Student Success Stories</h2>
          <a href="#" className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">
            View All Stories
            <ArrowForward sx={{ fontSize: 14 }} />
          </a>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {stories.map((story) => (
            <article key={story.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full">
                  <Image src={story.image} alt={story.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{story.name}</h3>
                  <p className="text-sm text-slate-500">{story.country}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{story.text}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{story.university}</p>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-[linear-gradient(135deg,#1842b6,#1e88ff)] px-6 py-8 text-white shadow-[0_18px_45px_rgba(30,64,175,0.35)] lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Need Help Choosing the Right University?</h2>
            <p className="mt-2 text-white/85">Our experts are here to guide you towards your dream future.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 lg:mt-0">
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-900">
              <CalendarMonth sx={{ fontSize: 18 }} />
              Book Free Counseling
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
              <SupportAgent sx={{ fontSize: 18 }} />
              Contact Advisor
            </a>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}

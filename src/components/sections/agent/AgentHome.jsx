import {
  ArrowForward,
  Login,
  AssignmentTurnedIn,
  FlightTakeoff,
  Handshake,
  HeadsetMic,
  HomeWork,
  Language,
  Public,
  RocketLaunch,
  School,
  TrendingUp,
  Verified,
  Work,
} from "@mui/icons-material";
import Image from "next/image";
import HeroImage1 from "@/images/hero-slider-img1.png";
import HeroImage2 from "@/images/hero-slider-img2.png";
import HeroImage3 from "@/images/hero-slider-img3.png";

const topBenefits = [
  {
    icon: HeadsetMic,
    title: "Dedicated Support",
    description: "Always here for you",
    accent: "text-blue-700",
  },
  {
    icon: AssignmentTurnedIn,
    title: "Updated Resources",
    description: "Latest visa & travel updates",
    accent: "text-violet-700",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "More leads, more success",
    accent: "text-emerald-700",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    description: "Together we achieve more",
    accent: "text-amber-600",
  },
];

const featureItems = [
  {
    icon: Language,
    title: "Global Network",
    description: "Access to 50+ countries",
    accent: "bg-blue-500/18 text-blue-100",
  },
  {
    icon: Verified,
    title: "Reliable Process",
    description: "Transparent & secure",
    accent: "bg-violet-500/18 text-violet-100",
  },
  {
    icon: HeadsetMic,
    title: "Expert Assistance",
    description: "Get help whenever you need",
    accent: "bg-cyan-400/18 text-cyan-100",
  },
  {
    icon: Public,
    title: "Better Commissions",
    description: "Earn more with every success",
    accent: "bg-amber-400/18 text-amber-100",
  },
];

const journeyItems = [
  {
    icon: School,
    title: "Study Abroad",
    description: "World-class education opportunities",
    accent: "bg-blue-100 text-blue-700",
  },
  {
    icon: Work,
    title: "Work Abroad",
    description: "Better career, bigger opportunities",
    accent: "bg-violet-100 text-violet-700",
  },
  {
    icon: HomeWork,
    title: "Settle Abroad",
    description: "A new life, a better future",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: FlightTakeoff,
    title: "Family Reunification",
    description: "Bring families closer together",
    accent: "bg-orange-100 text-orange-700",
  },
];

const onboardingSteps = [
  {
    icon: Verified,
    title: "Easy Registration",
    accent: "bg-blue-100 text-blue-700",
  },
  {
    icon: AssignmentTurnedIn,
    title: "Quick Verification",
    accent: "bg-violet-100 text-violet-700",
  },
  {
    icon: RocketLaunch,
    title: "Start Getting Leads",
    accent: "bg-emerald-100 text-emerald-700",
  },
];

function TopBenefit({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-white/85 p-4 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className={`mx-auto inline-flex rounded-full bg-slate-50 p-3 ${item.accent}`}>
        <Icon fontSize="small" />
      </div>
      <h3 className="mt-3 text-base font-extrabold leading-5 tracking-tight text-slate-900">{item.title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p>
    </div>
  );
}

function FeaturePill({ item }) {
  const Icon = item.icon;

  return (
    <div className="grid gap-3 text-center text-white">
      <div className={`mx-auto inline-flex rounded-full p-3 ${item.accent}`}>
        <Icon fontSize="small" />
      </div>
      <div>
        <h3 className="text-lg font-extrabold tracking-tight">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-blue-100/80">{item.description}</p>
      </div>
    </div>
  );
}

function OpportunityItem({ item }) {
  const Icon = item.icon;

  return (
    <div className="flex items-start gap-4">
      <div className={`inline-flex rounded-full p-3 ${item.accent}`}>
        <Icon fontSize="small" />
      </div>
      <div>
        <h3 className="text-base font-extrabold tracking-tight text-slate-950">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
      </div>
    </div>
  );
}

export default function AgentHome() {
  return (
    <main className="bg-white pb-0 pt-0">
      <div className="flex flex-col gap-0">
        <section
          className="relative w-full overflow-hidden bg-[#143aa2] text-white"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(10, 31, 96, 0.82) 0%, rgba(17, 64, 184, 0.56) 45%, rgba(30, 136, 255, 0.2) 100%), url(${HeroImage2.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Trusted Agent Network</p>
              <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Build Global Opportunities For Every Client Journey
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-50/85 sm:text-lg">
                Partner with Immify to guide students, workers, and families with better support, faster updates, and a stronger immigration network.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#verification"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#ffc533] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_35px_rgba(15,23,42,0.24)] transition hover:translate-y-[-1px]"
                >
                  Become an Agent
                  <ArrowForward fontSize="small" />
                </a>
                <a
                  href="#why-us"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Explore Benefits
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full overflow-hidden bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.95fr_1fr] lg:items-stretch lg:px-8 lg:py-10">
            <div className="relative min-h-[300px] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.4),_transparent_35%),linear-gradient(180deg,#eef5ff,#ffffff)]">
              <div className="absolute -left-8 bottom-4 h-40 w-40 rounded-full bg-sky-100 blur-3xl" />
              <div className="absolute -right-8 top-4 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
              <div className="absolute inset-0 flex items-end justify-start">
                <Image src={HeroImage1} alt="Agent support" className="h-full w-full object-cover object-left-bottom" priority />
              </div>
            </div>

            <div className="flex flex-col justify-center py-2 lg:px-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Your Trusted Partner</p>
              <h1 className="mt-3 max-w-md text-3xl font-black tracking-tight text-[#152462] sm:text-4xl">
                Support Your Clients. Grow Your Journey.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-8 text-slate-600">
                Get the best tools, resources and support to serve your clients better and grow your business as a trusted immigration and travel agent.
              </p>
              <div className="mt-6">
                <a
                  href="#verification"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(37,99,235,0.3)] transition hover:translate-y-[-1px]"
                >
                  Join as an Agent
                  <ArrowForward fontSize="small" />
                </a>
              </div>
            </div>

            <div className="grid content-center gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {topBenefits.map((item) => (
                <TopBenefit key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section id="why-us" className="w-full overflow-hidden bg-[linear-gradient(135deg,#153493_0%,#1444c4_52%,#1e88ff_100%)] text-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.25fr_1fr] lg:items-center lg:px-8 lg:py-10">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Why Partner With Us?</p>
              <h2 className="mt-3 max-w-md text-3xl font-black tracking-tight sm:text-[2.35rem]">
                Everything You Need, <span className="text-amber-300">All in One Place.</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-8 text-blue-100/80">
                We empower agents with the right technology, guidance, and opportunities to serve clients across the globe.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featureItems.map((item) => (
                <FeaturePill key={item.title} item={item} />
              ))}
            </div>

            <div className="relative min-h-[230px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              <div className="absolute left-6 top-7 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-50">
                <Public fontSize="inherit" />
                Global Reach
              </div>
              <div className="absolute inset-y-0 right-0 w-[88%] opacity-85">
                <Image src={HeroImage2} alt="Global partner support" className="h-full w-full object-cover object-right-bottom" />
              </div>
              <div className="absolute inset-x-6 bottom-4 text-sm text-blue-50/90">
                Trusted systems and responsive support for every client milestone.
              </div>
            </div>
          </div>
        </section>

        <section id="opportunities" className="w-full overflow-hidden bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.15fr_0.95fr] lg:items-center lg:px-8 lg:py-10">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Make A Difference</p>
              <h2 className="mt-3 max-w-sm text-3xl font-black tracking-tight text-[#152462] sm:text-[2.35rem]">
                Help People Build a Better Tomorrow
              </h2>
              <p className="mt-4 max-w-sm text-base leading-8 text-slate-600">
                Be the reason someone studies, works, and settles in their dream country.
              </p>
              <div className="mt-6">
                <a
                  href="#verification"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#ffc533] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_35px_rgba(251,191,36,0.28)] transition hover:translate-y-[-1px]"
                >
                  Start Your Journey
                  <ArrowForward fontSize="small" />
                </a>
              </div>
            </div>

            <div className="relative min-h-[315px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.7),_transparent_40%),linear-gradient(180deg,#eff6ff,#dbeafe)]">
              <div className="absolute inset-0 flex items-end justify-center">
                <Image src={HeroImage3} alt="Study work and settle abroad" className="h-full w-full object-cover object-center" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-[1.7rem] font-black tracking-tight text-[#152462]">Help Them Achieve Their Dreams</h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {journeyItems.map((item) => (
                  <OpportunityItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="verification" className="w-full overflow-hidden bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_58%,#d7ecff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.15fr_0.9fr] lg:items-center lg:px-8 lg:py-10">
            <div className="relative min-h-[260px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.8),_transparent_45%),linear-gradient(135deg,#60a5fa,#dbeafe)]">
              <div className="absolute inset-0 flex items-end justify-start">
                <Image src={HeroImage1} alt="Verified agent" className="h-full w-full object-cover object-left-bottom" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Ready To Get Started?</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#152462] sm:text-[2.35rem]">
                Become a Verified Agent Today
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                Join a growing community of trusted agents and unlock new opportunities with us.
              </p>
              <div className="mt-7 flex flex-wrap gap-6">
                {onboardingSteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.title} className="flex items-center gap-3">
                      <div className={`inline-flex rounded-full p-3 ${step.accent}`}>
                        <Icon fontSize="small" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(219,234,254,0.9))] px-6 py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-700 shadow-[0_12px_30px_rgba(59,130,246,0.18)]">
                <RocketLaunch />
              </div>
              <h3 className="mt-5 text-[1.8rem] font-black tracking-tight text-[#152462]">
                Your Success
                <br />
                Is Our Priority
              </h3>
              <a href="#agent-footer" className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-bold text-blue-700">
                Let&apos;s grow together
                <ArrowForward fontSize="small" />
              </a>
              <a
                href="#"
                className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-700"
              >
                <Login sx={{ fontSize: 18 }} />
                Login
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
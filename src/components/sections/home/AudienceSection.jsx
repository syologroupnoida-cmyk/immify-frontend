import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import styles from "./AudienceSection.module.css";

const audiences = [
  {
    id: "customers",
    label: "Plan your next chapter",
    title: "Immigrants / Customers",
    description: "Find the right guidance for your global journey.",
    image: "/images/home/immify-customers.webp",
    imageAlt: "A couple exploring their immigration plans with passports and a laptop at a consultation desk",
    steps: [
      "Submit your immigration requirements.",
      "Select your destination and visa category.",
      "Get matched with relevant agents.",
      "Receive calls, consultations and quotations.",
    ],
    href: "/providers",
    action: "Find the right expert",
  },
  {
    id: "agents",
    label: "Grow your agency",
    title: "Immigration Agents / Partners",
    description: "Connect your expertise with people ready to move.",
    image: "/images/home/immify-agents.webp",
    imageAlt: "An immigration consultant discussing paperwork with two clients in a bright office",
    steps: [
      "Register your agency.",
      "Select countries and visa categories.",
      "Receive relevant customer leads.",
      "Contact prospects and convert enquiries.",
    ],
    href: "/agent/sign-up",
    action: "Register your agency",
  },
  {
    id: "move-abroad",
    label: "Make your next move",
    title: "Planning to Move Abroad? Find the Right Immigration Agent.",
    description: "Connect with consultants who understand your destination and immigration requirements.",
    image: "/images/home/immify-move-abroad.webp",
    imageAlt: "International travellers arriving at an airport with a city skyline behind them",
    steps: [
      "Explore immigration consultants.",
      "Find destination-specific guidance.",
      "Discuss your visa requirements.",
      "Choose the right agent for your move.",
    ],
    href: "/providers",
    action: "Find an immigration agent",
  },
  {
    id: "study-abroad",
    label: "Build your future abroad",
    title: "Planning to Study Abroad?",
    description: "Explore international education and find support for your next academic chapter.",
    image: "/images/home/home-hero-study.png",
    imageAlt: "International education and study abroad opportunities",
    steps: [
      "Explore universities worldwide.",
      "Compare courses and destinations.",
      "Find admission guidance.",
      "Get help with your student visa.",
    ],
    href: "/marketplace/universities",
    action: "Explore universities",
  },
];

function AudienceCard({ audience }) {
  const [flipped, setFlipped] = useState(false);
  const frontButton = useRef(null);
  const backButton = useRef(null);

  const turnCard = (showBack) => {
    setFlipped(showBack);
    window.requestAnimationFrame(() => (showBack ? backButton : frontButton).current?.focus({ preventScroll: true }));
  };

  return (
    <article
      aria-label={audience.title}
      className={styles.card}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) setFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) setFlipped(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFlipped(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && flipped) {
          event.preventDefault();
          turnCard(false);
        }
      }}
    >
      <div className={`${styles.inner} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.front} aria-hidden={flipped} inert={flipped}>
          <div className="relative h-40 overflow-hidden rounded-t-2xl bg-blue-50">
            <Image src={audience.image} alt={audience.imageAlt} fill sizes="(min-width: 1280px) 292px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{audience.label}</p>
            <h3 className="mt-1.5 text-sm font-bold leading-5 text-slate-900">{audience.title}</h3>
            <p className="mb-4 mt-1 text-sm leading-5 text-slate-600">{audience.description}</p>
            <button ref={frontButton} type="button" onClick={() => turnCard(true)} aria-expanded={flipped} aria-controls={`audience-details-${audience.id}`} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700">
              View key points <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
        <div id={`audience-details-${audience.id}`} className={styles.back} aria-hidden={!flipped} inert={!flipped}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{audience.label}</p>
            <button ref={backButton} type="button" onClick={() => turnCard(false)} aria-label={`Show front of ${audience.title} card`} className="-mt-2 inline-flex min-h-11 shrink-0 items-center rounded-lg px-2 text-xs font-semibold text-blue-900 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-700">Back</button>
          </div>
          <h3 className="mt-1 text-sm font-bold leading-5">{audience.title}</h3>
          <ul className="my-5 space-y-3">
            {audience.steps.map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm leading-5 text-blue-950">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"><CheckRoundedIcon aria-hidden="true" sx={{ fontSize: 14 }} /></span>
                {step}
              </li>
            ))}
          </ul>
          <Link href={audience.href} className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#1f2a77] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
            {audience.action}<ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AudienceSection() {
  return (
    <section aria-labelledby="immify-audiences" className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">The Immify connection</p>
          <h2 id="immify-audiences" className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            One platform. <span className="text-blue-700">Two user groups.</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bringing people with global ambitions and immigration professionals together, in one place.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => (
            <AudienceCard key={audience.id} audience={audience} />
          ))}
        </div>
      </div>
    </section>
  );
}

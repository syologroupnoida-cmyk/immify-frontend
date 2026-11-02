import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PageSeo from "@/components/common/PageSeo";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";
import { premiumServiceItems } from "../home/homeData";
import styles from "./PremiumServiceDetail.module.css";

const preparation = {
  "work-visa": {
    audience: "For professionals planning their next career move overseas.",
    overview: "Explore support with your work visa profile, employer documents and application preparation. Discuss your role, destination and career goals with a provider to understand the next steps.",
    items: ["Your preferred destination and type of work", "An up-to-date CV and qualifications", "Any job offer or employer correspondence"],
    related: ["permanent-residency", "canada-immigration", "consultation"],
  },
  "study-visa": {
    audience: "For students preparing for an education abroad.",
    overview: "Bring your study plans into focus with support for course selection, application documents and visa preparation. Discuss your academic background, budget and preferred intake with a provider.",
    items: ["Preferred courses, destinations and intake", "Academic records and language test results, if available", "Any admission offers and your study budget"],
    related: ["work-visa", "visitor-visa", "consultation"],
  },
  "family-sponsorship": {
    audience: "For families exploring a future together in a new country.",
    overview: "Understand the support available for family sponsorship planning, relationship documents and application preparation. Share your family's circumstances so a provider can explain the scope relevant to your enquiry.",
    items: ["Your destination and family relationship", "Your sponsor's current residency status", "A summary of available relationship records"],
    related: ["visitor-visa", "permanent-residency", "consultation"],
  },
  "permanent-residency": {
    audience: "For people exploring a longer-term move overseas.",
    overview: "Compare support for residency pathway planning, profile preparation and application documents. Discuss your background and long-term goals to understand which services may be relevant to your plans.",
    items: ["Your preferred destination and relocation goals", "Your education and employment history", "Language test results and any existing profile"],
    related: ["canada-immigration", "work-visa", "citizenship-services"],
  },
  "visitor-visa": {
    audience: "For travellers planning a visit, holiday or time with family.",
    overview: "Prepare for your next visit with support for travel-purpose documents, itineraries and application records. Discuss your destination, timing and reason for travel to agree on the help you need.",
    items: ["Your destination, travel dates and purpose", "An outline of your itinerary or invitation", "A summary of your travel and financial records"],
    related: ["family-sponsorship", "study-visa", "consultation"],
  },
  "canada-immigration": {
    audience: "For individuals and families considering a move to Canada.",
    overview: "Explore Canada-focused support for pathway comparisons, profile preparation and application planning. Discuss your experience, qualifications and goals with a provider to understand the available service options.",
    items: ["Your education and skilled work experience", "Language test results, if available", "Any existing immigration profile or provincial connection"],
    related: ["permanent-residency", "work-visa", "family-sponsorship"],
  },
  "citizenship-services": {
    audience: "For residents preparing for the next stage of their journey.",
    overview: "Find support for organising residency records, reviewing your document checklist and preparing an application. Share your residency history with a provider to discuss the service scope for your circumstances.",
    items: ["Your current nationality and residency status", "A timeline of residency and travel", "Details of any previous application or correspondence"],
    related: ["permanent-residency", "family-sponsorship", "consultation"],
  },
  consultation: {
    audience: "For anyone who wants a clearer starting point.",
    overview: "Make space to discuss your goals, compare your options and ask practical questions. A consultation helps you identify what to prepare and agree on the next steps with a service provider.",
    items: ["Your goals and preferred destinations", "A short summary of your background", "Your main questions, budget and timeline"],
    related: ["work-visa", "study-visa", "permanent-residency"],
  },
};

const steps = [
  { title: "Share your plans", description: "Tell us your destination, goals and the kind of support you are looking for." },
  { title: "Discuss your options", description: "Ask a provider about the service scope, documents, fees and expected timing." },
  { title: "Plan your next step", description: "Review the written proposal and agree on how you would like to proceed." },
];

export default function PremiumServiceDetail({ service }) {
  const details = preparation[service.slug];
  const relatedServices = details.related.map((slug) => premiumServiceItems.find((item) => item.slug === slug));

  return (
    <main className={styles.page}>
      <PageSeo title={`${service.title} Support | Immify Premium Services`} description={details.overview} />
      <header className={styles.hero}>
        <div className={styles.heroBreadcrumb}>
          <nav aria-label="Breadcrumb" className={`${styles.container} ${styles.breadcrumb}`}>
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/premium-services">Premium services</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{service.title}</span>
          </nav>
        </div>
        <div className={styles.heroImage}>
          <Image src="/images/premium-services/consultation-banner.webp" alt="A couple discussing their overseas plans with an adviser in a modern office" fill preload sizes="100vw" className={styles.image} />
        </div>
        <div className={`${styles.container} ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <p className={styles.heroLabel}><WorkspacePremiumOutlinedIcon aria-hidden="true" sx={{ fontSize: 18 }} /> Premium immigration services</p>
            <h1>{service.title}</h1>
            <p className={styles.heroDescription}>{service.description}</p>
            <LeadGenerationButton label="Discuss your plans" variant="light" className="mt-6 min-h-12 rounded-xl" />
            <p className={styles.heroNote}>Personal goals. Practical guidance. A clearer next step.</p>
          </div>
        </div>
      </header>
      <div className={styles.sectionNav}>
        <nav aria-label="On this page" className={styles.container}>
          <a href="#service-overview">Overview</a><a href="#service-support">Support available</a><a href="#service-process">How it works</a><a href="#service-preparation">What to prepare</a>
        </nav>
      </div>
      <div className={`${styles.container} ${styles.body}`}>
        <div className={styles.columns}>
          <div className={styles.content}>
            <section id="service-overview" aria-labelledby="overview-heading" className={styles.overview}>
              <p className={styles.eyebrow}>A plan built around you</p>
              <h2 id="overview-heading">Your next chapter starts with a clear plan.</h2>
              <p>{details.overview}</p>
              <div className={styles.audience}><span className={styles.audienceLine} aria-hidden="true" /><p>{details.audience}</p></div>
            </section>
            <section id="service-support" aria-labelledby="support-heading" className={styles.panel}>
              <p className={styles.eyebrow}>Support available</p>
              <h2 id="support-heading">Help where it matters</h2>
              <p className={styles.muted}>Explore these areas with your provider and agree on the support that suits your plans.</p>
              <ul className={styles.benefits}>{service.benefits.map((benefit) => <li key={benefit}><span className={styles.check}><CheckRoundedIcon aria-hidden="true" sx={{ fontSize: 19 }} /></span><span>{benefit}</span></li>)}</ul>
            </section>
            <section id="service-process" aria-labelledby="process-heading" className={styles.process}>
              <p className={styles.eyebrow}>From an idea to a next step</p>
              <h2 id="process-heading">A straightforward way to get started</h2>
              <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span className={styles.stepNumber}>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
            </section>
            <section id="service-preparation" aria-labelledby="preparation-heading" className={`${styles.panel} ${styles.preparation}`}>
              <span className={styles.documentIcon}><DescriptionOutlinedIcon aria-hidden="true" /></span>
              <div>
                <p className={styles.eyebrow}>Make your first conversation count</p><h2 id="preparation-heading">A few things to have ready</h2>
                <ul>{details.items.map((item) => <li key={item}><CheckRoundedIcon aria-hidden="true" sx={{ fontSize: 17 }} /><span>{item}</span></li>)}</ul>
                <p className={styles.preparationNote}>A starting point for your discussion. Your provider can confirm the documents needed for your circumstances.</p>
              </div>
            </section>
          </div>
          <aside className={styles.sidebar} aria-label="Enquire about this service">
            <div className={styles.enquiry}>
              <div className={styles.enquiryTop}><WorkspacePremiumOutlinedIcon aria-hidden="true" sx={{ fontSize: 23 }} /><span>Your next move</span></div>
              <h2>Let’s talk about your plans.</h2>
              <p>Looking for {service.title.toLowerCase()} support? Share a little about your goals to start a service enquiry.</p>
              <LeadGenerationButton label="Request a service quote" variant="light" className="min-h-12 w-full rounded-xl" />
              <Link href="/marketplace/vendors" className={styles.providerLink}>Explore service providers <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 17 }} /></Link>
              <div className={styles.enquiryFooter}>Discuss the scope, fees and availability with your provider before you proceed.</div>
            </div>
            <div className={styles.questions}>
              <h3>Good questions to ask</h3>
              <ul><li>What is included in the service?</li><li>Who will handle my enquiry?</li><li>What are the fees and next steps?</li></ul>
              <Link href="/contact">Need a hand? Contact us <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 16 }} /></Link>
            </div>
          </aside>
        </div>
        <section aria-labelledby="related-heading" className={styles.related}>
          <div className={styles.relatedHeading}><div><p className={styles.eyebrow}>Explore a little further</p><h2 id="related-heading">Other ways we can help</h2></div><Link href="/premium-services">View all services <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /></Link></div>
          <div className={styles.relatedGrid}>{relatedServices.map((item) => <Link key={item.slug} href={`/premium-services/${item.slug}`} className={styles.relatedCard}><h3>{item.title}</h3><p>{item.description}</p><span>Explore service <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /></span></Link>)}</div>
        </section>
      </div>
    </main>
  );
}

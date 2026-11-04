import Image from "next/image";
import Link from "next/link";
import {
  ArrowForwardRounded, CheckRounded, DescriptionOutlined, GroupsOutlined,
  HandshakeOutlined, HeadsetMicOutlined, LayersOutlined, PersonAddAltOutlined,
  FlightTakeoffRounded, PlayCircleFilledRounded, PublicOutlined, SchoolOutlined, ShieldOutlined,
  TrackChangesRounded, TrendingUpRounded, WorkspacePremiumOutlined,
} from "@mui/icons-material";
import styles from "./PartnerHome.module.css";

const benefits = [
  { title: "Connect with More Clients", description: "Make your expertise discoverable to people planning their next move.", icon: TrackChangesRounded, tone: "blue" },
  { title: "List & Manage Easily", description: "Bring your business profile, services and enquiries together.", icon: LayersOutlined, tone: "orange" },
  { title: "Grow Your Business", description: "Reach new audiences across immigration and education services.", icon: TrendingUpRounded, tone: "green" },
  { title: "Partner Support", description: "Find guidance for getting started and making the most of Immify.", icon: HeadsetMicOutlined, tone: "peach" },
];

const steps = [
  { title: "Create Your Partner Account", description: "Register your business and complete your profile.", icon: PersonAddAltOutlined },
  { title: "Showcase Your Services", description: "Add your service details, destinations and areas of expertise.", icon: DescriptionOutlined },
  { title: "Connect & Grow", description: "Manage enquiries and start conversations with prospective clients.", icon: GroupsOutlined },
];

const partnerTypes = [
  { title: "Immigration Consultants", description: "Visa, migration and relocation specialists.", image: "/images/home/immify-agents.webp", alt: "An immigration consultant meeting with clients", icon: WorkspacePremiumOutlined },
  { title: "Education Agencies", description: "Study abroad and admissions advisors.", image: "/images/home/immify-customers.webp", alt: "Clients discussing their international plans", icon: GroupsOutlined },
  { title: "Universities & Institutions", description: "Bring your education offering to new audiences.", image: "/images/partner/partner-institutions.webp", alt: "A contemporary international university campus", icon: SchoolOutlined },
  { title: "Referral Partners", description: "Build connections and expand your network.", image: "/images/partner/partner-hero.webp", alt: "A professional advisor representing the Immify partner network", icon: HandshakeOutlined },
];

const platformFeatures = [
  { title: "Business Profile", description: "Showcase your expertise", icon: GroupsOutlined },
  { title: "Service Listings", description: "Present what you offer", icon: LayersOutlined },
  { title: "Client Enquiries", description: "Build new connections", icon: PublicOutlined },
  { title: "Partner Support", description: "Find your next step", icon: HeadsetMicOutlined },
];

function SectionHeading({ id, eyebrow, children, description }) {
  return <div className={styles.sectionHeading}><p className={styles.eyebrow}>{eyebrow}</p><h2 id={id}>{children}</h2><p>{description}</p></div>;
}

export default function PartnerHome() {
  return (
    <main id="partner-home" className={styles.page}>
      <section aria-labelledby="partner-hero-title" className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.programBadge}><HandshakeOutlined aria-hidden="true" /> Immify Partner Program</p>
            <h1 id="partner-hero-title">Grow Your Immigration Business with <span>Immify</span></h1>
            <p className={styles.heroDescription}>Showcase your services, connect with prospective clients, and manage enquiries — all in one partner workspace.</p>
            <ul className={styles.heroHighlights}>
              {[
                { title: "New Connections", description: "People with global plans", icon: TrendingUpRounded },
                { title: "Easy Management", description: "Profiles, services & enquiries", icon: LayersOutlined },
                { title: "One Platform", description: "Your partner workspace", icon: ShieldOutlined },
              ].map(({ title, description, icon: Icon }) => <li key={title}><Icon aria-hidden="true" /><div><strong>{title}</strong><span>{description}</span></div></li>)}
            </ul>
            <div className={styles.heroActions}>
              <Link href="/partner/sign-up" className={styles.primaryButton}>Become a Partner <ArrowForwardRounded aria-hidden="true" /></Link>
              <a href="#how-it-works" className={styles.secondaryButton}><PlayCircleFilledRounded aria-hidden="true" /> How It Works</a>
            </div>
            <p className={styles.accountHint}>Already a partner? <Link href="/partner/login">Sign in to your account</Link></p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.flightAccent} aria-hidden="true"><FlightTakeoffRounded /></div>
            <div className={styles.heroPhoto}><Image src="/images/partner/partner-hero.webp" alt="A professional advisor at an international campus" fill preload sizes="(min-width: 761px) 50vw, 100vw" className={styles.heroImage} /></div>
            <div className={styles.benefitsPanel}>
              <h2>Partner Benefits</h2>
              <ul>{["Showcase Your Services", "Build Your Business Profile", "Manage Client Enquiries", "Grow Your Network", "Dedicated Partner Support"].map((item) => <li key={item}><span><CheckRounded aria-hidden="true" /></span>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.stripContainer}>
        <ul aria-label="Your partner workspace" className={styles.featureStrip}>{platformFeatures.map(({ title, description, icon: Icon }) => <li key={title}><Icon aria-hidden="true" /><div><strong>{title}</strong><span>{description}</span></div></li>)}</ul>
      </div>

      <section id="why-partner" aria-labelledby="why-partner-title" className={styles.section}>
        <div className={styles.container}>
          <SectionHeading id="why-partner-title" eyebrow="Built for your growth" description="Practical tools to showcase your expertise and build your next client connection.">Why partner with <span>Immify?</span></SectionHeading>
          <div className={styles.benefitGrid}>{benefits.map(({ title, description, icon: Icon, tone }) => <article key={title} className={`${styles.benefitCard} ${styles[tone]}`}><span className={styles.benefitIcon}><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="partner-process-title" className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.container}>
          <SectionHeading id="partner-process-title" eyebrow="A simple start" description="Set up your presence, share what you offer, and start meaningful conversations.">From expertise to opportunity</SectionHeading>
          <ol className={styles.steps}>{steps.map(({ title, description, icon: Icon }, index) => <li key={title}><div className={styles.stepTop}><span className={styles.stepIcon}><Icon aria-hidden="true" /></span><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span></div><h3>{title}</h3><p>{description}</p></li>)}</ol>
        </div>
      </section>

      <section id="partner-types" aria-labelledby="partner-types-title" className={styles.section}>
        <div className={styles.container}>
          <SectionHeading id="partner-types-title" eyebrow="Find your place" description="For professionals and organisations helping people build a future across borders.">One network. Different expertise.</SectionHeading>
          <div className={styles.partnerGrid}>{partnerTypes.map(({ title, description, image, alt }) => <Link key={title} href="/partner/sign-up" className={styles.partnerCard}><div className={styles.partnerImage}><Image src={image} alt={alt} fill sizes="(max-width: 559px) 64px, 80px" className={styles.coverImage} /></div><div className={styles.partnerCardCopy}><h3>{title}</h3><p>{description}</p><span className={styles.cardAction}>Join the network <ArrowForwardRounded aria-hidden="true" /></span></div></Link>)}</div>
        </div>
      </section>

      <section aria-labelledby="partner-join-title" className={styles.joinSection}>
        <div className={styles.joinBanner}>
          <div className={styles.joinCopy}><p className={styles.eyebrow}>Your next opportunity</p><h2 id="partner-join-title">Let’s grow your business, together.</h2><p>Bring your expertise to people planning their future across borders.</p></div>
          <div className={styles.joinActions}><Link href="/partner/sign-up" className={styles.orangeButton}>Become a Partner <ArrowForwardRounded aria-hidden="true" /></Link><Link href="/contact" className={styles.contactLink}>Have a question? Talk to us</Link></div>
        </div>
      </section>
    </main>
  );
}

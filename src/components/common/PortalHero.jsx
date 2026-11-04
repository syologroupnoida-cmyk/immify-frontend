import Image from "next/image";
import Link from "next/link";
import styles from "./CompactPortalHero.module.css";

const imagePositions = {
  "about.webp": "50% 35%",
  "faq.webp": "50% 40%",
  "free-eligibility-check.webp": "50% 30%",
  "legal.webp": "50% 23%",
  "news.webp": "50% 30%",
  "pricing.webp": "50% 15%",
  "services.webp": "50% 30%",
  "providers.webp": "50% 40%",
};

export default function PortalHero({ heading, label, imageSrc, imageAlt = "", description, children }) {
  return (
    <header className={`${styles.hero} ${children ? styles.withSearch : ""}`} data-portal-hero>
      <div className={styles.heading}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>
        <h1 className={styles.title}>{heading}</h1>
        {description && <p className={styles.description}>{description}</p>}
        <span aria-hidden="true" className={styles.accent} />
      </div>
      {children ? <div className={styles.searchPanel}>{children}</div> : <div className={styles.imagePanel}>
        <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 768px) 220px, 1px" className={styles.image} style={{ objectPosition: imagePositions[imageSrc.split("/").pop()] || "center" }} />
      </div>}
    </header>
  );
}

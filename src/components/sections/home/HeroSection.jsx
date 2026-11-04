import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  ArrowForwardRounded, SchoolOutlined, WorkOutlineRounded,
  PublicOutlined, GridViewRounded, LocationOnOutlined,
  SearchRounded, GroupsOutlined, CottageOutlined, KeyboardArrowDownRounded,
} from "@mui/icons-material";
import { serviceListingCategories } from "@/util/serviceListings";
import { categoryKey } from "@/util/marketplaceFilters.mjs";
import LocationPicker from "@/components/common/LocationPicker";
import { getLocationSearchTerm, LOCATION_CHANGED_EVENT, readSavedLocation } from "@/util/locations";
import styles from "./HeroSection.module.css";

const selectSx = {
  width: "100%",
  color: "#132b55",
  fontFamily: "inherit",
  fontSize: 14,
  "& .MuiSelect-select": { padding: "3px 30px 3px 0", minHeight: "21px", borderRadius: "4px" },
  "& .MuiSelect-select:focus": { backgroundColor: "transparent", outline: "none" },
  "& .MuiSelect-select:focus-visible": { backgroundColor: "#eef4ff" },
  "& .MuiSelect-icon": { right: 0, color: "#132b55", fontSize: 21 },
};

const selectMenuProps = {
  disableScrollLock: true,
  slotProps: {
    paper: {
      sx: {
        mt: 1,
        maxHeight: 320,
        maxWidth: "calc(100vw - 32px)",
        borderRadius: "12px",
        border: "1px solid #e3eaf4",
        boxShadow: "0 12px 32px #153b6b1a",
        "& .MuiMenuItem-root": { fontFamily: "inherit", fontSize: 14, minHeight: 40, whiteSpace: "normal" },
        "& .MuiMenuItem-root.Mui-selected": { backgroundColor: "#eef4ff", color: "#0645ee" },
      },
    },
  },
};

const shortcuts = [
  { label: "Visa Services", href: "/marketplace?category=visa-services", icon: PublicOutlined },
  { label: "Study Abroad", href: "/marketplace?category=study-abroad-services", icon: SchoolOutlined },
  { label: "Immigration", href: "/marketplace?category=immigration-services", icon: GroupsOutlined },
  { label: "Overseas Jobs", href: "/marketplace?category=visa-services&service=work-visa", icon: WorkOutlineRounded },
  { label: "Relocation", href: "/marketplace?category=family-relocation-services", icon: CottageOutlined },
];

function WorldMap() {
  return (
    <svg className={styles.map} viewBox="0 0 600 300" aria-hidden="true">
      <defs>
        <pattern id="home-world-dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="currentColor" /></pattern>
      </defs>
      <g fill="url(#home-world-dots)">
        <path d="M35 65 65 40 120 30 165 45 183 68 163 85 157 107 133 116 118 143 94 140 78 116 60 107 45 82ZM121 146 151 151 176 178 176 200 163 224 152 248 140 267 127 241 129 213 113 185ZM176 29 205 18 223 32 211 56 188 65Z" />
        <path d="M259 63 280 46 309 43 325 58 351 51 380 40 434 39 461 49 503 55 540 78 550 99 526 113 494 105 473 120 448 118 434 144 409 137 388 108 365 98 340 108 327 89 300 87 278 97 257 87Z" />
        <path d="M272 101 303 97 332 111 343 138 331 165 319 184 305 205 287 192 278 168 263 150 258 126ZM445 142 465 153 473 178 492 180 500 195 480 195 463 181 448 169ZM491 216 526 208 552 225 548 248 518 252 490 239ZM339 202 346 193 350 215 343 226Z" />
      </g>
    </svg>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [destination, setDestination] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const sync = event => setDestination(typeof event?.detail === "string" ? event.detail : readSavedLocation());
    queueMicrotask(sync);
    window.addEventListener(LOCATION_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(LOCATION_CHANGED_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);


  const handleSearch = async (event) => {
    event.preventDefault();
    setSearching(true);
    try {
      const query = {};
      if (service) query.category = categoryKey(service);
      if (destination.trim()) query.location = getLocationSearchTerm(destination);
      await router.push({ pathname: "/marketplace", query });
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.stage}>
        <WorldMap />
        <div className={styles.photo}>
          <Image src="/images/home/home-hero-airport-v2.webp" alt="Three young travellers preparing for their next journey at an international airport" fill preload sizes="(min-width: 1024px) 56vw, 100vw" className={styles.airportImage} />
        </div>
        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Your global journey starts here</p>
            <h1 id="home-hero-title" className={styles.title}>Your Next Chapter<br />Starts <span>Beyond Borders</span></h1>
            <p className={styles.description}>Discover visa services, study abroad opportunities and immigration providers, all in one place.</p>
            <div className={styles.actions}>
              <Link href="/marketplace" className={styles.primary}>Explore Services <ArrowForwardRounded aria-hidden="true" /></Link>
              <Link href="/providers" className={styles.secondary}><GroupsOutlined aria-hidden="true" /> Find Consultants</Link>
            </div>
          </div>
        </div>
        <Link href="/providers" className={`${styles.floatBadge} ${styles.studyBadge}`}><span><SchoolOutlined aria-hidden="true" /></span>Study Abroad</Link>
        <Link href="/providers" className={`${styles.floatBadge} ${styles.visaBadge}`}><span><PublicOutlined aria-hidden="true" /></span>Visa Assistance</Link>
        <Link href="/jobs" className={`${styles.floatBadge} ${styles.careerBadge}`}><span><WorkOutlineRounded aria-hidden="true" /></span>Global Careers</Link>
      </div>

      <div className={styles.bottom}>
        <form onSubmit={handleSearch} className={styles.search} aria-label="Find global mobility services">
          <div className={styles.field}>
            <span className={styles.fieldIcon}><GridViewRounded aria-hidden="true" /></span>
            <div className={styles.selectGroup}>
              <label id="hero-service-label" htmlFor="hero-service">Service</label>
              <Select id="hero-service" labelId="hero-service-label" name="service" value={service} onChange={(event) => setService(event.target.value)} required variant="standard" disableUnderline displayEmpty renderValue={(value) => value || "Select a service"} IconComponent={KeyboardArrowDownRounded} MenuProps={selectMenuProps} sx={selectSx}>
                <MenuItem value="" disabled>Select a service</MenuItem>
                {serviceListingCategories.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
              </Select>
            </div>
          </div>
          <div className={`${styles.field} ${styles.destinationField}`}>
            <span className={styles.fieldIcon}><LocationOnOutlined aria-hidden="true" /></span>
            <div className={styles.selectGroup}>
              <label id="hero-destination-label" htmlFor="hero-destination">Destination</label>
              <LocationPicker value={destination} onChange={setDestination} />
            </div>
          </div>
          <button type="submit" className={styles.searchButton} disabled={searching}><SearchRounded aria-hidden="true" />{searching ? "Searching..." : "Search Services"}</button>
        </form>
        <nav aria-label="Popular service categories" className={styles.shortcuts}>
          {shortcuts.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={styles.shortcut}><span className={styles.shortcutIcon}><Icon aria-hidden="true" /></span><span>{label}</span><ArrowForwardRounded className={styles.shortcutArrow} aria-hidden="true" /></Link>)}
        </nav>
      </div>
    </section>
  );
}

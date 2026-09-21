import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, Autocomplete, Box, Button, CircularProgress, Dialog, Slide, TextField } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MainApi from "@/util/MainApi";
import { universities } from "./universityData";
import universityFallbackCampus from "@/images/university-fallback-campus.png";

const GEO_API = "https://countriesnow.space/api/v0.1/countries";
const emptyEnquiry = { firstName: "", lastName: "", email: "", phone: "", country: "", state: "", city: "", message: "" };

async function getGeoData(path, payload, signal) {
  async function read(response) {
    if (!response.ok) throw new Error("Location lookup failed");
    const result = await response.json();
    if (result.error) throw new Error(result.msg || "Location lookup failed");
    return result.data;
  }
  if (!payload) return read(await fetch(`${GEO_API}${path}`, { signal }));
  try {
    return await read(await fetch(`${GEO_API}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal,
    }));
  } catch (error) {
    if (signal.aborted) throw error;
    return read(await fetch(`${GEO_API}${path}/q?${new URLSearchParams(payload)}`, { signal }));
  }
}

function LocationField({ label, value, options, loading, error, onChange }) {
  return <Autocomplete freeSolo options={options} inputValue={value} loading={loading} openOnFocus autoHighlight
    filterOptions={(available, { inputValue }) => available.filter((option) => option.toLowerCase().includes(inputValue.trim().toLowerCase())).slice(0, 12)}
    onInputChange={(_, nextValue, reason) => { if (reason === "input" || reason === "clear") onChange(nextValue); }}
    onChange={(_, selected) => onChange(selected || "")}
    noOptionsText={error || "No matching location found"}
    renderInput={(params) => <TextField {...params} label={label} required size="small" fullWidth error={Boolean(error)} helperText={error} />}
  />;
}

export default function UniversityDetailSection() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const university = universities.find((item) => item.slug === slug);
  const [open, setOpen] = useState(false);
  const [enquiry, setEnquiry] = useState(emptyEnquiry);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [geoLoading, setGeoLoading] = useState({ country: false, state: false, city: false });
  const [geoError, setGeoError] = useState({});

  useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => setGeoLoading((current) => ({ ...current, country: true })));
    getGeoData("/iso", null, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setCountries(data.map((item) => item.name).filter(Boolean)); })
      .catch(() => { if (!controller.signal.aborted) setGeoError((current) => ({ ...current, country: "Country suggestions unavailable." })); })
      .finally(() => { if (!controller.signal.aborted) setGeoLoading((current) => ({ ...current, country: false })); });
    return () => controller.abort();
  }, [open]);

  const selectedCountry = countries.find((name) => name.toLowerCase() === enquiry.country.trim().toLowerCase());
  const selectedState = states.find((name) => name.toLowerCase() === enquiry.state.trim().toLowerCase());

  useEffect(() => {
    if (!selectedCountry) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => setGeoLoading((current) => ({ ...current, state: true })));
    getGeoData("/states", { country: selectedCountry }, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setStates((data.states || []).map((item) => item.name).filter(Boolean)); })
      .catch(() => { if (!controller.signal.aborted) setGeoError((current) => ({ ...current, state: "State suggestions unavailable." })); })
      .finally(() => { if (!controller.signal.aborted) setGeoLoading((current) => ({ ...current, state: false })); });
    return () => controller.abort();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => setGeoLoading((current) => ({ ...current, city: true })));
    getGeoData("/state/cities", { country: selectedCountry, state: selectedState }, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setCities(Array.isArray(data) ? data.filter(Boolean) : []); })
      .catch(() => { if (!controller.signal.aborted) setGeoError((current) => ({ ...current, city: "City suggestions unavailable." })); })
      .finally(() => { if (!controller.signal.aborted) setGeoLoading((current) => ({ ...current, city: false })); });
    return () => controller.abort();
  }, [selectedCountry, selectedState]);

  const update = (field) => (event) => setEnquiry((current) => ({ ...current, [field]: event.target.value }));
  const close = () => { if (!submitting) setOpen(false); };
  const showForm = () => { setFeedback(null); setOpen(true); };
  const submit = async (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(enquiry.phone)) {
      setFeedback({ type: "error", message: "Enter a valid 10-digit phone number." });
      return;
    }
    setFeedback(null);
    setSubmitting(true);
    try {
      const message = enquiry.message.trim() || `I would like to know more about ${university.name}.`;
      const servicesRequired = ["University admission"];
      const destinationCountries = [university.country];
      const response = await MainApi.post("/leads", {
        firstName: enquiry.firstName.trim(), lastName: enquiry.lastName.trim(), email: enquiry.email.trim(), phone: enquiry.phone.trim(),
        country: enquiry.country.trim(), state: enquiry.state.trim(), city: enquiry.city.trim(),
        message,
        metadata: { source: "university-detail", university: university.name, universitySlug: university.slug, servicesRequired, destinationCountries },
      }, { skipAuth: true, suppressAuthRedirect: true });
      if (response?.data?.success === false) throw new Error(response.data.message || "Unable to send enquiry.");
      setEnquiry(emptyEnquiry);
      setFeedback({ type: "success", message: response?.data?.message || "Your enquiry has been sent. Our team will contact you soon." });
    } catch (error) {
      setFeedback({ type: "error", message: error?.response?.data?.message || error.message || "Unable to send enquiry. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!university) return <main className="min-h-screen bg-[#f7f9fc] px-4 py-28 text-center"><h1 className="text-2xl font-bold text-slate-900">University not found</h1><Link href="/marketplace/universities" className="mt-5 inline-block text-sm font-semibold text-blue-700">Back to Universities</Link></main>;

  const facts = [
    ["University", university.name], ["Location", `${university.city}, ${university.country}`],
    ["Institution type", university.type], ["Featured course", university.course],
    ["Degree level", university.level], ["Estimated annual tuition", university.tuitionLabel],
    ["Next intake", university.intake], ["Typical duration", university.duration], ["Scholarship", university.scholarship],
  ];
  const sections = [["overview", "Overview"], ["courses", "Courses"], ["eligibility", "Eligibility"], ["fees", "Fees & funding"], ["admission", "Admission"]];

  return <main className="min-h-screen bg-white pb-16 pt-24 text-slate-800 sm:pt-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500"><Link href="/marketplace/universities" className="inline-flex items-center gap-1 text-blue-700 hover:underline"><ArrowBackRoundedIcon sx={{ fontSize: 16 }} /> Universities</Link><span>/</span><span>{university.country}</span><span>/</span><span className="text-slate-800">{university.name}</span></div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <header className="pb-4"><p className="mb-1 text-xs font-semibold uppercase text-teal-700">Study in {university.country}</p><h1 className="font-serif text-2xl font-bold leading-snug text-teal-800 sm:text-[30px]">{university.name}: Courses, Fees & Admission</h1></header>
          <div className="relative h-[220px] overflow-hidden rounded-md bg-slate-100 sm:h-[310px] lg:h-[340px]"><UniversityImage key={university.slug} university={university} /></div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">{university.summary} Explore courses, indicative costs, eligibility and the steps to apply. Details on this page are illustrative and should be confirmed before making an application.</p>
          <nav aria-label="University sections" className="sticky top-16 z-10 mt-6 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white py-2">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="shrink-0 rounded px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-700">{label}</a>)}</nav>
          <section id="overview" className="scroll-mt-36 py-8">
            <h2 className="text-2xl font-bold text-slate-950">University overview</h2>
            <p className="mt-4 leading-7 text-slate-600">{university.summary} Compare course options, costs and admission requirements before choosing a pathway.</p>
            <h3 className="mt-8 text-lg font-bold text-slate-900">At a glance</h3>
            <div className="mt-4 overflow-hidden rounded border border-slate-200 bg-white">{facts.map(([label, value], index) => <div key={label} className={`grid grid-cols-[minmax(120px,34%)_1fr] gap-4 px-4 py-3 text-sm ${index !== facts.length - 1 ? "border-b border-slate-100" : ""}`}><span className="font-semibold text-slate-700">{label}</span><span className="text-slate-600">{value}</span></div>)}</div>
          </section>
          <section id="courses" className="scroll-mt-36 border-t border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-950">Courses & study options</h2><p className="mt-3 leading-7 text-slate-600">{university.course} is the featured program. Other study areas are shown for exploration; confirm specific degrees and availability with the university.</p>
            <div className="mt-5 flex flex-wrap gap-2">{[university.course, ...university.courses.filter((course) => course !== university.course).slice(0, 9)].map((course) => <span key={course} className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{course}</span>)}</div>
          </section>
          <section id="eligibility" className="scroll-mt-36 border-t border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-950">Eligibility & documents</h2><p className="mt-3 text-sm text-slate-500">Typical requirements; exact criteria depend on the program.</p>
            <ul className="mt-5 space-y-3">{["Academic transcripts and proof of previous qualifications", "Valid passport or identity document", "English language evidence, where required", "Statement of purpose and supporting documents"].map((item) => <li key={item} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircleOutlineRoundedIcon className="mt-0.5 text-teal-600" fontSize="small" />{item}</li>)}</ul>
          </section>
          <section id="fees" className="scroll-mt-36 border-t border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-950">Fees & funding</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="border-l-4 border-blue-700 bg-white p-5"><p className="text-sm text-slate-500">Indicative annual tuition</p><p className="mt-2 text-xl font-bold text-slate-900">{university.tuitionLabel}</p></div><div className="border-l-4 border-teal-600 bg-white p-5"><p className="text-sm text-slate-500">Scholarship</p><p className="mt-2 text-xl font-bold text-slate-900">{university.scholarship}</p></div></div>
            <p className="mt-4 text-sm text-slate-500">Figures are sample estimates, not a fee quote. Request current tuition and scholarship terms before applying.</p>
          </section>
          <section id="admission" className="scroll-mt-36 border-t border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-950">How to apply</h2>
            <ol className="mt-5 grid gap-4 sm:grid-cols-3">{[["01", "Choose a course", "Review the program and entry requirements."], ["02", "Prepare documents", "Gather transcripts, identity and language evidence."], ["03", "Send an enquiry", "Share your details to discuss the next steps."]].map(([number, title, detail]) => <li key={number} className="border-t-2 border-blue-700 pt-4"><span className="text-sm font-bold text-blue-700">{number}</span><h3 className="mt-2 font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p></li>)}</ol>
            <button type="button" onClick={showForm} className="mt-7 rounded bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800">Apply Now</button>
          </section>
        </div>
        <aside><div className="sticky top-24 overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]"><h2 className="bg-[#203b46] px-5 py-4 text-center font-serif text-xl font-bold text-white">Get Started Now</h2><div className="p-5 text-center"><h3 className="font-serif text-base font-bold text-slate-900">We Guide You to Choose the Best College</h3><p className="mt-2 text-sm text-slate-600">Explore, compare & secure your future today.</p><a href="tel:+919540237575" className="mt-6 block rounded border border-blue-700 px-4 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50">Call Expert Now</a><button type="button" onClick={showForm} className="mt-3 w-full rounded bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Enquire Now</button><button type="button" onClick={showForm} className="mt-3 w-full rounded bg-rose-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600">Apply Now</button></div></div></aside>
      </div>
    </div>
    <Dialog open={open} onClose={close} fullWidth maxWidth="lg" aria-labelledby="university-enquiry-title" slots={{ transition: Slide }} slotProps={{ transition: { direction: "down", timeout: { enter: 420, exit: 280 } }, paper: { sx: { borderRadius: 2, maxWidth: 1000, m: 2, overflow: "hidden" } } }}>
      <Box component="form" onSubmit={submit} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "46% 54%" } }}>
        <Box sx={{ bgcolor: "#d8fbe0", p: { xs: 2, sm: 4 }, display: { xs: "none", sm: "block" } }}>
          <Box sx={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}><Image src="/images/university-enquiry-art.png" alt="Illustrated world map for studying abroad" fill sizes="(max-width: 900px) 100vw, 440px" style={{ objectFit: "contain" }} /></Box>
          <Box sx={{ mt: 2, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 19, color: "#193e39" }}>Start Your Study Abroad Journey Today</Box>
          <Box sx={{ mt: 1, color: "#35524c", fontSize: 14, lineHeight: 1.7 }}>Explore universities, compare study options and speak with an admissions advisor.</Box>
          <Box sx={{ mt: 3, borderTop: "1px solid #a7dfb5", pt: 2, color: "#234e44", fontSize: 14, fontWeight: 600 }}>{university.name}<Box sx={{ fontSize: 13, fontWeight: 400, mt: 0.5 }}>{university.city}, {university.country}</Box></Box>
        </Box>
        <Box sx={{ p: { xs: 2.5, sm: 4, md: 5 }, position: "relative" }}>
          <Button type="button" onClick={close} disabled={submitting} aria-label="Close enquiry form" sx={{ position: "absolute", top: 8, right: 8, minWidth: 32, color: "#475569" }}><CloseRoundedIcon /></Button>
          <Box id="university-enquiry-title" sx={{ fontFamily: "Georgia, serif", fontSize: { xs: 25, sm: 30 }, fontWeight: 700, color: "#103d65", pr: 3 }}>Looking For Study Abroad?</Box>
          <Box sx={{ mt: 1, mb: 3, color: "#64748b", fontSize: 14 }}>Fill in your details below.</Box>
          {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
          {feedback?.type !== "success" && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField label="First Name" value={enquiry.firstName} onChange={update("firstName")} required fullWidth size="small" inputProps={{ minLength: 2 }} />
            <TextField label="Last Name" value={enquiry.lastName} onChange={update("lastName")} required fullWidth size="small" inputProps={{ minLength: 2 }} />
            <TextField label="Email Address" type="email" value={enquiry.email} onChange={update("email")} required fullWidth size="small" />
            <TextField label="Phone Number" type="tel" value={enquiry.phone} onChange={(event) => setEnquiry((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))} required fullWidth size="small" inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10, title: "Enter exactly 10 digits" }} />
            <LocationField label="Country" value={enquiry.country} options={countries} loading={geoLoading.country} error={geoError.country} onChange={(value) => { setEnquiry((current) => ({ ...current, country: value, state: "", city: "" })); setStates([]); setCities([]); setGeoError((current) => ({ ...current, state: "", city: "" })); }} />
            <LocationField label="State" value={enquiry.state} options={states} loading={geoLoading.state} error={geoError.state} onChange={(value) => { setEnquiry((current) => ({ ...current, state: value, city: "" })); setCities([]); setGeoError((current) => ({ ...current, city: "" })); }} />
            <LocationField label="City" value={enquiry.city} options={cities} loading={geoLoading.city} error={geoError.city} onChange={(value) => setEnquiry((current) => ({ ...current, city: value }))} />
            <TextField label="Target Country" value={university.country} fullWidth size="small" InputProps={{ readOnly: true }} />
            <TextField label="Message (optional)" value={enquiry.message} onChange={update("message")} fullWidth multiline minRows={2} size="small" sx={{ gridColumn: "1 / -1" }} />
          </Box>}
          {feedback?.type !== "success" && <Button type="submit" variant="contained" fullWidth disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null} sx={{ mt: 2, bgcolor: "#103d65", py: 1.35, fontWeight: 700, "&:hover": { bgcolor: "#0a2d4c" } }}>Submit Now</Button>}
          <Box sx={{ mt: 2, textAlign: "center", color: "#64748b", fontSize: 12 }}>By submitting this form, you agree to be contacted about your enquiry.</Box>
        </Box>
      </Box>
    </Dialog>
  </main>;
}

function UniversityImage({ university }) {
  const [imageSrc, setImageSrc] = useState(university.image || universityFallbackCampus);
  return <Image src={imageSrc} alt={`${university.name} campus`} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" priority onError={() => setImageSrc(universityFallbackCampus)} />;
}

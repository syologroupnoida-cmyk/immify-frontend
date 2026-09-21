import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert, Autocomplete, Box, Button, CircularProgress, Dialog, Slide, TextField } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Swal from "sweetalert2";
import MainApi from "@/util/MainApi";

const GEO_API = "https://countriesnow.space/api/v0.1/countries";
const emptyForm = { firstName: "", lastName: "", email: "", phone: "", country: "", state: "", city: "", message: "" };

async function getGeoData(path, payload, signal) {
  const response = await fetch(`${GEO_API}${path}`, {
    ...(payload ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) } : {}),
    signal,
  });
  if (!response.ok) throw new Error("Location lookup failed");
  const result = await response.json();
  if (result.error) throw new Error(result.msg || "Location lookup failed");
  return result.data;
}

function LocationField({ label, value, options, loading, disabled, onChange }) {
  return <Autocomplete freeSolo openOnFocus autoHighlight options={options} inputValue={value} loading={loading} disabled={disabled}
    filterOptions={(available, state) => available.filter((option) => option.toLowerCase().includes(state.inputValue.trim().toLowerCase())).slice(0, 12)}
    onInputChange={(_, next, reason) => { if (reason === "input" || reason === "clear") onChange(next); }}
    onChange={(_, selected) => onChange(selected || "")}
    renderInput={(params) => <TextField {...params} label={label} required fullWidth size="small" />} />;
}

export default function StudyAbroadServiceEnquiryModal({ open, onClose, listing }) {
  const [form, setForm] = useState(emptyForm);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ country: false, state: false, city: false });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!open || countries.length) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => setLoading((current) => ({ ...current, country: true })));
    getGeoData("/iso", null, controller.signal)
      .then((data) => setCountries(data.map((item) => item.name).filter(Boolean)))
      .catch(() => setFeedback({ type: "warning", message: "Location suggestions are temporarily unavailable. You can type the location manually." }))
      .finally(() => setLoading((current) => ({ ...current, country: false })));
    return () => controller.abort();
  }, [countries.length, open]);

  const selectedCountry = countries.find((item) => item.toLowerCase() === form.country.trim().toLowerCase());
  const selectedState = states.find((item) => item.toLowerCase() === form.state.trim().toLowerCase());

  useEffect(() => {
    if (!selectedCountry) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => setLoading((current) => ({ ...current, state: true })));
    getGeoData("/states", { country: selectedCountry }, controller.signal)
      .then((data) => setStates((data.states || []).map((item) => item.name).filter(Boolean)))
      .catch(() => setStates([]))
      .finally(() => setLoading((current) => ({ ...current, state: false })));
    return () => controller.abort();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => setLoading((current) => ({ ...current, city: true })));
    getGeoData("/state/cities", { country: selectedCountry, state: selectedState }, controller.signal)
      .then((data) => setCities(Array.isArray(data) ? data.filter(Boolean) : []))
      .catch(() => setCities([]))
      .finally(() => setLoading((current) => ({ ...current, city: false })));
    return () => controller.abort();
  }, [selectedCountry, selectedState]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const close = () => { if (!submitting) onClose?.(); };
  const submit = async (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) {
      setFeedback({ type: "error", message: "Enter a valid 10-digit phone number." });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await MainApi.post("/leads", {
        categoryId: listing.category?.id,
        serviceId: listing.serviceData?.id,
        firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone,
        country: form.country.trim(), state: form.state.trim(), city: form.city.trim(),
        message: form.message.trim() || `I would like to know more about ${listing.title}.`,
        metadata: {
          source: "study-abroad-service-detail",
          serviceListingId: listing.id,
          servicesRequired: [listing.serviceName],
          destinationCountries: listing.dynamicData?.country ? [listing.dynamicData.country] : [],
          termsAccepted: true,
        },
      }, { skipAuth: true, suppressAuthRedirect: true });
      setForm(emptyForm);
      onClose?.();
      await Swal.fire({
        icon: "success",
        title: "Enquiry Submitted",
        text: response?.data?.message || "Lead submitted for verification.",
        confirmButtonColor: "#103d65",
      });
    } catch (error) {
      setFeedback({ type: "error", message: error?.response?.data?.message || error.message || "Unable to submit your enquiry." });
    } finally {
      setSubmitting(false);
    }
  };

  const targetCountry = listing?.dynamicData?.country || "To be discussed";
  return <Dialog open={open} onClose={close} fullWidth maxWidth="lg" slots={{ transition: Slide }} slotProps={{ transition: { direction: "down", timeout: { enter: 420, exit: 280 } }, paper: { sx: { borderRadius: 2, maxWidth: 1000, m: 2, overflow: "hidden" } } }}>
    <Box component="form" onSubmit={submit} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "46% 54%" } }}>
      <Box sx={{ bgcolor: "#d8fbe0", p: { xs: 2, sm: 4 }, display: { xs: "none", sm: "block" } }}>
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}><Image src="/images/university-enquiry-art.png" alt="Study abroad destinations" fill sizes="520px" style={{ objectFit: "contain" }} /></Box>
        <Box sx={{ mt: 2, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 19, color: "#193e39" }}>Start Your Study Abroad Journey Today</Box>
        <Box sx={{ mt: 1, color: "#35524c", fontSize: 14, lineHeight: 1.7 }}>Explore universities, compare study options and speak with an admissions advisor.</Box>
        <Box sx={{ mt: 3, borderTop: "1px solid #a7dfb5", pt: 2, color: "#234e44", fontSize: 14, fontWeight: 700 }}>{listing?.title}<Box sx={{ fontSize: 13, fontWeight: 400, mt: 0.5 }}>{targetCountry}</Box></Box>
      </Box>
      <Box sx={{ p: { xs: 2.5, sm: 4, md: 5 }, position: "relative" }}>
        <Button type="button" onClick={close} disabled={submitting} aria-label="Close enquiry form" sx={{ position: "absolute", top: 10, right: 10, minWidth: 34, color: "#475569" }}><CloseRoundedIcon /></Button>
        <Box sx={{ fontFamily: "Georgia, serif", fontSize: { xs: 25, sm: 30 }, fontWeight: 700, color: "#103d65", pr: 3 }}>Looking For Study Abroad?</Box>
        <Box sx={{ mt: 1, mb: 3, color: "#64748b", fontSize: 14 }}>Fill in your details below.</Box>
        {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
        {feedback?.type !== "success" && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="First Name" value={form.firstName} onChange={update("firstName")} required fullWidth size="small" />
          <TextField label="Last Name" value={form.lastName} onChange={update("lastName")} required fullWidth size="small" />
          <TextField label="Email Address" type="email" value={form.email} onChange={update("email")} required fullWidth size="small" />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))} required fullWidth size="small" inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10 }} />
          <LocationField label="Country" value={form.country} options={countries} loading={loading.country} onChange={(value) => { setForm((current) => ({ ...current, country: value, state: "", city: "" })); setStates([]); setCities([]); }} />
          <LocationField label="State" value={form.state} options={states} loading={loading.state} disabled={!form.country} onChange={(value) => { setForm((current) => ({ ...current, state: value, city: "" })); setCities([]); }} />
          <LocationField label="City" value={form.city} options={cities} loading={loading.city} disabled={!form.state} onChange={(value) => setForm((current) => ({ ...current, city: value }))} />
          <TextField label="Target Country" value={targetCountry} fullWidth size="small" InputProps={{ readOnly: true }} />
          <TextField label="Message (optional)" value={form.message} onChange={update("message")} fullWidth multiline minRows={2} size="small" sx={{ gridColumn: "1 / -1" }} />
        </Box>}
        {feedback?.type !== "success" && <Button type="submit" variant="contained" fullWidth disabled={submitting || !listing?.category?.id || !listing?.serviceData?.id} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null} sx={{ mt: 2.5, bgcolor: "#103d65", py: 1.45, fontWeight: 700, "&:hover": { bgcolor: "#0a2d4c" } }}>{submitting ? "Submitting..." : "Submit Now"}</Button>}
        <Box sx={{ mt: 2, textAlign: "center", color: "#64748b", fontSize: 12 }}>By submitting this form, you agree to be contacted about your enquiry.</Box>
      </Box>
    </Box>
  </Dialog>;
}

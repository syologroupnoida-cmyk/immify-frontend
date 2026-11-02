import { useRef, useState } from "react";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Swal from "sweetalert2";
import MainApi from "@/util/MainApi";
import { getLeadDocumentPayload, leadDocumentTypeOptions, uploadLeadDocument } from "@/util/leadDocuments";

const inquiryTopics = [
  "Visa Services",
  "Immigration Services",
  "Study Abroad",
  "Test Preparation",
  "Relocation Support",
  "Documentation",
]

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  topic: "Visa Services",
  destination: "",
  message: "",
}

const initialLeadDocument = {
  file: null,
  name: "Resume",
}

function splitName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  }
}

export default function FreeQuoteSection({ appearance = "default" }) {
  const [formState, setFormState] = useState(initialFormState)
  const [leadDocument, setLeadDocument] = useState(initialLeadDocument)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormState((current) => ({ ...current, [name]: digitsOnly }))
      setFormErrors((current) => ({ ...current, [name]: "" }))
      return
    }

    setFormState((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: "" }))
  }

  const handleDocumentChange = (event) => {
    const { name, value, files } = event.target
    setLeadDocument((current) => ({
      ...current,
      [name]: name === "file" ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submittingRef.current) return

    const nextErrors = {}

    if (!formState.name.trim()) nextErrors.name = "Name is required."
    if (!formState.email.trim()) {
      nextErrors.email = "Email is required."
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }
    if (!formState.phone.trim()) {
      nextErrors.phone = "Phone number is required."
    } else if (!/^\d{10}$/.test(formState.phone.trim())) {
      nextErrors.phone = "Phone number must be exactly 10 digits."
    }
    if (!formState.topic.trim()) nextErrors.topic = "Select a service type."
    if (!formState.destination.trim()) nextErrors.destination = "Destination is required."
    if (!formState.message.trim()) nextErrors.message = "Message is required."

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors)
      await Swal.fire({
        icon: "warning",
        title: "Please complete the form",
        text: "Check the highlighted fields and try again.",
        confirmButtonColor: "#1f2a77",
      })
      return
    }

    submittingRef.current = true
    setSubmitting(true)

    try {
      const { firstName, lastName } = splitName(formState.name)
      const documentUrl = await uploadLeadDocument(leadDocument.file, leadDocument.name)
      const documentPayload = getLeadDocumentPayload(leadDocument.name, documentUrl)

      const payload = {
        firstName,
        lastName,
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        country: "India",
        state: "N/A",
        city: "N/A",
        servicesRequired: [formState.topic.trim()],
        destinationCountries: [formState.destination.trim()],
        message: formState.message.trim(),
        additionalInformation: formState.message.trim(),
        ...documentPayload,
        metadata: {
          source: "website-free-quote",
          serviceType: formState.topic.trim(),
          destination: formState.destination.trim(),
          ...(documentUrl ? { documentName: leadDocument.name } : {}),
        },
      }

      const response = await MainApi.post("/leads", payload, {
        skipAuth: true,
        suppressAuthRedirect: true,
      })

      await Swal.fire({
        icon: "success",
        title: "Request sent",
        text: response?.data?.message || "Thank you for contacting Immify. Your request has been submitted. This is an enquiry, not a confirmed booking or a guarantee that a provider will accept the case. Review provider terms and fees before proceeding.",
        confirmButtonColor: "#1f2a77",
      })

      setFormState(initialFormState)
      setLeadDocument(initialLeadDocument)
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error?.response?.data?.message || (error instanceof Error ? error.message : "Please try again."),
        confirmButtonColor: "#1f2a77",
      })
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "5px" },
    "& .MuiInputLabel-root": { color: "#334155" },
    "& .MuiOutlinedInput-input": { paddingTop: "11px", paddingBottom: "11px" },
  }

  return (
    <section
      id="free-quote"
      className={`relative w-full overflow-hidden text-slate-900 ${appearance === "page" ? "bg-white py-6 text-left" : "bg-slate-100 px-4 py-10 sm:px-6 lg:px-8 lg:py-14"}`}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-[#1f2a77]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-[#f5c542]/15 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f2a77]">Get Free Quote</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-3xl">
            Tell Us What You Need Help With
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Share your goal, destination and timeline. Immify can help route your request toward relevant service categories and providers, where available.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Your next step</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Ask about service availability, scope and next steps.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Compare with clarity</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Compare options and choose the right service with confidence.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-busy={submitting}
          aria-label="Quote request"
          className="relative z-10 rounded-[10px] border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.12)] sm:p-5 lg:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f2a77]">Get in Touch</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Send your quote request</h3>
            </div>
            <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-[#1f2a77] text-[#f5c542] sm:flex">
              <MessageRoundedIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Full Name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Enter your name"
              fullWidth
              variant="outlined"
              size="small"
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              sx={fieldSx}
            />

            <TextField
              label="Email Address"
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="Enter your email"
              fullWidth
              variant="outlined"
              size="small"
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              sx={fieldSx}
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              fullWidth
              variant="outlined"
              size="small"
              error={Boolean(formErrors.phone)}
              helperText={formErrors.phone}

              sx={fieldSx}

            />

            <TextField
              select
              label="Service Type"
              name="topic"
              value={formState.topic}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              error={Boolean(formErrors.topic)}
              helperText={formErrors.topic}
              sx={fieldSx}

            >
              {inquiryTopics.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Destination / Country"
              name="destination"
              value={formState.destination}
              onChange={handleChange}
              placeholder="Country or city you are targeting"
              fullWidth
              variant="outlined"
              size="small"
              error={Boolean(formErrors.destination)}
              helperText={formErrors.destination}
              className="sm:col-span-2"
              sx={fieldSx}
            />

            <TextField
              label="Message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              placeholder="Tell us about your requirement"
              fullWidth
              variant="outlined"
              size="small"
              multiline
              minRows={3}
              error={Boolean(formErrors.message)}
              helperText={formErrors.message}
              className="sm:col-span-2"
              sx={fieldSx}
            />

            <TextField
              select
              label="Document Name"
              name="name"
              value={leadDocument.name}
              onChange={handleDocumentChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={fieldSx}
            >
              {leadDocumentTypeOptions.map((documentName) => (
                <MenuItem key={documentName} value={documentName}>
                  {documentName}
                </MenuItem>
              ))}
            </TextField>

            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center justify-start gap-2 rounded-[5px] border border-slate-300 bg-white px-3 text-sm font-medium text-[#1f2a77] transition hover:border-[#1f2a77]"
              onClick={(event) => event.currentTarget.querySelector("input")?.click()}
            >
              <CloudUploadOutlinedIcon className="h-4 w-4" />
              <span className="truncate">{leadDocument.file ? leadDocument.file.name : "Upload Document"}</span>
              <input
                hidden
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentChange}
              />
            </button>
          </div>

          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <p className="text-xs leading-6 text-slate-500">
              By submitting, you agree to be contacted about this enquiry. Include only information needed to describe your request; avoid uploading sensitive identity documents at this stage. Read our <Link href="/privacy-policy" className="font-semibold text-blue-700 underline underline-offset-2">Privacy Policy</Link>.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-[#1f2a77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18215f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[175px]"
            >
              {submitting ? <CircularProgress size={16} color="inherit" aria-label="Sending request" /> : <MessageRoundedIcon className="h-4 w-4" />}
              <span aria-live="polite">{submitting ? "Sending..." : "Send My Enquiry"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

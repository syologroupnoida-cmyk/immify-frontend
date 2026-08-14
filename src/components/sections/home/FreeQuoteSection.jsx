import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import Swal from "sweetalert2";

const inquiryTopics = [
  "Visa Services",
  "Immigration Services",
  "Study Abroad",
  "Test Preparation",
  "Relocation Support",
  "Documentation",
]

export default function FreeQuoteSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Visa Services",
    destination: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState({})

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

  const handleSubmit = async (event) => {
    event.preventDefault()

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

    try {
      const response = await fetch("/api/free-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || "Failed to submit quote request")
      }

      await Swal.fire({
        icon: "success",
        title: "Request sent",
        text: result?.message || "We have received your quote request.",
        confirmButtonColor: "#1f2a77",
      })

      setFormState({
        name: "",
        email: "",
        phone: "",
        topic: "Visa Services",
        destination: "",
        message: "",
      })
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#1f2a77",
      })
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
      className="relative w-full overflow-hidden bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8 lg:py-14"
    >
      <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-[#1f2a77]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-[#f5c542]/15 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f2a77]">Get Free Quote</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Tell us what you need and get a quick expert response.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Share your goal, destination, and timeline. Our team will review your request and help you find the right service provider.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Fast response</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Most inquiries receive a reply within one business day.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Trusted guidance</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Compare options and choose the right service with confidence.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 rounded-[10px] border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.12)] sm:p-5 lg:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f2a77]">Get in Touch</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">Send your quote request</h3>
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              inputProps={{ inputMode: "numeric", maxLength: 10 }}
              fullWidth
              variant="outlined"
              size="small"
              error={Boolean(formErrors.phone)}
              helperText={formErrors.phone}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
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
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      maxHeight: 220,
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    },
                  },
                },
              }}
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-slate-500">
              By submitting this form, you agree to be contacted regarding your request.
            </p>
            <button
              type="submit"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[rgb(31,42,119)] px-6 text-sm font-semibold text-white transition hover:bg-[rgb(24,33,95)]"
            >
              <MessageRoundedIcon className="h-4 w-4" />
              Get Free Quote
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
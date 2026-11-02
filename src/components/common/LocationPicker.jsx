import { forwardRef, useEffect, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { LocationOnOutlined, SearchRounded, MyLocationRounded } from "@mui/icons-material";
import { detectLocation, saveLocation, searchLocations } from "@/util/locations";
import { topCountries } from "@/components/sections/home/homeData";

const countries = topCountries.map(country => ({ id: country.slug, label: country.name }));
const labelOf = option => typeof option === "string" ? option : option?.label || "";

const LocationPaper = forwardRef(function LocationPaper({ children, onDetect, onSearch, busy, status, ...props }, ref) {
  return (
    <Paper {...props} ref={ref} elevation={0} sx={{ border: "1px solid #e3eaf4", borderRadius: "12px", boxShadow: "0 12px 32px #153b6b1a", overflow: "hidden" }}>
      <div className="flex gap-2 border-b border-slate-100 p-2" onMouseDown={event => event.preventDefault()}>
        <button type="button" onClick={onDetect} disabled={busy} className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-2 text-xs font-semibold text-blue-700 disabled:opacity-50"><MyLocationRounded sx={{ fontSize: 16 }} />Use current location</button>
        <button type="button" onClick={onSearch} disabled={busy} className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-[#1f2a77] px-3 text-xs font-semibold text-white disabled:opacity-50"><SearchRounded sx={{ fontSize: 16 }} />Search</button>
      </div>
      {status && <p role="status" className="px-3 py-2 text-xs leading-5 text-slate-600">{status}</p>}
      {children}
      <p className="border-t border-slate-100 px-3 py-2 text-[10px] text-slate-500">Location data: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap contributors</a></p>
    </Paper>
  );
});

export default function LocationPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);

  const select = option => {
    const label = labelOf(option);
    onChange(label);
    if (label) saveLocation(label);
    setOpen(false);
    setStatus("");
  };

  const lookup = async current => {
    if (!current && value.trim().length < 2) { setStatus("Enter at least two characters, then press Search."); return; }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setStatus(current ? "Finding your location..." : "Searching locations...");
    try {
      if (current) {
        const place = await detectLocation(controller.signal);
        if (!controller.signal.aborted) select(place);
      } else {
        const places = await searchLocations(value, controller.signal);
        if (!controller.signal.aborted) { setResults(places); setStatus(places.length ? "Select a matching location below." : "No matching place found. Try another name or enter your location manually."); }
      }
    } catch (error) {
      if (!controller.signal.aborted) setStatus(error.message || "Location lookup failed. Please search manually.");
    } finally {
      if (request.current === controller) setBusy(false);
    }
  };

  return (
    <Autocomplete
      id="hero-destination"
      freeSolo
      forcePopupIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value || null}
      inputValue={value}
      options={results.length ? results : countries}
      getOptionLabel={labelOf}
      isOptionEqualToValue={(option, selected) => labelOf(option) === labelOf(selected)}
      filterOptions={(options, state) => results.length ? options : options.filter(option => labelOf(option).toLowerCase().includes(state.inputValue.toLowerCase()))}
      onInputChange={(_, next, reason) => { if (reason === "input" || reason === "clear") { request.current?.abort(); setBusy(false); onChange(next); setResults([]); setStatus(""); } }}
      onChange={(_, next) => select(next)}
      onKeyDown={event => {
        if (event.key === "Enter" && !event.target.getAttribute("aria-activedescendant")) {
          event.preventDefault();
          event.defaultMuiPrevented = true;
          setOpen(true);
          lookup(false);
        }
      }}
      loading={busy}
      noOptionsText="Press Search to find a city or country."
      slots={{ paper: LocationPaper }}
      slotProps={{ popper: { keepMounted: true }, paper: { onDetect: () => lookup(true), onSearch: () => lookup(false), busy, status }, listbox: { sx: { maxHeight: 240, fontSize: 14 } } }}
      renderOption={(props, option) => { const { key, ...rest } = props; return <li key={key} {...rest}><LocationOnOutlined sx={{ color: "#64748b", fontSize: 18, mr: 1, flexShrink: 0 }} /><span className="text-sm leading-6">{labelOf(option)}</span></li>; }}
      renderInput={params => <TextField {...params} placeholder="Search city or country" variant="standard" slotProps={{ ...params.slotProps, input: { ...params.slotProps.input, disableUnderline: true }, htmlInput: { ...params.slotProps.htmlInput, "aria-labelledby": "hero-destination-label" } }} />}
      sx={{ "& .MuiInputBase-root": { fontFamily: "inherit", fontSize: 14, padding: "0 !important" }, "& .MuiAutocomplete-input": { padding: "3px 0 !important", minHeight: 21, outline: "none", color: "#132b55" }, "& .MuiAutocomplete-input:focus-visible": { backgroundColor: "#eef4ff", borderRadius: 1 }, "& .MuiAutocomplete-endAdornment": { position: "static" } }}
    />
  );
}

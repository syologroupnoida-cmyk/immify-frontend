import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function MarketplaceSearch({ options, value, loading, onSelect, onSearch }) {
  const [input, setInput] = useState(typeof value === "string" ? value : value?.label || "");
  return (
    <form aria-label="Search marketplace services" onSubmit={(event) => {
      event.preventDefault();
      if (value && typeof value !== "string" && input === value.label) onSelect(value);
      else onSearch(input);
    }} className="mx-auto mt-6 flex max-w-2xl items-center gap-1 rounded-xl bg-white p-1 text-left shadow-lg shadow-blue-950/20 ring-4 ring-white/10">
      <Autocomplete
        id="marketplace-service-search"
        size="small"
        freeSolo
        forcePopupIcon
        openOnFocus
        fullWidth
        options={options}
        value={value}
        inputValue={input}
        loading={loading}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => typeof option === "string" ? option : option.label}
        getOptionKey={(option) => typeof option === "string" ? option : option.key}
        isOptionEqualToValue={(option, selected) => option.key === selected.key}
        onInputChange={(_, next) => setInput(next)}
        onChange={(_, option) => typeof option === "string" ? onSearch(option) : onSelect(option)}
        slotProps={{ paper: { sx: { mt: 1, border: "1px solid #e2e8f0", borderRadius: 2, boxShadow: "0 12px 36px #15234b24" } }, listbox: { sx: { maxHeight: 320, fontSize: 13 } } }}
        sx={{
          minWidth: 0,
          "& .MuiOutlinedInput-root": {
            height: 42,
            borderRadius: 2,
            fontSize: 13,
            cursor: "pointer",
            "& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 },
          },
          "& .MuiAutocomplete-input": { padding: "7px 4px !important", cursor: "pointer" },
          "& .MuiAutocomplete-groupLabel": { fontSize: 10, fontWeight: 700, color: "#6b7890", letterSpacing: ".04em", lineHeight: "32px", backgroundColor: "#f8fafc" },
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return <li key={key} {...optionProps}><span className={option.isCategory ? "font-semibold text-[#1f2a77]" : "pl-2 text-slate-600"}>{option.isCategory ? `All ${option.label}` : option.label}</span></li>;
        }}
        renderInput={(params) => <TextField {...params} placeholder="Search or choose a service" slotProps={{ ...params.slotProps, input: { ...params.slotProps.input, startAdornment: <><SearchRoundedIcon aria-hidden="true" sx={{ fontSize: 19, color: "#8490a6", ml: .5, mr: .5 }} />{params.slotProps.input.startAdornment}</> }, htmlInput: { ...params.slotProps.htmlInput, "aria-label": "Search or choose a service" } }} />}
      />
      <button type="submit" aria-label="Search services" className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1f2a77] px-3 text-xs font-semibold text-white transition hover:bg-[#17215f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-5"><SearchRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /><span className="hidden sm:inline">Search</span></button>
    </form>
  );
}

import { useRef } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function ScrollableFilterBar({ children, label, tabList = false }) {
  const trackRef = useRef(null);
  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(160, track.clientWidth * 0.7),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };
  const buttonClass = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
  return (
    <div className="mt-7 flex items-center gap-1.5 border-b border-slate-200 pb-3">
      <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${label.toLowerCase()} left`} className={buttonClass}><ChevronLeftRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /></button>
      <div ref={trackRef} role={tabList ? "tablist" : "group"} aria-label={label} className="scrollbar-none flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 py-1">
        {children}
      </div>
      <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${label.toLowerCase()} right`} className={buttonClass}><ChevronRightRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /></button>
    </div>
  );
}

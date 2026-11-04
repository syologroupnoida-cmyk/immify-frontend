import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function DestinationMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) setOpen(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          buttonRef.current?.focus();
          setOpen(false);
        }
      }}
    >
      <Link href="/destinations" ref={buttonRef} aria-expanded={open} aria-controls="header-destinations" className="inline-flex min-h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Explore Immigration Partners <KeyboardArrowDown aria-hidden="true" sx={{ fontSize: 16 }} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <nav id="header-destinations" aria-label="Explore Immigration Partners" className="absolute right-0 top-full z-50 w-48 overflow-hidden rounded-xl border border-blue-100 bg-white p-2 text-slate-900 shadow-xl">
          <ul>
            {[
              { title: "India", href: "/destinations/national" },
              { title: "Abroad", href: "/destinations/international" },
            ].map((item) => (
              <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-10 items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700">{item.title}</Link></li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

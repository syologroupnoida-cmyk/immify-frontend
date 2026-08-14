import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import SiteLogo from "@/images/site-logo.png";

export default function Header() {
  const [location, setLocation] = useState("Moradabad");
  const [locationOpen, setLocationOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/70 bg-[#1f2a77] text-white shadow-sm">
      <div className="mx-auto flex w-full items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 cursor-pointer transition-opacity hover:opacity-90" aria-label="Immify home">
          <Image src={SiteLogo} alt="Immify" width={44} height={44} className="h-11 w-11 object-contain" priority />
        </Link>

        <div className="mx-auto flex min-w-[280px] max-w-[620px] flex-1 items-center gap-2 rounded-[10px] bg-white p-[4px] shadow-sm">
          <div className="relative min-w-[110px] rounded-[10px] border border-slate-200 bg-slate-100 px-2.5 py-1.75 text-sm text-slate-700" ref={locationRef}>
            <button
              onClick={() => setLocationOpen((s) => !s)}
              className="inline-flex w-full cursor-pointer items-center justify-between gap-2 text-sm"
            >
              <span>{location}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>

            {locationOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                {['Moradabad','Delhi','Mumbai'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => { setLocation(loc); setLocationOpen(false); }}
                    className="w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            placeholder="Search products, services, suppliers"
            className="flex-1 rounded-[10px] border border-slate-200 bg-white px-3 py-1.25 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <button className="cursor-pointer rounded-[10px] bg-emerald-500 px-3 py-1.25 text-sm font-semibold text-white transition hover:bg-emerald-600">
            Search
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Advertise">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h13a3 3 0 0 1 0 6H4V6Zm0 6h13a3 3 0 0 1 0 6H4v-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Advertise</span>
          </button>
          <button className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Free Business listing ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M7 7V5h10v2M7 7l1 10h8l1-10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Free Business listing</span>
          </button>
          <Link href="/jobs" className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Jobs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Jobs</span>
          </Link>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen((s) => !s)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21a9 9 0 0 1 18 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              <span>Sign In</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                <a href="#" className="block cursor-pointer px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">Sign In</a>
                <a href="#" className="block cursor-pointer px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">Register</a>
                <div className="border-t border-slate-200" />
                <a href="#" className="block cursor-pointer px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">Contact Us</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

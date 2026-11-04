import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { featuredDestinations, getDestinationPhoto } from "./destinationData";

function CoverageMap() {
  return (
    <svg viewBox="0 0 600 300" aria-hidden="true" className="h-full w-full">
      <defs>
        <pattern id="coverage-land" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#26b9ff" /></pattern>
        <radialGradient id="coverage-glow"><stop stopColor="#67e8f9" stopOpacity=".55" /><stop offset="1" stopColor="#67e8f9" stopOpacity="0" /></radialGradient>
      </defs>
      <g fill="url(#coverage-land)">
        <path d="M35 65 65 40 120 30 165 45 183 68 163 85 157 107 133 116 118 143 94 140 78 116 60 107 45 82ZM121 146 151 151 176 178 176 200 163 224 152 248 140 267 127 241 129 213 113 185ZM176 29 205 18 223 32 211 56 188 65Z" />
        <path d="M259 63 280 46 309 43 325 58 351 51 380 40 434 39 461 49 503 55 540 78 550 99 526 113 494 105 473 120 448 118 434 144 409 137 388 108 365 98 340 108 327 89 300 87 278 97 257 87Z" />
        <path d="M272 101 303 97 332 111 343 138 331 165 319 184 305 205 287 192 278 168 263 150 258 126ZM445 142 465 153 473 178 492 180 500 195 480 195 463 181 448 169ZM491 216 526 208 552 225 548 248 518 252 490 239ZM339 202 346 193 350 215 343 226Z" />
      </g>
      <g fill="none" stroke="#a5dfff" strokeOpacity=".7" strokeWidth=".8"><path d="M105 77Q230-20 285 63M105 77Q250 5 421 133M110 110Q285-30 514 230M285 63Q430 5 514 230M285 63Q354 52 421 133M421 133Q499 128 514 230M110 110Q220 275 303 175" /></g>
      {[[105,77],[285,63],[421,133],[514,230],[151,188]].map(([x,y]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}><circle r="25" fill="url(#coverage-glow)" /><path d="M0 8C-3 3-9-4-9-10a9 9 0 0 1 18 0C9-4 3 3 0 8Z" fill="white" stroke="#7ddfff" strokeWidth="1.5" /><circle cy="-10" r="4" fill="#13baff" /></g>)}
    </svg>
  );
}

export default function GlobalCoverageSection() {
  return (
    <section aria-labelledby="global-coverage-title" className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="max-w-4xl">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#064ce5]"><PublicRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /> Global connections</p>
            <h2 id="global-coverage-title" className="mt-2 text-xl font-bold leading-snug tracking-tight text-[#091631] sm:text-2xl">Find <span className="text-[#064ce5]">Immigration Agents</span> Across the World</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Explore destinations and find the right guidance for your move.</p>
          </div>
          <Link href="/providers" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-[#4c79ff] bg-white px-5 text-sm font-bold text-[#064ce5] transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
            Browse all agents <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} />
          </Link>
        </div>
        <div className="relative mt-4 flex min-h-48 items-center justify-center overflow-hidden rounded-2xl bg-[#062457]">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1280 200" preserveAspectRatio="none">
            <defs><linearGradient id="coverage-wave"><stop stopColor="#06418e" /><stop offset="1" stopColor="#0754ad" /></linearGradient></defs>
            <path d="M0 130C180 190 260 80 430 130S650 40 780 0H0Z" fill="#071c43" />
            <path d="M300 200C440 110 530 190 650 90L780 0H950L690 200Z" fill="url(#coverage-wave)" opacity=".65" />
            <path d="M560 200L790 0H900L700 200Z" fill="#063570" opacity=".6" />
          </svg>
          <div className="relative z-10 mx-auto w-full max-w-3xl p-5 text-center sm:px-7 sm:py-8 lg:px-10">
            <h3 className="text-lg font-bold leading-snug tracking-tight text-white sm:text-xl lg:text-2xl">Global ambitions. Personal guidance.</h3>
            <p className="mt-2 text-sm leading-6 text-blue-50">Connect with immigration professionals for your next destination.</p>
            <Link href="/destinations/international" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#064ce5] transition-colors hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              Explore destinations <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} />
            </Link>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-20 sm:w-1/2"><CoverageMap /></div>
        </div>
        <div className="mb-3 mt-5">
          <h3 className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#091631]"><span aria-hidden="true" className="h-5 w-1 rounded-full bg-[#064ce5]" />Popular destinations</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDestinations.map((country) => {
            const photo = getDestinationPhoto(country.slug);
            return (
              <Link key={country.slug} href={{ pathname: "/providers", query: { country: country.name } }} aria-label={`Find immigration agents for ${country.name}`} className="group flex items-center gap-4 overflow-hidden rounded-xl border border-[#e8edf6] bg-white shadow-[0_5px_14px_rgba(30,69,136,0.10)] transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 motion-reduce:transition-none">
                <div className="relative h-[88px] w-[100px] shrink-0 overflow-hidden rounded-xl bg-blue-50 lg:w-[92px] xl:w-[112px]">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 112px, (min-width: 1024px) 92px, 100px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 py-3 pr-3">
                  <h4 className="text-sm font-bold leading-5 tracking-tight text-[#091631] xl:text-base">{country.name}</h4>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-[#064ce5]">Find agents <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 17 }} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

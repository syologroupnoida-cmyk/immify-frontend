import { useState } from "react";
import Image from "next/image";
import styles from "./HomeLoading.module.css";

export function HomeCardSkeletons({ label, jobs = false, compact = false }) {
  return (
    <div role="status" className={compact ? "w-full" : "mt-7 w-full"}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className={`flex gap-4 overflow-hidden px-1 pb-3 ${jobs ? "" : "lg:justify-center"}`}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${jobs ? "min-h-[320px] w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]" : "min-h-[290px] w-[min(82vw,260px)] min-w-[230px] sm:min-w-[245px] lg:min-w-[260px]"}`}>
            <div className={`${styles.shimmer} ${jobs ? "h-28" : "h-36"}`} />
            <div className="space-y-3 p-3.5">
              <div className={`${styles.shimmer} h-3 w-2/5 rounded`} />
              <div className={`${styles.shimmer} h-4 w-5/6 rounded`} />
              <div className={`${styles.shimmer} h-3 w-3/5 rounded`} />
              {jobs && <div className={`${styles.shimmer} h-5 w-1/2 rounded`} />}
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <div className={`${styles.shimmer} h-3 w-1/3 rounded`} />
                <div className={`${styles.shimmer} h-3 w-1/4 rounded`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Key the inner component by URL so a new filtered result starts with its own placeholder.
export function HomeCardImage(props) {
  return <LoadingImage key={props.src} {...props} />;
}

function LoadingImage({ src, fallback, alt = "", className = "", sizes = "(min-width: 1024px) 260px, 82vw" }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div aria-hidden="true" data-image-loading className={`absolute inset-0 ${styles.shimmer}`} />}
      <Image
        src={failed ? fallback : src}
        alt={alt}
        fill
        unoptimized
        sizes={sizes}
        className={`${className} ${styles.image} ${loaded ? styles.loaded : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed && src !== fallback) setFailed(true);
          else setLoaded(true);
        }}
      />
    </>
  );
}

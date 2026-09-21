import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FloatingQuickActions from "@/components/common/FloatingQuickActions";
import AuthLoadingModal from "@/components/common/AuthLoadingModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { subscribeAuthLoading } from "@/util/authLoading";
import { shouldUseDefaultLayout } from "@/util/authRouting";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const useDefaultLayout = shouldUseDefaultLayout(Component, router.pathname);
  const [authLoadingTitle, setAuthLoadingTitle] = useState("");

  useEffect(() => subscribeAuthLoading((event) => setAuthLoadingTitle(event.detail || "")), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let disposed = false;
    let cleanup = () => {};

    import("gsap").then(({ gsap }) => {
      if (disposed) return;

      const main = document.querySelector("main");
      if (main) gsap.fromTo(main, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", clearProps: "opacity,transform" });

      const getButton = (event) => event.target instanceof Element
        ? event.target.closest('button:not(:disabled), [role="button"]:not([aria-disabled="true"])')
        : null;
      const onPointerOver = (event) => {
        if (event.pointerType !== "mouse") return;
        const button = getButton(event);
        if (button && !(event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) gsap.to(button, { y: -2, duration: 0.18, ease: "power2.out", overwrite: "auto" });
      };
      const onPointerOut = (event) => {
        if (event.pointerType !== "mouse") return;
        const button = getButton(event);
        if (button && !(event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) gsap.to(button, { y: 0, duration: 0.18, ease: "power2.out", overwrite: "auto" });
      };
      const onClick = (event) => {
        const button = getButton(event);
        if (button) gsap.fromTo(button, { scale: 0.98 }, { scale: 1, duration: 0.22, ease: "power2.out", overwrite: "auto" });
      };

      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);
      document.addEventListener("click", onClick);
      cleanup = () => {
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("pointerout", onPointerOut);
        document.removeEventListener("click", onClick);
      };
    });

    return () => { disposed = true; cleanup(); };
  }, [router.asPath]);

  return (
    <div className="min-h-screen bg-slate-50">
      {useDefaultLayout && <Header />}
      {useDefaultLayout && <FloatingQuickActions />}
      <Component {...pageProps} />
      {useDefaultLayout && <Footer />}
      <AuthLoadingModal title={authLoadingTitle} />
    </div>
  );
}

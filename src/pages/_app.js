import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FloatingQuickActions from "@/components/common/FloatingQuickActions";
import { useRouter } from "next/router";
import { shouldUseDefaultLayout } from "@/util/authRouting";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const useDefaultLayout = shouldUseDefaultLayout(Component, router.pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      {useDefaultLayout && <Header />}
      {useDefaultLayout && <FloatingQuickActions />}
      <Component {...pageProps} />
      {useDefaultLayout && <Footer />}
    </div>
  );
}

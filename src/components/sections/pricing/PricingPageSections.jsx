import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MainApi from "@/util/MainApi";

const SUBSCRIPTION_PLANS_ENDPOINT = "/api/v1/subscription-plans";

const trustStats = [
  { label: "Included credits", value: "100+" },
  { label: "Package slots", value: "5-50" },
  { label: "Lead access", value: "Direct" },
  { label: "Billing", value: "Monthly" },
];

const processSteps = [
  {
    title: "Create your vendor profile",
    description: "Register as an agent and complete your business details for marketplace access.",
    icon: PublicOutlinedIcon,
  },
  {
    title: "Choose a subscription",
    description: "Pick the plan that matches your package volume, leads, and support needs.",
    icon: WorkspacePremiumOutlinedIcon,
  },
  {
    title: "Use credits for growth",
    description: "Create packages, purchase direct leads, and improve your marketplace visibility.",
    icon: AccountBalanceWalletOutlinedIcon,
  },
];

const planHighlights = [
  { title: "Marketplace package creation", description: "Publish packages based on your plan limit.", icon: Inventory2OutlinedIcon },
  { title: "Wallet credits included", description: "Use included credits for lead access and growth actions.", icon: CreditScoreOutlinedIcon },
  { title: "Visibility controls", description: "Featured and priority plans help agencies reach more customers.", icon: InsightsOutlinedIcon },
  { title: "Support levels", description: "Move from email support to priority or dedicated assistance.", icon: SupportAgentOutlinedIcon },
];

const faqs = [
  {
    question: "Can I compare plans before signing up?",
    answer: "Yes. This page shows available subscription plans, pricing, included credits, and important features.",
  },
  {
    question: "Where do I purchase a plan?",
    answer: "Plan purchase happens inside the agent dashboard after login, so the subscription is attached to the correct vendor account.",
  },
  {
    question: "Are credits included in every plan?",
    answer: "Plans can include wallet credits. The exact amount is shown on each pricing card from the live subscription API.",
  },
];

function parseJsonObject(value) {
  if (!value || typeof value !== "string") return value;

  try {
    const parsedValue = JSON.parse(value);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    return {};
  }
}

function extractPlanList(payload = {}) {
  const candidates = [
    payload?.data?.plans,
    payload?.data?.subscriptionPlans,
    payload?.data?.subscription_plans,
    payload?.data?.data?.plans,
    payload?.data?.data?.subscriptionPlans,
    payload?.data?.data?.items,
    payload?.data?.items,
    payload?.data?.docs,
    payload?.data?.rows,
    payload?.data,
    payload?.plans,
    payload?.subscriptionPlans,
    payload?.items,
    payload,
  ];

  return candidates.find(Array.isArray) || [];
}

function formatPrice(priceInPaise = 0) {
  const numericPrice = Number(priceInPaise) || 0;
  return (numericPrice / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function getBillingLabel(billingCycle = "") {
  const labels = {
    MONTHLY: "/month",
    QUARTERLY: "/quarter",
    HALF_YEARLY: "/6 months",
    YEARLY: "/year",
    LIFETIME: "/lifetime",
  };

  return labels[billingCycle] || "";
}

function mapPlan(apiPlan = {}) {
  const displayContent = parseJsonObject(apiPlan.displayContent || apiPlan.display_content) || {};
  const themeColor = displayContent.themeColor || displayContent.theme_color || "#3446f1";
  const salePrice = apiPlan.salePriceInPaise ?? apiPlan.sale_price_in_paise ?? 0;
  const offerPrice = apiPlan.offerPriceInPaise ?? apiPlan.offer_price_in_paise ?? salePrice;
  const features = displayContent.features || apiPlan.features || [];

  return {
    id: apiPlan.id || apiPlan._id || apiPlan.planId || apiPlan.slug || apiPlan.name,
    name: apiPlan.name || "Subscription Plan",
    description: apiPlan.description || "Flexible plan for agencies growing on Immify.",
    salePrice,
    offerPrice,
    currency: apiPlan.currency || "INR",
    billingLabel: getBillingLabel(apiPlan.billingCycle || apiPlan.billing_cycle),
    includedCredits: apiPlan.includedCredits ?? apiPlan.included_credits ?? 0,
    maxPackages: apiPlan.maxPackages ?? apiPlan.max_packages ?? 0,
    maxJobPosts: apiPlan.maxJobPosts ?? apiPlan.max_job_posts ?? 0,
    jobPortalAccess: Boolean(apiPlan.jobPortalAccess ?? apiPlan.job_portal_access),
    directLeadPriceCredits: apiPlan.directLeadPriceCredits ?? apiPlan.direct_lead_price_credits ?? 0,
    displayOrder: apiPlan.displayOrder ?? apiPlan.display_order ?? 0,
    featured: Boolean(apiPlan.isFeatured ?? apiPlan.is_featured),
    badgeText: displayContent.badgeText || displayContent.badge_text || "",
    ribbonText: displayContent.ribbonText || displayContent.ribbon_text || "",
    ctaButtonText: displayContent.ctaButtonText || displayContent.cta_button_text || "Start with this plan",
    themeColor,
    softColor: displayContent.softColor || displayContent.soft_color || `${themeColor}12`,
    features: Array.isArray(features) ? features : [],
  };
}

function PricingCard({ plan }) {
  const packageLimit = plan.maxPackages === -1 ? "Unlimited" : plan.maxPackages;

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${
        plan.featured ? "border-blue-500" : "border-slate-200"
      }`}
    >
      <div className="h-1.5" style={{ backgroundColor: plan.themeColor }} />

      {plan.ribbonText && (
        <div className="absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold text-white" style={{ backgroundColor: plan.themeColor }}>
          {plan.ribbonText}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: plan.softColor, color: plan.themeColor }}
          >
            <WorkspacePremiumOutlinedIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            {plan.badgeText && (
              <span className="mb-1 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {plan.badgeText}
              </span>
            )}
            <h3 className="text-xl font-semibold leading-tight text-slate-950">{plan.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Offer price</p>
              <p className="mt-1 text-3xl font-bold leading-none text-slate-950">
                Rs. {formatPrice(plan.offerPrice)}
                <span className="ml-1 text-sm font-semibold text-slate-500">{plan.billingLabel}</span>
              </p>
            </div>
            {Number(plan.salePrice) > Number(plan.offerPrice) && (
              <p className="text-sm font-semibold text-slate-400 line-through">Rs. {formatPrice(plan.salePrice)}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-sm">
          <div className="border-b border-r border-slate-200 px-3 py-2">
            <p className="text-[11px] font-semibold leading-none text-slate-500">Credits</p>
            <p className="mt-1 text-sm font-semibold leading-tight text-slate-900">{plan.includedCredits}</p>
          </div>
          <div className="border-b border-slate-200 px-3 py-2">
            <p className="text-[11px] font-semibold leading-none text-slate-500">Packages</p>
            <p className="mt-1 text-sm font-semibold leading-tight text-slate-900">{packageLimit}</p>
          </div>
          <div className="border-r border-slate-200 px-3 py-2">
            <p className="text-[11px] font-semibold leading-none text-slate-500">Job posts</p>
            <p className="mt-1 text-sm font-semibold leading-tight text-slate-900">{plan.maxJobPosts}</p>
          </div>
          <div className="px-3 py-2">
            <p className="text-[11px] font-semibold leading-none text-slate-500">Lead price</p>
            <p className="mt-1 text-sm font-semibold leading-tight text-slate-900">{plan.directLeadPriceCredits} credits</p>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-2.5">
          {plan.features.length ? plan.features.map((feature) => {
            const included = feature?.included ?? feature?.isIncluded ?? true;
            const text = feature?.text || feature?.name || feature?.label || String(feature || "");

            return (
              <div key={text} className="flex items-start gap-2 text-sm text-slate-700">
                {included ? (
                  <CheckCircleOutlineRoundedIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: plan.themeColor }} />
                ) : (
                  <CloseRoundedIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                )}
                <span className={included ? "" : "text-slate-400 line-through"}>{text}</span>
              </div>
            );
          }) : (
            <p className="text-sm text-slate-500">Feature details will be available soon.</p>
          )}
        </div>

        <Link
          href="/agent/sign-up"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition hover:brightness-95"
          style={{ backgroundColor: plan.themeColor }}
        >
          {plan.ctaButtonText}
        </Link>
      </div>
    </article>
  );
}

export default function PricingPageSections() {
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      setIsLoadingPlans(true);
      setError("");

      try {
        const response = await MainApi.get(SUBSCRIPTION_PLANS_ENDPOINT, {
          skipAuth: true,
          suppressAuthRedirect: true,
        });
        const mappedPlans = extractPlanList(response?.data)
          .map(mapPlan)
          .filter((plan) => plan.id)
          .sort((firstPlan, secondPlan) => firstPlan.displayOrder - secondPlan.displayOrder);

        if (isMounted) setPlans(mappedPlans);
      } catch (loadError) {
        if (isMounted) {
          setPlans([]);
          setError(loadError?.response?.data?.message || loadError?.message || "Unable to load subscription plans.");
        }
      } finally {
        if (isMounted) setIsLoadingPlans(false);
      }
    }

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPlanName = useMemo(() => plans.find((plan) => plan.featured)?.name || plans[1]?.name || "the right plan", [plans]);

  return (
    <main className="min-h-screen bg-white pt-16">
      <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=80)" }}
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/65" />
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase text-sky-200">Immify pricing</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Subscription Plans</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">
            Compare plans for marketplace packages, wallet credits, job access, lead pricing, and agency visibility.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#pricing-plans" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              View plans
            </Link>
            <Link href="/agent/sign-up" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
              Register as agent
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing-plans" className="bg-[#f6f8fb] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-blue-700">Live subscription plans</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Pick the plan that fits your agency</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              These cards load from the subscription plans API, so pricing and included features stay current.
            </p>
          </div>

          {isLoadingPlans && (
            <div className="mt-10 flex min-h-[260px] items-center justify-center rounded-lg border border-slate-200 bg-white text-center">
              <div>
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="mt-4 text-sm font-semibold text-slate-600">Loading subscription plans...</p>
              </div>
            </div>
          )}

          {!isLoadingPlans && error && (
            <div className="mt-10 rounded-lg border border-rose-200 bg-rose-50 p-5 text-center">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          )}

          {!isLoadingPlans && !error && !plans.length && (
            <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-slate-600">No subscription plans available right now.</p>
            </div>
          )}

          {!isLoadingPlans && !error && !!plans.length && (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-700">What plans unlock</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Built for agencies that want predictable growth</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Start with core package publishing, then upgrade when you need more credits, job access, priority visibility, or advanced support.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {planHighlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <div key={highlight.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <Icon className="h-7 w-7 text-blue-700" />
                    <h3 className="mt-4 text-base font-semibold text-slate-950">{highlight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-sky-200">How it works</p>
              <h2 className="mt-3 text-3xl font-bold">From signup to active marketplace plan</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Vendors can compare public plans here, then activate {featuredPlanName} or another suitable plan after logging into the agent dashboard.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <Icon className="h-7 w-7 text-sky-200" />
                      <span className="text-sm font-semibold text-slate-400">0{index + 1}</span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Questions</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Pricing FAQ</h2>
            <div className="mt-7 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-blue-700 p-7 text-white">
            <RocketLaunchOutlinedIcon className="h-10 w-10" />
            <h2 className="mt-5 text-3xl font-bold">Ready to grow your agency on Immify?</h2>
            <p className="mt-4 text-sm leading-7 text-blue-50">
              Create your agent account, complete your profile, and choose a subscription from the dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent/sign-up" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                Create agent account
              </Link>
              <Link href="/agent/login" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
                Agent login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

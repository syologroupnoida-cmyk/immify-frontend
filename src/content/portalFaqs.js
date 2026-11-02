import content from "./portalContent.json";

const compare = { question: "What should I check before choosing a provider?", answer: "Compare service scope, destination experience, professional authorisation where required, written fees and contract terms. Confirm important details directly with the provider before proceeding." };
const outcomes = { question: "Does a listing guarantee an outcome?", answer: "No. A marketplace listing does not guarantee a visa, admission, employment or residency. Decisions depend on the relevant authorities, institutions, employers and your circumstances." };

const pageFaqs = {
  "premium-services": [
    { question: "How do I choose a premium service?", answer: "Start with your goal, then review the service details and the support described. Confirm that the provider handles your destination and circumstances before engaging." },
    { question: "Are all listed benefits included in every quote?", answer: "The service page describes support to explore. Ask the provider to confirm the exact inclusions, fees, third-party charges and any exclusions in writing." },
    outcomes,
  ],
  "privacy-policy": [
    { question: "How can I raise a privacy request?", answer: "Use the Contact page and mention Privacy request in your message. Identify the account or enquiry concerned and explain what information or action you are asking about. Avoid including unnecessary sensitive documents." },
    { question: "Can I use location search without sharing GPS coordinates?", answer: "Yes. You can refuse browser location permission and type or search for a city or country manually. The selected location can be changed or cleared in your browser." },
    { question: "Does signing out delete my information?", answer: "Signing out or clearing browser storage does not automatically delete server-side enquiries or account records. Contact Immify about those records, and contact a provider separately about information they hold." },
  ],
  about: [
    { question: "What does Immify help me do?", answer: "Immify helps you discover immigration, visa, study abroad, career and relocation services, compare listing information and connect with relevant providers." },
    { question: "Is Immify an immigration authority?", answer: "No. Immify is a service discovery and connection platform. Government authorities make visa and immigration decisions." },
    compare,
  ],
  contact: [
    { question: "What should I include in my enquiry?", answer: "Include your service goal, destination, preferred timeline and a short description of the help you need. Provide accurate contact details so your request can be followed up." },
    { question: "Does sending an enquiry confirm a booking?", answer: "No. An enquiry does not confirm a booking or guarantee that a particular provider will accept your case. Agree the scope, fees and terms before proceeding." },
    { question: "Should I upload identity documents?", answer: "Include only information needed to describe your request. Avoid sharing sensitive identity documents at this stage; confirm the appropriate document-handling process with the provider first." },
  ],
  "become-a-provider": [
    { question: "How do I join as a provider?", answer: "Register your account, complete your business profile, add relevant services and destinations, and submit any credentials requested for review. Check the current plan and listing terms before activating paid features." },
    { question: "What information should I prepare?", answer: "Prepare your business name, contact information, service areas, service descriptions, pricing or quote process, and professional credentials where required." },
    { question: "Where can I compare provider plans?", answer: "The Pricing page shows available plans and their current inclusions. Review billing periods, credits, lead access and renewal or cancellation terms before subscribing." },
    { question: "Does registering guarantee enquiries?", answer: "Registration and a marketplace listing do not guarantee enquiry volume, customers or revenue." },
  ],
  "free-eligibility-check": [
    { question: "Is there an automated eligibility score here?", answer: "An automated score is not currently available on this page. You can send an enquiry to request an initial discussion with a relevant provider." },
    { question: "What details help with an initial discussion?", answer: "Share your destination, study or work goal, relevant background and intended timeline. Ask what additional information is needed before sending sensitive documents." },
    { question: "Does an assessment establish legal eligibility?", answer: "No. An initial discussion or screening does not establish legal eligibility, replace authorised advice or predict an immigration decision. Confirm any consultation fees before proceeding." },
  ],
  "be-a-global-indian": [
    { question: "Who is this section for?", answer: "This section is for Indians exploring international education, careers, relocation, business and everyday life abroad." },
    { question: "Can I share my own journey?", answer: "Contact Immify to suggest a topic or share a practical experience. Publication requires review and permission to use personal details or photographs." },
    { question: "Can I rely on another person's experience?", answer: "Personal experiences can help you prepare questions, but circumstances differ. Verify current requirements with the relevant institution, employer or official authority." },
  ],
  "success-stories": [
    { question: "Are there published stories here yet?", answer: "There are no published stories in this section yet. Genuine experiences will be added when reviewed and approved for publication." },
    { question: "How can I submit my experience?", answer: "Contact Immify with a short description of your journey and the practical lessons you would like to share. Avoid including sensitive application or identity documents." },
    { question: "Will someone else's outcome apply to me?", answer: "No. An individual story does not predict your visa, employment, admission or relocation outcome." },
  ],
  news: [
    { question: "Where should I verify an immigration update?", answer: "Check the relevant government authority, regulator or institution website before acting. Review the publication date and whether a change is proposed or already in force." },
    { question: "Are news articles available here yet?", answer: "There are no news articles published in this section yet. Explore the resource pages for general planning checklists." },
    { question: "Does a news update replace individual advice?", answer: "No. General updates do not determine which rules apply to your case. Discuss your circumstances with an appropriately qualified provider where needed." },
  ],
  blog: [
    { question: "What resources can I explore?", answer: "Explore provider comparisons, visa enquiries, study costs, international job searches, relocation and application document checklists." },
    { question: "Are these guides personalised advice?", answer: "No. These resources help you research and prepare questions. Confirm current requirements and seek advice suited to your circumstances before making decisions." },
    compare,
  ],
  legal: [
    { question: "What is Immify's role?", answer: "Immify helps users discover services and connect with providers. It is not the government authority deciding immigration or visa applications." },
    { question: "Is this a complete set of legal policies?", answer: "No. This page explains the platform role and service disclaimer. It does not replace a Privacy Policy, Terms of Use or an individual service agreement." },
    { question: "What should I review before sharing information or paying?", answer: "Request the applicable platform and provider policies, written service scope, fees, cancellation terms and document-handling arrangements." },
  ],
  services: [
    { question: "How do I find the right service category?", answer: "Start with your goal: immigration, visas, study, coaching, careers, relocation or practical support. Open a category to review the services and available providers." },
    compare,
    { question: "Are prices the same for every provider?", answer: "No. Review the published listing price or request a quote. Confirm what is included, third-party charges and the provider's terms before paying." },
  ],
  providers: [compare, outcomes, { question: "How do I narrow down providers?", answer: "Use the available category, service and location filters, then review each provider's profile and listing details before contacting them." }],
  pricing: [
    { question: "Where do current plan details appear?", answer: "The plan cards show current available prices and inclusions. Compare the billing period, listing limits, credits and lead access for each plan." },
    { question: "Where do I purchase a subscription?", answer: "Plan purchase takes place in the agent dashboard after login so the subscription is associated with your provider account." },
    { question: "What should I confirm before subscribing?", answer: "Confirm taxes, renewal dates, cancellation and refund terms, how credits work and whether unused credits expire. Do not assume these terms are identical across plans." },
  ],
};

export function getPortalFaqs(pageKey) {
  if (pageKey === "faq") return content["/faq"].sections.map((section) => ({ question: section.heading, answer: section.items.join(" ") }));
  if (pageFaqs[pageKey]) return pageFaqs[pageKey];
  const service = content[`/services/${pageKey}`];
  if (service) return [{ question: "What support can I explore in this category?", answer: service.intro }, compare, outcomes];
  return [];
}

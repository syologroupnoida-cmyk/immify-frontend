export const privacyPage = {
  title: "Privacy Policy | Immify",
  description: "Understand information collected through Immify, enquiry sharing, location lookup, browser storage and how to raise a privacy request.",
  heading: "Privacy Policy",
  intro: "This Privacy Policy explains how information is used when you browse Immify, create an account, submit an enquiry, publish a provider listing or use location features. It also explains how to ask questions about your information.",
};

export const privacySections = [
  {
    id: "information-collected",
    title: "Information you provide",
    paragraphs: ["The information involved depends on the feature you use. You can browse public pages without completing an enquiry or creating an account."],
    items: [
      "Enquiry information: your name, email, phone number, service interests, destination and the message you submit.",
      "Account and profile information: details you enter when registering, signing in or updating your profile.",
      "Provider information: business and contact details, service descriptions, credentials and verification documents supplied through the relevant account workflows.",
      "Documents: files you choose to upload for an enquiry, profile or verification process. These may contain identity, education, employment or financial information.",
    ],
  },
  {
    id: "purposes",
    title: "How information is used",
    paragraphs: ["Information submitted through the portal is used in the context of the feature or request you choose. Provide only what is needed for that purpose."],
    items: [
      "To receive and respond to service enquiries and help connect you with relevant providers.",
      "To support account access, profile management, provider listings and verification workflows.",
      "To display services and help you search by category and location.",
      "To handle support messages, privacy questions and reports about the platform.",
    ],
  },
  {
    id: "sharing",
    title: "Enquiries, providers and information sharing",
    paragraphs: [
      "When you request a service or contact a provider, the contact details and request information needed to follow up may be made available to the relevant provider through the enquiry workflow. Review the information you submit and ask how it will be handled before sharing sensitive documents.",
      "Information you include in a published provider listing can be visible to other users. Service providers may have their own privacy practices, service agreements and document requirements. Review those terms before engaging them.",
      "The portal also uses technical services to deliver features such as account sign-in, API requests and file uploads. Information required to operate a feature is transmitted to the service involved. Ask Immify about the recipients relevant to your enquiry or account if you need more detail.",
    ],
  },
  {
    id: "location",
    title: "Location searches and browser permission",
    paragraphs: [
      "If you allow your browser to share your location, coordinates are used to look up a place name. You can refuse location permission and enter or search for a place manually.",
      "Location search text and coordinates used for reverse lookup are sent through the application server to the configured geocoding service. The current location lookup uses OpenStreetMap's Nominatim service. Lookup results may be cached to reduce repeat requests.",
      "Your selected place is saved in your browser so the header and search field can remember the same choice. You can change that selection, clear browser storage or change location permission in your browser settings.",
    ],
    links: [{ label: "OpenStreetMap privacy information", href: "https://osmfoundation.org/wiki/Privacy_Policy" }],
  },
  {
    id: "browser-storage",
    title: "Cookies, browser storage and sign-in",
    paragraphs: [
      "Immify uses cookies and browser storage for sign-in status, account/session information, profile information and the selected location. Blocking or clearing these may sign you out or reset remembered choices.",
      "If you choose Google sign-in, Google's identity service is involved in that sign-in process. External services and websites may apply their own privacy and storage policies.",
      "Signing out or clearing browser storage does not automatically delete enquiry or account records held by the platform or by a provider.",
    ],
  },
  {
    id: "retention",
    title: "Retention and deletion",
    paragraphs: [
      "The period for which information needs to be held depends on the request, account feature, service relationship and any applicable recordkeeping requirements. This page does not set a single retention period for every type of record.",
      "Contact Immify to ask about retention or request deletion of information associated with your account or enquiry. A provider that has received your information may need a separate request. Some information may need to remain where an applicable obligation or an unresolved matter requires it.",
    ],
  },
  {
    id: "documents-security",
    title: "Documents and account security",
    paragraphs: [
      "Files uploaded through the portal are sent to its upload service and associated with the relevant enquiry or account workflow. Upload only documents needed for the purpose described to you.",
      "Keep your account credentials private. Before supplying passports, bank statements or other sensitive records, confirm why they are needed, who can access them and how retention or deletion will be handled. Avoid adding unnecessary document details to free-text messages.",
      "No internet transmission or storage system can be guaranteed completely secure. If you suspect misuse of your account or a document, contact Immify with a description of the concern and avoid including passwords or full payment details.",
    ],
  },
  {
    id: "choices-rights",
    title: "Your choices and privacy requests",
    paragraphs: [
      "You can ask about information associated with your use of Immify, request correction or deletion, raise concerns about sharing, or ask to withdraw permission for future enquiry-related contact. The available rights and any exceptions depend on the law that applies to the processing.",
      "To help locate the relevant record, identify the account email or enquiry concerned and describe your request. Do not send identity documents unless they are necessary and an appropriate verification process has been explained.",
      "Use the Contact page to raise a privacy question or concern and mention 'Privacy request' in your message. If your concern relates to a provider's independent processing, also contact that provider.",
    ],
  },
  {
    id: "updates",
    title: "Policy updates and contact",
    paragraphs: [
      "This page may be updated when portal features or the information about its practices change. Check the date shown above when reviewing the policy.",
      "For questions about a particular service, request, recipient or privacy practice, contact Immify before submitting additional personal information. This policy is separate from the platform disclaimer and from any provider service agreement.",
    ],
  },
];

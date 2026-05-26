import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hearthstoneandco.sintra.site"),
  title: {
    default: "Houston Healthcare Staffing Agency | Hearthstone & Co.",
    template: "%s | Hearthstone & Co.",
  },
  description:
    "Veteran-owned Houston healthcare staffing for facilities and clinicians across Greater Houston. Built around speed, compliance, and accountability.",
  alternates: { canonical: "/" },
  authors: [{ name: "Hearthstone & Co. Workforce Solutions" }],
  keywords: [
    "Houston healthcare staffing",
    "per diem nursing Houston",
    "travel nurse staffing Texas",
    "CNA staffing Houston",
    "LVN staffing agency",
    "Greater Houston healthcare staffing",
    "clinician portal Houston",
    "facility staffing portal",
  ],
  openGraph: {
    title: "Houston Healthcare Staffing Agency | Hearthstone & Co.",
    description:
      "Veteran-owned healthcare staffing for Greater Houston facilities and clinicians. Organized workflows, clear communication, fast coverage.",
    type: "website",
    url: "/",
    siteName: "Hearthstone & Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Healthcare Staffing Agency | Hearthstone & Co.",
    description:
      "Veteran-owned healthcare staffing for Greater Houston facilities and clinicians. Organized workflows, clear communication, fast coverage.",
  },
  robots: { index: true, follow: true },
};

const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Organization"],
  name: "Hearthstone & Co. Workforce Solutions",
  url: "https://hearthstoneandco.com",
  logo: "https://hearthstoneandco.com/logo.png",
  telephone: "+17133645058",
  email: "renaye@hearthstoneandco.com",
  description:
    "Veteran-owned Houston healthcare staffing agency placing credentialed RNs, LVNs, and CNAs for SNFs, ALFs, hospitals, and clinics in 24–72 hours.",
  foundingDate: "2024",
  areaServed: [
    { "@type": "County", name: "Harris County", containedInPlace: "Texas" },
    { "@type": "County", name: "Fort Bend County", containedInPlace: "Texas" },
    { "@type": "County", name: "Montgomery County", containedInPlace: "Texas" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Houston",
    addressRegion: "TX",
    addressCountry: "US",
  },
  sameAs: [
    "https://facebook.com/hearthstoneandco",
    "https://instagram.com/hearthstoneandco",
    "https://linkedin.com/company/hearthstoneandco",
    "https://x.com/hearthstoneandco",
  ],
  knowsAbout: [
    "Healthcare Staffing",
    "Per Diem Nursing",
    "Travel Nursing",
    "CNA Staffing",
    "LVN Staffing",
    "RN Staffing",
    "JCAHO Compliance",
    "Healthcare Workforce Solutions",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      </head>
      <body className="font-[family-name:var(--font-dm-sans)] antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

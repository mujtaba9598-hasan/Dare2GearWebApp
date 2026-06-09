import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Google Analytics (GA4) Measurement ID
const GA_ID = "G-9ZZB66NWKM";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://dare2gear.online";
const SITE_TITLE = "Dare2Gear — Smart Travel Budget Planner for Pakistan";
const SITE_DESC =
  "Tell us your budget, group size and ride. Dare2Gear calculates fuel, hotels and food, then recommends exactly where in Pakistan you can travel — province to province or city to city, a short day trip or a long northern adventure, from Murree to Hunza and Fairy Meadows.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    "Pakistan travel",
    "budget trip planner",
    "Hunza",
    "Skardu",
    "Fairy Meadows",
    "fuel cost calculator",
    "tour planner Pakistan",
  ],
  openGraph: {
    type: "website",
    siteName: "Dare2Gear",
    title: SITE_TITLE,
    description: SITE_DESC,
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dare2Gear — Pakistan Adventure Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}

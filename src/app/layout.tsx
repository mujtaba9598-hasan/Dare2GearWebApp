import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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

export const metadata: Metadata = {
  title: "Dare2Gear — Smart Travel Budget Planner for Pakistan",
  description:
    "Tell us your budget, group size and ride. Dare2Gear calculates fuel, hotels and food, then recommends exactly where in Pakistan you can travel — province to province or city to city, a short day trip or a long northern adventure, from Murree to Hunza and Fairy Meadows.",
  keywords: [
    "Pakistan travel",
    "budget trip planner",
    "Hunza",
    "Skardu",
    "Fairy Meadows",
    "fuel cost calculator",
    "tour planner Pakistan",
  ],
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
      </body>
    </html>
  );
}

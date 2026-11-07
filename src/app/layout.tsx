import type { Metadata } from "next";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://samvitchoudhary.dev"),
  title: "Samvit's Kitchen",
  description:
    "Interactive portfolio — explore a watercolor kitchen to learn about Samvit's work and story.",
  alternates: {
    canonical: "https://samvitchoudhary.dev",
  },
  openGraph: {
    title: "Samvit's Kitchen",
    description:
      "Interactive portfolio — explore a watercolor kitchen to learn about Samvit's work and story.",
    url: "https://samvitchoudhary.dev",
    siteName: "Samvit's Kitchen",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Samvit's Kitchen - Interactive portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samvit's Kitchen",
    description:
      "Interactive portfolio — explore a watercolor kitchen to learn about Samvit's work and story.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${crimsonPro.variable} min-h-full`}>
      <body className="min-h-full overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}

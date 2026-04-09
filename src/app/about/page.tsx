"use client";

import dynamic from "next/dynamic";

const AboutClient = dynamic(
  () =>
    import("@/components/about/AboutScrollPage").then((mod) => ({
      default: mod.AboutScrollPage,
    })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#F5E6C8]" aria-hidden />,
  },
);

export default function AboutPage() {
  return <AboutClient />;
}

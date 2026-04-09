"use client";

import dynamic from "next/dynamic";

const ContactClient = dynamic(() => import("./ContactClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[100dvh] w-screen bg-[#F5E6C8]" aria-hidden />
  ),
});

export default function ContactPage() {
  return <ContactClient />;
}

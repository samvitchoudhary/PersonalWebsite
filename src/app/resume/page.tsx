import Link from "next/link";

const CREAM = "#F5E6C8";
const PDF_PATH = "/Samvit_Choudhary_SoftwareEngineer.pdf";

export default function ResumePage() {
  return (
    <div
      className="relative min-h-[100dvh] w-screen overflow-x-hidden"
      style={{ backgroundColor: "#0A0806" }}
    >
      <div className="fixed left-4 top-4 z-50 md:left-6 md:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm backdrop-blur-md transition-opacity hover:opacity-90"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            backgroundColor: "rgba(26, 21, 16, 0.85)",
            borderColor: "rgba(212, 160, 60, 0.25)",
            color: CREAM,
          }}
        >
          <span aria-hidden className="text-lg leading-none">
            ←
          </span>
          Back to Kitchen
        </Link>
      </div>

      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-24">
        <iframe
          src={PDF_PATH}
          title="Samvit Choudhary — Resume"
          className="shrink-0 border-none bg-white"
          style={{
            width: "min(95vw, 800px)",
            height: "90vh",
            borderRadius: 8,
            backgroundColor: "white",
          }}
        />
        <a
          href={PDF_PATH}
          download="Samvit_Choudhary_SoftwareEngineer.pdf"
          className="mt-4 text-center text-base text-[#D4A03C] no-underline underline-offset-[6px] transition-[opacity,text-decoration] hover:underline hover:opacity-95 hover:decoration-[#D4A03C]"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          Download Resume ↓
        </a>
      </div>
    </div>
  );
}

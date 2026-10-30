import { BackToKitchenButton } from "@/components/kitchen/BackToKitchenButton";

const PDF_PATH = "/SamvitChoudhary_Resume.pdf";

export default function ResumePage() {
  return (
    <div
      className="relative min-h-[100dvh] w-screen overflow-x-hidden"
      style={{ backgroundColor: "#0A0806" }}
    >
      <BackToKitchenButton />

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
          download="SamvitChoudhary_Resume.pdf"
          className="mt-4 text-center text-base text-[#D4A03C] no-underline underline-offset-[6px] transition-[opacity,text-decoration] hover:underline hover:opacity-95 hover:decoration-[#D4A03C]"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          Download Resume ↓
        </a>
      </div>
    </div>
  );
}

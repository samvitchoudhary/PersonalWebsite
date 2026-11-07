import { BackToKitchenButton } from "@/components/kitchen/BackToKitchenButton";
import { ResumeDocument } from "@/components/resume/ResumeDocument";

const PDF_PATH = "/SamvitChoudhary_Resume.pdf";

const linkClassName =
  "text-center text-base text-[#D4A03C] no-underline underline-offset-[6px] transition-[opacity,text-decoration] hover:underline hover:opacity-95 hover:decoration-[#D4A03C]";

export default function ResumePage() {
  return (
    <div
      className="relative min-h-[100dvh] w-screen overflow-x-hidden"
      style={{ backgroundColor: "#0A0806" }}
    >
      <BackToKitchenButton />

      <div className="flex min-h-[100dvh] flex-col items-center px-4 py-24">
        <ResumeDocument pdfPath={PDF_PATH} />
        <noscript>
          <p className="mt-4 text-center text-[#F5E6C8]">
            The in-page resume viewer needs JavaScript.
          </p>
        </noscript>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            Open resume
          </a>
          <a
            href={PDF_PATH}
            download="SamvitChoudhary_Resume.pdf"
            className={linkClassName}
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            Download resume
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type Status = "loading" | "ready" | "error";

type PdfjsModule = typeof import("pdfjs-dist");

type TextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
};

function hasText(item: unknown): item is TextItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<TextItem>;
  return typeof candidate.str === "string" && Array.isArray(candidate.transform);
}

function multiply(m1: number[], m2: number[]) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

function canvasHasInk(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return false;
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const step = 4 * 8;
  for (let i = 0; i < data.length; i += step) {
    if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) return true;
  }
  return false;
}

async function paintDocument(
  pdfjs: PdfjsModule,
  pdf: Awaited<ReturnType<PdfjsModule["getDocument"]>["promise"]>,
  host: HTMLDivElement,
  width: number,
) {
  host.replaceChildren();
  let sawText = false;
  let sawInk = false;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const pdfPage = await pdf.getPage(pageNumber);
    const base = pdfPage.getViewport({ scale: 1 });
    const scale = width / base.width;
    const viewport = pdfPage.getViewport({ scale });
    const pixelRatio = window.devicePixelRatio || 1;

    const pageEl = document.createElement("div");
    pageEl.style.position = "relative";
    pageEl.style.width = `${viewport.width}px`;
    pageEl.style.height = `${viewport.height}px`;
    pageEl.style.margin = "0 auto";
    pageEl.style.background = "white";

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width * pixelRatio);
    canvas.height = Math.floor(viewport.height * pixelRatio);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas is unavailable");

    const textLayer = document.createElement("div");
    textLayer.dataset.resumeText = "true";
    textLayer.setAttribute("role", "document");
    textLayer.setAttribute("aria-label", "Samvit Choudhary resume");
    textLayer.style.position = "absolute";
    textLayer.style.inset = "0";
    textLayer.style.overflow = "hidden";
    textLayer.style.lineHeight = "1";
    textLayer.style.color = "transparent";

    pageEl.append(canvas, textLayer);
    host.append(pageEl);

    await pdfPage.render({
      canvasContext: context,
      viewport,
      transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
    }).promise;

    const textContent = await pdfPage.getTextContent();
    for (const item of textContent.items) {
      if (!hasText(item) || item.str.length === 0) continue;
      sawText = true;
      const [a, b, c, d, e, f] = multiply(viewport.transform, item.transform);
      const fontHeight = Math.hypot(c, d) || Math.hypot(a, b);
      const span = document.createElement("span");
      span.textContent = item.str;
      span.style.position = "absolute";
      span.style.left = `${e}px`;
      span.style.top = `${f - fontHeight}px`;
      span.style.fontSize = `${fontHeight}px`;
      span.style.fontFamily = "sans-serif";
      span.style.whiteSpace = "pre";
      span.style.color = "transparent";
      span.style.transformOrigin = "0% 0%";
      textLayer.append(span);
    }

    if (canvasHasInk(canvas)) sawInk = true;
  }

  if (!sawText || !sawInk) {
    throw new Error("Resume rendered without visible text");
  }
}

export function ResumeDocument({ pdfPath }: { pdfPath: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const frame = frameRef.current;
    const host = hostRef.current;
    if (!frame || !host) return;

    let cancelled = false;
    let task: { destroy: () => Promise<void> } | null = null;

    const fail = () => {
      if (!cancelled) {
        host.replaceChildren();
        setStatus("error");
      }
    };

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = (await import(
          "pdfjs-dist/build/pdf.worker.mjs"
        )) as { WorkerMessageHandler: unknown };
        (
          globalThis as typeof globalThis & {
            pdfjsWorker?: { WorkerMessageHandler: unknown };
          }
        ).pdfjsWorker = { WorkerMessageHandler: worker.WorkerMessageHandler };

        const response = await fetch(pdfPath);
        if (!response.ok) throw new Error(`Resume request failed (${response.status})`);
        const data = new Uint8Array(await response.arrayBuffer());
        if (cancelled) return;

        const width = frame.clientWidth;
        if (width < 40) throw new Error("Resume viewer has no width");

        const loadingTask = pdfjs.getDocument({
          data,
          isEvalSupported: false,
        });
        task = loadingTask;
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        await paintDocument(pdfjs, pdf, host, width);
        if (!cancelled) setStatus("ready");
      } catch {
        fail();
      }
    })();

    return () => {
      cancelled = true;
      task?.destroy().catch(() => undefined);
    };
  }, [pdfPath]);

  return (
    <div ref={frameRef} className="w-full max-w-[800px]">
      {status === "loading" ? (
        <p
          className="py-16 text-center text-base text-[#F5E6C8]"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          Loading resume…
        </p>
      ) : null}
      {status === "error" ? (
        <div
          role="alert"
          className="rounded-lg bg-white px-6 py-16 text-center text-[#1A1610]"
          data-testid="resume-fallback"
        >
          <p className="text-base" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            This browser couldn&apos;t display the resume in the page.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-[#8A5A12] underline underline-offset-4"
            >
              Open resume
            </a>
            <a
              href={pdfPath}
              download="SamvitChoudhary_Resume.pdf"
              className="text-base text-[#8A5A12] underline underline-offset-4"
            >
              Download resume
            </a>
          </div>
        </div>
      ) : null}
      <div
        ref={hostRef}
        data-testid="resume-viewer"
        className={
          status === "ready"
            ? "overflow-hidden rounded-lg bg-white shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
            : "hidden"
        }
      />
    </div>
  );
}

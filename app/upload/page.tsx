import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { UploadFlow } from "@/components/upload/UploadFlow";

export const metadata: Metadata = {
  title: "Upload your CSV — Vouch",
  description:
    "Upload a CSV to map your columns and get ready for revenue insights. Everything runs in your browser.",
};

export default function UploadPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section aria-labelledby="upload-heading" className="py-16 sm:py-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 lg:px-8">
            <div className="mb-10 max-w-2xl text-center">
              <h1
                id="upload-heading"
                className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
              >
                Upload your CSV
              </h1>
              <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Drop in a sales, customer, or pipeline export. Parsing happens entirely in your
                browser — nothing is sent to a server.
              </p>
            </div>
            <UploadFlow />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

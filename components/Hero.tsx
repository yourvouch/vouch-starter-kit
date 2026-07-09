import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { ArrowRightIcon, UploadIcon } from "./icons";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(16,185,129,0.14),transparent_60%)]"
      />
      <Container className="flex flex-col items-center gap-8 py-24 text-center sm:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Open source &middot; v0.1 in active development
        </span>
        <h1
          id="hero-heading"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-6xl dark:text-white"
        >
          Find the revenue hiding in the data you already have.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 text-balance dark:text-zinc-400">
          Vouch turns the CSVs, exports, and reports you already collect into clear, actionable
          insights — lapsed customers, cold deals, revenue at risk — without a data warehouse,
          an analyst, or a subscription.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/upload" variant="primary">
            <UploadIcon className="h-4 w-4" aria-hidden="true" />
            Upload your CSV
          </Button>
          <Button href="#how-it-works" variant="secondary">
            See how it works
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}

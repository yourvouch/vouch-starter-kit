import { Container } from "./ui/Container";
import { ChartIcon, DownloadIcon, MapIcon, UploadIcon } from "./icons";

const steps = [
  {
    icon: UploadIcon,
    title: "Upload your CSV",
    description:
      "Drag and drop a sales, customer, or pipeline export. Nothing leaves your browser during processing.",
  },
  {
    icon: MapIcon,
    title: "Automatic column detection",
    description:
      "Vouch maps your fields — revenue, stage, owner, dates — automatically, with a chance to confirm before you continue.",
  },
  {
    icon: ChartIcon,
    title: "Instant insights",
    description:
      "See lapsed customers, deals going cold, and revenue at risk, ranked by business impact.",
  },
  {
    icon: DownloadIcon,
    title: "Export your summary",
    description:
      "Download a clear report with recommended next actions you can act on immediately.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            How it works
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            From raw export to actionable insight, in minutes.
          </p>
        </div>
        <ol className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative flex flex-col items-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="mt-4 text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

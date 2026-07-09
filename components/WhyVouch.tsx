import { Container } from "./ui/Container";
import { EyeIcon, ShieldIcon, SparkleIcon, TargetIcon } from "./icons";

const reasons = [
  {
    icon: SparkleIcon,
    title: "Simple first",
    description:
      "Works from a single file upload. No infrastructure to stand up, no analyst to hire, no weeks of setup.",
  },
  {
    icon: EyeIcon,
    title: "Transparent",
    description:
      "See exactly how every insight is calculated. Nothing about your data is hidden behind a black box.",
  },
  {
    icon: ShieldIcon,
    title: "Trustworthy",
    description:
      "Your data stays yours. Nothing is sent anywhere without your consent — processing happens in your browser.",
  },
  {
    icon: TargetIcon,
    title: "Focused",
    description:
      "Does one thing well: finds revenue opportunities hiding in the business data you already collect.",
  },
];

export function WhyVouch() {
  return (
    <section
      id="why-vouch"
      aria-labelledby="why-vouch-heading"
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="why-vouch-heading"
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            Why Vouch
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Most businesses already have the data. What they&rsquo;re missing is a fast, honest
            way to act on it.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { ArrowRightIcon, ChartIcon, MapIcon, UploadIcon } from "@/components/icons";

const STEPS = [
  { icon: UploadIcon, label: "Upload your CSV" },
  { icon: MapIcon, label: "Confirm column mapping" },
  { icon: ChartIcon, label: "View your dashboard" },
];

export function OnboardingSteps() {
  return (
    <ol className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
      {STEPS.map((step, index) => (
        <li key={step.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
            <step.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <ArrowRightIcon
              className="hidden h-4 w-4 flex-none text-zinc-300 sm:block dark:text-zinc-700"
              aria-hidden="true"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

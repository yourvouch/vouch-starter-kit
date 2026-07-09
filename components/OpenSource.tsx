import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { GithubIcon } from "./icons";

const GITHUB_URL = "https://github.com/yourvouch/vouch-starter-kit";

const points = [
  "MIT licensed — use it, modify it, self-host it, with no lock-in.",
  "Your data never leaves your browser. There is no server to send it to.",
  "Built in the open. Every contribution — code, docs, ideas — is welcome.",
];

export function OpenSource() {
  return (
    <section
      id="open-source"
      aria-labelledby="open-source-heading"
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <Container className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-8 py-16 text-center sm:px-16 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2
            id="open-source-heading"
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            Open source, by design
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Vouch is community-driven software. Anyone can inspect exactly how it works, deploy
            it themselves, and shape where it goes next.
          </p>
          <ul className="flex w-full max-w-xl flex-col gap-3 text-left">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500"
                />
                <span className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {point}
                </span>
              </li>
            ))}
          </ul>
          <Button href={GITHUB_URL} external variant="primary">
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
            Star on GitHub
          </Button>
        </div>
      </Container>
    </section>
  );
}

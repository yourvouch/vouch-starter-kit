import Link from "next/link";
import { Container } from "./ui/Container";
import { GithubIcon } from "./icons";

const GITHUB_URL = "https://github.com/yourvouch/vouch-starter-kit";

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "#why-vouch", label: "Why Vouch" },
      { href: "#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: `${GITHUB_URL}/blob/main/CONTRIBUTING.md`, label: "Contributing", external: true },
      { href: `${GITHUB_URL}/blob/main/CODE_OF_CONDUCT.md`, label: "Code of Conduct", external: true },
      { href: `${GITHUB_URL}/blob/main/SECURITY.md`, label: "Security", external: true },
    ],
  },
  {
    title: "Legal",
    links: [{ href: `${GITHUB_URL}/blob/main/LICENSE`, label: "MIT License", external: true }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
              Vouch
            </span>
            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Business Decision Intelligence for the data you already have.
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Vouch. MIT licensed and open source.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vouch on GitHub"
            className="text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-zinc-500 dark:hover:text-white"
          >
            <GithubIcon className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </footer>
  );
}

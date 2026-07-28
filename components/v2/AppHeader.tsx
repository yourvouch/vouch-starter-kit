import Link from "next/link";

const links = [
  ["/examples/interiors", "Explore"],
  ["/review", "New review"],
  ["/#ecosystem", "Build with Vouch"],
  ["/local-data", "Privacy"],
];

export function AppHeader({ action = true }: { action?: boolean }) {
  return (
    <header className="app-header">
      <Link className="brand" href="/">
        <span>Vouch</span>
        <small>Starter Kit</small>
      </Link>
      <nav aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        <a href="https://github.com/yourvouch/vouch-starter-kit">GitHub ↗</a>
      </nav>
      {action ? (
        <Link className="button button-primary header-action" href="/review">
          Use my data
        </Link>
      ) : (
        <span />
      )}
      <a id="main-content" href="#main-content" tabIndex={-1} className="sr-only">
        Main content starts here
      </a>
    </header>
  );
}

import Link from "next/link";
import { AppHeader } from "./AppHeader";

const examples = [
  ["interiors", "Interior design & architecture"],
  ["agency", "Agency & consulting"],
  ["saas", "SaaS"],
  ["general-sales", "General sales"],
] as const;

const steps = [
  ["Choose business type", "Pick the pack that matches your business."],
  ["Select sample or upload file", "Use a sample dataset or upload CSV or Excel."],
  ["Confirm mapping", "Review how your columns map to Vouch fields."],
  ["Confirm stages and identity", "Confirm lifecycle semantics and matching keys."],
  ["Review readiness", "See coverage and unavailable checks."],
  ["Generate review", "Get priorities, evidence, and recommended actions."],
];

export function Landing() {
  return (
    <>
      <AppHeader />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Local-first decision intelligence</span>
            <h1>Turn business data into explainable priorities, actions, comparisons and outcomes.</h1>
            <p>Vouch Starter Kit is an open-source engine and reference app for CSV/XLSX business analysis. Extend it, embed it, configure a vertical pack or deploy a branded fork.</p>
            <div className="entry-modes">
              <article>
                <span>Explore in 30 seconds</span>
                <h2>See the complete loop first.</h2>
                <p>Open a finished local workspace with two reviews, comparison, actions and measured outcomes. Nothing is uploaded.</p>
                <Link className="button button-primary" href="/examples/interiors">Explore a sample workspace</Link>
              </article>
              <article>
                <span>Use my data</span>
                <h2>Start a real review.</h2>
                <p>Your source file stays in this browser and is discarded after parsing. Saved reviews use local IndexedDB.</p>
                <Link className="button button-secondary" href="/review">Use my CSV or XLSX</Link>
              </article>
            </div>
            <ul className="trust" aria-label="Product commitments"><li>No signup</li><li>No backend</li><li>Inspect rules</li><li>Local processing</li><li>MIT licensed</li></ul>
          </div>
          <div className="hero-preview" aria-label="Founder Decision Review preview">
            <div className="preview-head"><strong>Founder Decision Review</strong><span>Included reference experience</span></div>
            <div className="preview-metrics"><div><b>3</b><span>priorities need attention</span></div><div><b>2</b><span>review periods</span></div><div><b>Measured</b><span>outcomes</span></div></div>
            <div className="bars"><span>Explainable evidence</span><i style={{ width: "76%" }}>Overdue follow-up</i><i style={{ width: "58%" }}>Supported inactivity</i><i style={{ width: "40%" }}>Missing owner</i></div>
          </div>
        </section>

        <section className="example-section" aria-labelledby="examples-heading">
          <div className="section-heading"><div><span className="eyebrow">Stable examples</span><h2 id="examples-heading">Open a completed vertical workspace.</h2></div><p>Direct URLs render deterministically after refresh without requiring upload, mapping or local database setup.</p></div>
          <div className="example-links">{examples.map(([slug, name]) => <Link key={slug} href={`/examples/${slug}`}><strong>{name}</strong><span>Review → compare → act → observe</span></Link>)}</div>
          <Link className="community-example" href="/examples/recruitment"><strong>Developer example: Recruitment Agency</strong><span>A fifth declarative pack demonstrating community extensibility →</span></Link>
        </section>

        <section className="developer-section" id="developers">
          <div><span className="eyebrow">Build with the engine</span><h2>A reference app, typed pack system and headless TypeScript API.</h2><p>Clone the repository, copy the recruitment example, change fields, stages and versioned rules, then preview a custom decision product locally.</p></div>
          <div className="developer-actions"><a className="button button-primary" href="https://github.com/yourvouch/vouch-starter-kit">View on GitHub</a><a className="button button-secondary" href="https://github.com/yourvouch/vouch-starter-kit/stargazers">Star the project</a><a href="https://github.com/yourvouch/vouch-starter-kit/blob/codex/v2-rebuild/docs/BUILD_A_VERTICAL_PACK.md">Build a custom vertical pack →</a></div>
        </section>

        <section className="workflow" aria-labelledby="workflow-title">
          <div className="section-heading"><div><span className="eyebrow">Reference workflow</span><h2 id="workflow-title">Six clear steps. No infrastructure.</h2></div><p>From raw business data to an immutable review you can act on and compare later.</p></div>
          <ol>{steps.map(([title, body], index) => <li key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
        </section>

        <section className="commercial-boundary">
          <div><span className="eyebrow">One product family</span><h2>Transparent foundation. Continuous operation.</h2></div>
          <div><p><strong>Open source includes</strong> local ingestion, normalization, packs, deterministic rules, local workspaces, comparisons, actions, outcomes and exports.</p><p><strong>Commercial Vouch adds</strong> managed deployment, cloud sync, scheduled ingestion, connectors, collaboration, permissions, notifications, automation, audit logs, custom packs, implementation and support.</p><p>Starter Kit proves the intelligence locally. Commercial Vouch operationalizes it continuously.</p><div className="hero-actions"><a className="button button-secondary" href="https://demo.yourvouch.com">Open full Vouch demo</a><a className="button button-secondary" href="https://yourvouch.com">Explore commercial Vouch</a></div></div>
        </section>

        <section className="privacy-band"><h2>Your business data stays yours.</h2><p>Files are parsed in memory and discarded after parsing. Saved workspaces remain in this browser profile until you export or delete them. Telemetry is disabled by default.</p><Link href="/local-data">Privacy and local data →</Link></section>
      </main>
      <footer className="site-footer"><div><strong>Vouch Starter Kit 2.0 Preview</strong><span>Local-first decision intelligence · MIT licensed</span></div><nav aria-label="Footer links"><a href="https://github.com/yourvouch/vouch-starter-kit">GitHub</a><a href="https://demo.yourvouch.com">Full demo</a><a href="https://yourvouch.com">Commercial Vouch</a></nav></footer>
    </>
  );
}

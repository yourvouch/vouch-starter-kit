import Link from "next/link";
import { AppHeader } from "./AppHeader";

const examples = [
  ["interiors", "Interior design & architecture"],
  ["agency", "Agency & consulting"],
  ["saas", "SaaS"],
  ["general-sales", "General sales"],
] as const;

const steps = [
  ["Choose a journey", "Pick the business pack that matches how work moves."],
  ["Use sample or records", "Explore instantly, or parse your CSV/XLSX locally."],
  ["Confirm the evidence", "Review mappings, stages, identity and data limitations."],
  ["Find the break", "See supported risks, missing evidence and what is changing."],
  ["Decide what matters", "Turn priorities and movements into owned actions."],
  ["Observe the outcome", "Compare later reviews without rewriting history."],
];

export function Landing() {
  return (
    <>
      <AppHeader />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Open-source Vouch · Local-first decision intelligence</span>
            <h1>Find where the business journey is breaking—and decide what deserves attention next.</h1>
            <p>Vouch Starter Kit 2.0 turns CSV/XLSX records into explainable priorities, actions, comparisons and observed outcomes. Run it locally, inspect every rule, build an industry pack or embed the engine in your own stack.</p>
            <div className="entry-modes">
              <article>
                <span>Explore in 30 seconds</span>
                <h2>Trace a finished journey.</h2>
                <p>Open two review periods, see the break points, compare movement and inspect observed outcomes. Nothing is uploaded.</p>
                <Link className="button button-primary" href="/examples/interiors">Explore a completed review</Link>
              </article>
              <article>
                <span>I have business records</span>
                <h2>Decide what needs attention.</h2>
                <p>Your source file stays in this browser and is discarded after parsing. Saved reviews use local IndexedDB.</p>
                <Link className="button button-secondary" href="/review">Use my CSV or XLSX</Link>
              </article>
            </div>
            <ul className="trust" aria-label="Product commitments"><li>No signup</li><li>No backend</li><li>Inspect rules</li><li>Local processing</li><li>MIT licensed</li></ul>
          </div>
          <div className="hero-preview" aria-label="Founder Decision Review preview">
            <div className="preview-head"><strong>Founder Decision Review</strong><span>From break point to owned action</span></div>
            <div className="journey-trace" aria-label="Example customer journey">
              <span><b>01</b> Enquiry arrives</span>
              <span><b>02</b> Someone responds</span>
              <span className="journey-break"><b>03</b> Next step becomes unclear <em>Possible break</em></span>
              <span><b>04</b> Owner acts</span>
            </div>
            <div className="preview-metrics"><div><b>3</b><span>priorities need attention</span></div><div><b>2</b><span>review periods</span></div><div><b>Measured</b><span>associated outcomes</span></div></div>
          </div>
        </section>

        <section className="product-map" aria-labelledby="product-map-title">
          <div className="section-heading"><div><span className="eyebrow">One Vouch product family</span><h2 id="product-map-title">Start with the surface that matches your question.</h2></div><p>Every path uses the same idea: find the break, decide what deserves attention and test a clearer next action.</p></div>
          <div className="product-map-grid">
            <a href="https://demo.yourvouch.com"><span>Problem Lab · 60–90 seconds</span><strong>I want to trace a customer journey</strong><p>Identify a likely break without uploading business data.</p></a>
            <a href="https://demo.yourvouch.com/data-lab"><span>Data Lab · guided demo</span><strong>I already have enquiry records</strong><p>See how Vouch turns existing records into a small number of decisions.</p></a>
            <Link className="current" href="/review"><span>Starter Kit · open source</span><strong>I want to run Vouch locally</strong><p>Analyse files, inspect rules, save reviews and compare outcomes in your browser.</p></Link>
            <a href="https://yourvouch.com/#contact"><span>Commercial Vouch · working session</span><strong>I want to fix a repeated business break</strong><p>Work with Vouch on a journey, implementation and operating experiment.</p></a>
          </div>
        </section>

        <section className="example-section" aria-labelledby="examples-heading">
          <div className="section-heading"><div><span className="eyebrow">Shareable industry examples</span><h2 id="examples-heading">See how the same method works across business journeys.</h2></div><p>Each stable URL opens a finished workspace with two reviews, actions and outcomes—ready to inspect or share.</p></div>
          <div className="example-links">{examples.map(([slug, name]) => <Link key={slug} href={`/examples/${slug}`}><strong>{name}</strong><span>Find the break → decide → act → observe</span></Link>)}</div>
          <Link className="community-example" href="/examples/recruitment"><strong>Developer example: Recruitment Agency</strong><span>A fifth declarative pack demonstrating community extensibility →</span></Link>
        </section>

        <section className="ecosystem-section" id="ecosystem" aria-labelledby="ecosystem-title">
          <div className="section-heading"><div><span className="eyebrow">Build with Vouch</span><h2 id="ecosystem-title">Use the engine in your own data, industry and stack.</h2></div><p>The deterministic core is separated from parsing, storage and React so you can adopt only what you need.</p></div>
          <div className="ecosystem-grid">
            <article><span>For developers</span><h3>Embed the headless TypeScript API.</h3><p>Pass rows, a validated pack and mappings. Receive a JSON-serializable review with evidence and honest unavailable states.</p><a href="https://github.com/yourvouch/vouch-starter-kit/blob/v2.0.0-preview/docs/EMBEDDING.md">Read the embedding guide →</a></article>
            <article><span>For industry experts</span><h3>Build a vertical decision pack.</h3><p>Define fields, stages, aliases and versioned rules without hiding how a priority was produced.</p><a href="https://github.com/yourvouch/vouch-starter-kit/blob/v2.0.0-preview/docs/BUILD_A_VERTICAL_PACK.md">Build your first pack →</a></article>
            <article><span>For consultants and teams</span><h3>Deploy a branded local-first review.</h3><p>Fork the reference experience, preserve the privacy boundary and adapt the workflow to a repeated business journey.</p><a href="https://github.com/yourvouch/vouch-starter-kit/blob/v2.0.0-preview/docs/DEPLOYMENT.md">Review deployment options →</a></article>
          </div>
          <div className="github-callout">
            <div><span className="eyebrow">Open source · MIT licensed</span><h3>Help make business decision intelligence inspectable.</h3><p>Star the repository, try an example, improve a mapping or contribute a pack for the industry you understand.</p></div>
            <div className="developer-actions"><a className="button button-primary" href="https://github.com/yourvouch/vouch-starter-kit">View on GitHub</a><a className="button button-secondary" href="https://github.com/yourvouch/vouch-starter-kit/stargazers">Star Vouch Starter Kit</a><a href="https://github.com/yourvouch/vouch-starter-kit/issues">Find an issue to contribute →</a></div>
          </div>
        </section>

        <section className="workflow" aria-labelledby="workflow-title">
          <div className="section-heading"><div><span className="eyebrow">Reference workflow</span><h2 id="workflow-title">From business journey to observed outcome.</h2></div><p>Six explainable steps, no signup and no infrastructure required.</p></div>
          <ol>{steps.map(([title, body], index) => <li key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
        </section>

        <section className="commercial-boundary">
          <div><span className="eyebrow">Open-source foundation</span><h2>Transparent locally. Operational with Vouch.</h2></div>
          <div><p><strong>Starter Kit includes</strong> local ingestion, normalization, packs, deterministic rules, local workspaces, comparisons, actions, outcomes and exports.</p><p><strong>Commercial Vouch adds</strong> guided implementation, managed deployment, cloud sync, connectors, collaboration, automation, operating cadence and support.</p><p>The Starter Kit makes the decision method inspectable. Commercial Vouch helps a business apply it to a repeated journey.</p><div className="hero-actions"><a className="button button-secondary" href="https://demo.yourvouch.com">Try the Problem Lab</a><a className="button button-secondary" href="https://yourvouch.com/#contact">Request a working session</a></div></div>
        </section>

        <section className="privacy-band"><h2>Your business data stays yours.</h2><p>Files are parsed in memory and discarded after parsing. Saved workspaces remain in this browser profile until you export or delete them. Telemetry is disabled by default.</p><Link href="/local-data">Privacy and local data →</Link></section>
      </main>
      <footer className="site-footer"><div><strong>Vouch Starter Kit 2.0 Preview</strong><span>Open-source business decision intelligence · Local-first · MIT licensed</span></div><nav aria-label="Footer links"><a href="https://github.com/yourvouch/vouch-starter-kit">GitHub</a><a href="https://github.com/yourvouch/vouch-starter-kit/stargazers">Star</a><a href="https://demo.yourvouch.com">Problem Lab</a><a href="https://demo.yourvouch.com/data-lab">Data Lab</a><a href="https://yourvouch.com">Commercial Vouch</a></nav></footer>
    </>
  );
}

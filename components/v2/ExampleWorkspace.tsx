import Link from "next/link";
import { founderPriorities, reviewRiskSummary } from "@/lib/v2/intelligence";
import type { ExamplePackId } from "@/lib/v2/examples";
import { buildExampleWorkspace } from "@/lib/v2/examples";
import { AppHeader } from "./AppHeader";

const money = (value: number | undefined) => value == null ? "Unavailable" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(value);

export function ExampleWorkspace({ packId }: { packId: ExamplePackId }) {
  const example = buildExampleWorkspace(packId);
  const priorities = founderPriorities(example.current.opportunities, example.current.assessments);
  const risk = reviewRiskSummary(example.current.opportunities, example.current.assessments);
  const movements = example.comparison.matches.flatMap((match) => match.movements);
  return (
    <>
      <AppHeader />
      <main className="example-workspace">
        <div className="sample-notice" role="status">
          <strong>You are exploring a prebuilt local workspace.</strong>
          <span>Nothing has been uploaded. This deterministic example does not need IndexedDB before rendering.</span>
        </div>
        <header className="example-heading">
          <div>
            <span>Completed sample workspace · {example.pack.category} pack</span>
            <h1>{example.pack.name}</h1>
            <p>Two review periods, a comparison, actions, measured outcomes, supported evidence and honest missing-evidence states.</p>
          </div>
          <div className="example-actions">
            <Link className="button button-primary" href={`/review?pack=${packId}`}>Use my data</Link>
            <a className="button button-secondary" href="https://github.com/yourvouch/vouch-starter-kit/blob/codex/v2-rebuild/docs/BUILD_A_VERTICAL_PACK.md">Inspect this pack</a>
          </div>
        </header>
        <section className="review-metrics" aria-label="Sample review metrics">
          <div><b>{priorities.length}</b><span>priorities</span><small>{example.current.opportunities.length} opportunities evaluated</small></div>
          <div><b>{money(risk.valueIncluded)}</b><span>conservative value at risk</span><small>{risk.includedCount} evidence-supported records</small></div>
          <div><b>{example.actions.filter((action) => !["Completed", "Dismissed"].includes(action.status)).length}</b><span>open actions</span><small>{example.actions.filter((action) => action.outcome !== "Not yet measured").length} measured</small></div>
        </section>
        <div className="example-grid">
          <section>
            <div className="list-title"><h2>Founder priorities</h2><span>Latest review · {example.current.reviewDate}</span></div>
            {priorities.map(({ opportunity, assessment }) => <article className="example-row" key={opportunity.id}><div><strong>{opportunity.name}</strong><span>{opportunity.stage ?? "Unknown stage"} · {assessment.band} · {assessment.score}/100</span></div><p>{assessment.rules[0]?.evidence ?? assessment.unavailableChecks[0] ?? "No supported risk evidence"}</p></article>)}
          </section>
          <section>
            <div className="list-title"><h2>What changed</h2><span>{example.previous.reviewDate} → {example.current.reviewDate}</span></div>
            <div className="movement-tags">{Array.from(new Set(movements)).map((movement) => <span key={movement}>{movement}</span>)}</div>
            <h3>Saved actions and outcomes</h3>
            {example.actions.map((action) => <article className="example-row" key={action.id}><div><strong>{action.title}</strong><span>{action.status} · {action.source}</span></div><p>{action.outcomeEvidence ?? "Outcome will be measured against a later saved review."}</p></article>)}
          </section>
        </div>
        <section className="developer-details">
          <div><span>Pack</span><strong>{example.pack.id}@{example.pack.version}</strong></div>
          <div><span>Rules</span><strong>{example.pack.rules.length} versioned rules</strong></div>
          <div><span>Comparison</span><strong>{example.comparison.matches.length} deterministic matches</strong></div>
          <div><span>Privacy</span><strong>Prebuilt data only</strong></div>
        </section>
      </main>
    </>
  );
}

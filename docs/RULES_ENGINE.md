# Rules engine

Rules are deterministic, versioned and pack-specific.

## Evaluation

`assessOpportunity` evaluates only open records, stores every triggered rule and reports checks that could not run. Missing data alone does not become strong business risk. Supported follow-up risk requires stage, value, activity, close, visit/start/proposal or stale-duration evidence.

## Evidence details

Operator copy is concise. Evidence details show source support, normalized values, rule id/version, confidence and why checks did not run. Developer mode masks direct contacts and exposes pack/version, normalized structure and identity metadata.

## Scoring

Weights add to a maximum score of 100. Bands are low, medium, high and critical. Value at risk is a separate conservative calculation; owner/contact gaps and unsupported missing follow-up do not add monetary exposure.

## Extending

Add declarations in a pack and deterministic evaluation in `intelligence.ts`. Portable pack JSON cannot carry custom executable evaluators. That limitation prevents code injection and is intentional.

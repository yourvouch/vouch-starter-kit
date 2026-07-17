import type { Assessment, Opportunity, PriorityBand, TriggeredRule, VerticalPack } from "./domain";

const daysBetween = (from: string, to: string) => Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
const bandFor = (score: number): PriorityBand => score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";
const ADVANCED_STAGE = /proposal|negotiation|commercial|execution|procurement|contract|trial|evaluation|site visit/i;
const BUSINESS_RISK_FACTORS: Record<string, number> = { "overdue-follow-up": .35, inactive: .3, "overdue-close": .25, "proposal-silence": .25, "trial-ending": .25, "site-visit-gap": .15, "missing-follow-up": .1 };

export function assessOpportunity(opportunity: Opportunity, reviewDate: string, pack: VerticalPack): Assessment {
  if (opportunity.lifecycle !== "open") return { opportunityId: opportunity.id, score: 0, band: "low", confidence: "high", rules: [], unavailableChecks: [], recommendedNextStep: "No active-pipeline action", excludedReason: `${opportunity.lifecycle} records are excluded from active scoring` };
  const rules: TriggeredRule[] = []; const unavailableChecks: string[] = [];
  const add = (id: string, evidence: string, nextStep: string) => { const rule = pack.rules.find((item) => item.id === id); if (rule) rules.push({ id, label: rule.label, weight: rule.weight, evidence, nextStep }); };
  if (!opportunity.owner) add("missing-owner", "No owner is stored", "Assign an accountable owner");
  if (!opportunity.email && !opportunity.phone) add("missing-contact", "Neither email nor phone is stored", "Add a reliable contact route");
  if (opportunity.nextFollowUp && opportunity.nextFollowUp < reviewDate) add("overdue-follow-up", `Follow-up was due ${opportunity.nextFollowUp}`, "Re-engage and set a new follow-up");
  const knownInactiveDays = opportunity.lastActivity ? daysBetween(opportunity.lastActivity, reviewDate) : undefined;
  const followUpSupport = Boolean(ADVANCED_STAGE.test(opportunity.stage ?? "") || (opportunity.value != null && opportunity.value >= 100000) || opportunity.lastActivity || opportunity.expectedClose && opportunity.expectedClose < reviewDate || opportunity.vertical.siteVisit || opportunity.vertical.startDate || opportunity.vertical.proposalSent || knownInactiveDays != null && knownInactiveDays >= 30);
  if (!opportunity.nextFollowUp && followUpSupport) add("missing-follow-up", "No next follow-up is stored despite supporting activity, stage, date, or value evidence", "Set a dated next step");
  else if (!opportunity.nextFollowUp) unavailableChecks.push("Follow-up risk is data-limited: no supporting activity, stage, date, or value evidence");
  if (knownInactiveDays != null && knownInactiveDays >= 30) add("inactive", `No activity for ${knownInactiveDays} days`, "Contact the opportunity and record the outcome");
  else if (!opportunity.lastActivity) unavailableChecks.push("Inactivity unavailable: last activity is not stored");
  if (opportunity.expectedClose && opportunity.expectedClose < reviewDate) add("overdue-close", `Expected close was ${opportunity.expectedClose}`, "Confirm or revise the expected close");
  else if (!opportunity.expectedClose) unavailableChecks.push("Expected-close timing unavailable: date is not stored");
  if (pack.id === "interiors" && ["site visit", "design proposal", "commercial proposal"].includes(opportunity.stage?.toLowerCase() ?? "") && !opportunity.vertical.siteVisit) add("site-visit-gap", "No site visit is recorded for an advanced project", "Confirm the site visit and project constraints");
  if (pack.id === "agency" && opportunity.stage?.toLowerCase() === "proposal" && knownInactiveDays != null && knownInactiveDays >= 14) add("proposal-silence", "Proposal has had no recent activity", "Ask for a decision or objection");
  if (pack.id === "saas" && opportunity.vertical.trialEnd && String(opportunity.vertical.trialEnd) <= reviewDate && !opportunity.nextFollowUp) add("trial-ending", "Trial ended without a stored next step", "Schedule a trial outcome review");
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0) + (opportunity.value && rules.some((rule) => rule.id === "inactive") ? 8 : 0));
  const riskRules = rules.filter((rule) => BUSINESS_RISK_FACTORS[rule.id] && !["missing-owner", "missing-contact"].includes(rule.id));
  const riskFactor = Math.min(.6, riskRules.reduce((sum, rule) => sum + BUSINESS_RISK_FACTORS[rule.id], 0));
  const valueAtRisk = opportunity.value != null && riskFactor > 0 && riskRules.some((rule) => rule.id !== "missing-follow-up") ? Math.round(opportunity.value * riskFactor) : undefined;
  return { opportunityId: opportunity.id, score, band: bandFor(score), confidence: unavailableChecks.length > 1 ? "low" : unavailableChecks.length ? "medium" : "high", rules, unavailableChecks, recommendedNextStep: rules.find((rule) => !["missing-owner", "missing-contact"].includes(rule.id))?.nextStep ?? rules[0]?.nextStep ?? "Continue the current plan", valueAtRisk, valueAtRiskFactor: valueAtRisk == null ? undefined : riskFactor, riskBasis: riskRules.map((rule) => rule.label) };
}

export function founderPriorities(opportunities: Opportunity[], assessments: Assessment[]) {
  const byId = new Map(opportunities.map((item) => [item.id, item]));
  return assessments.filter((item) => !item.excludedReason && item.score >= 25).sort((a, b) => b.score - a.score).slice(0, 5).map((assessment) => ({ assessment, opportunity: byId.get(assessment.opportunityId)! }));
}

export function reviewRiskSummary(opportunities: Opportunity[], assessments: Assessment[]) {
  const open = opportunities.filter((item) => item.lifecycle === "open"); const byId = new Map(opportunities.map((item) => [item.id, item])); const included = assessments.filter((item) => item.valueAtRisk != null); const monetary = open.filter((item) => item.value != null);
  return { openPipelineValue: monetary.length ? monetary.reduce((sum, item) => sum + item.value!, 0) : undefined, evaluatedCount: open.length, includedCount: included.length, valueIncluded: included.length ? included.reduce((sum, item) => sum + item.valueAtRisk!, 0) : undefined, appliedRiskFactors: Array.from(new Set(included.flatMap((item) => item.riskBasis ?? []))), excludedCount: open.length - included.length, unavailableMonetaryCount: open.filter((item) => item.value == null).length, includedOpportunityValue: included.reduce((sum, item) => sum + (byId.get(item.opportunityId)?.value ?? 0), 0) };
}

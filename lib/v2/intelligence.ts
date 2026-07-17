import type { Assessment, Opportunity, PriorityBand, TriggeredRule, VerticalPack } from "./domain";

const daysBetween = (from: string, to: string) => Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
const bandFor = (score: number): PriorityBand => score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";

export function assessOpportunity(opportunity: Opportunity, reviewDate: string, pack: VerticalPack): Assessment {
  if (opportunity.lifecycle !== "open") return { opportunityId: opportunity.id, score: 0, band: "low", confidence: "high", rules: [], unavailableChecks: [], recommendedNextStep: "No active-pipeline action", excludedReason: `${opportunity.lifecycle} records are excluded from active scoring` };
  const rules: TriggeredRule[] = [];
  const add = (id: string, evidence: string, nextStep: string) => { const rule = pack.rules.find((item) => item.id === id); if (rule) rules.push({ id, label: rule.label, weight: rule.weight, evidence, nextStep }); };
  if (!opportunity.owner) add("missing-owner", "No owner is stored", "Assign an accountable owner");
  if (!opportunity.email && !opportunity.phone) add("missing-contact", "Neither email nor phone is stored", "Add a reliable contact route");
  if (opportunity.nextFollowUp && opportunity.nextFollowUp < reviewDate) add("overdue-follow-up", `Follow-up was due ${opportunity.nextFollowUp}`, "Re-engage and set a new follow-up");
  if (!opportunity.nextFollowUp) add("missing-follow-up", "No next follow-up is stored", "Set a dated next step");
  if (opportunity.lastActivity && daysBetween(opportunity.lastActivity, reviewDate) >= 30) add("inactive", `No activity for ${daysBetween(opportunity.lastActivity, reviewDate)} days`, "Contact the opportunity and record the outcome");
  if (opportunity.expectedClose && opportunity.expectedClose < reviewDate) add("overdue-close", `Expected close was ${opportunity.expectedClose}`, "Confirm or revise the expected close");
  if (pack.id === "interiors" && ["site visit", "design proposal", "commercial proposal"].includes(opportunity.stage?.toLowerCase() ?? "") && !opportunity.vertical.siteVisit) add("site-visit-gap", "No site visit is recorded", "Confirm the site visit and project constraints");
  if (pack.id === "agency" && opportunity.stage?.toLowerCase() === "proposal" && opportunity.lastActivity && daysBetween(opportunity.lastActivity, reviewDate) >= 14) add("proposal-silence", "Proposal has had no recent activity", "Ask for a decision or objection");
  if (pack.id === "saas" && opportunity.vertical.trialEnd && String(opportunity.vertical.trialEnd) <= reviewDate && !opportunity.nextFollowUp) add("trial-ending", "Trial ended without a stored next step", "Schedule a trial outcome review");
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0) + (opportunity.value && rules.some((r) => r.id === "inactive") ? 10 : 0));
  const unavailableChecks = [!opportunity.lastActivity && "Inactivity (last activity unavailable)", !opportunity.expectedClose && "Expected-close timing (date unavailable)"].filter(Boolean) as string[];
  return { opportunityId: opportunity.id, score, band: bandFor(score), confidence: unavailableChecks.length > 1 ? "low" : unavailableChecks.length ? "medium" : "high", rules, unavailableChecks, recommendedNextStep: rules[0]?.nextStep ?? "Continue the current plan", valueAtRisk: score >= 50 && opportunity.value != null ? opportunity.value : undefined };
}

export function founderPriorities(opportunities: Opportunity[], assessments: Assessment[]) {
  const byId = new Map(opportunities.map((item) => [item.id, item]));
  return assessments.filter((item) => !item.excludedReason && item.score >= 25).sort((a, b) => b.score - a.score).slice(0, 5).map((assessment) => ({ assessment, opportunity: byId.get(assessment.opportunityId)! }));
}

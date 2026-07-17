import type { FieldDefinition, PackId, StageDefinition, VerticalPack } from "./domain";

const shared: FieldDefinition[] = [
  ["opportunityId", "Opportunity ID", "recommended", ["id", "deal id", "lead id"], "Stable source identifier"],
  ["name", "Opportunity name", "required", ["name", "deal", "opportunity", "lead name"], "Human-readable opportunity"],
  ["company", "Company", "recommended", ["company", "account", "client"], "Business or account"],
  ["email", "Email", "recommended", ["email", "email address"], "Primary email contact"],
  ["phone", "Phone", "recommended", ["phone", "mobile", "contact number"], "Primary phone contact"],
  ["value", "Value", "recommended", ["value", "amount", "revenue", "deal value"], "Stored monetary value"],
  ["currency", "Currency", "optional", ["currency", "currency code"], "ISO currency or symbol"],
  ["stage", "Stage", "required", ["stage", "pipeline stage", "phase"], "Pipeline stage"],
  ["status", "Status", "recommended", ["status", "deal status"], "Open, won, or lost status"],
  ["owner", "Owner", "recommended", ["owner", "salesperson", "assignee"], "Accountable person"],
  ["source", "Source", "optional", ["source", "lead source", "channel"], "Acquisition source"],
  ["createdDate", "Created date", "optional", ["created", "created date"], "Opportunity creation date"],
  ["lastActivity", "Last activity", "recommended", ["last activity", "last contacted", "updated"], "Most recent activity"],
  ["nextFollowUp", "Next follow-up", "recommended", ["next follow up", "follow-up", "follow up date"], "Committed next contact"],
  ["expectedClose", "Expected close", "optional", ["expected close", "close date"], "Expected decision date"],
].map(([key, label, importance, aliases, description]) => ({ key, label, importance, aliases, description } as FieldDefinition));

const extra = (key: string, label: string, importance: "recommended" | "optional", aliases: string[]): FieldDefinition => ({ key, label, importance, aliases, description: `${label} for vertical-specific intelligence` });
const commonRules = [
  { id: "missing-owner", label: "Missing owner", description: "Open opportunity has no accountable owner", weight: 18 },
  { id: "missing-contact", label: "Missing contact", description: "Neither email nor phone is available", weight: 16 },
  { id: "overdue-follow-up", label: "Overdue follow-up", description: "Next follow-up is before the review date", weight: 28 },
  { id: "missing-follow-up", label: "Missing follow-up", description: "Open opportunity has no next follow-up", weight: 15 },
  { id: "inactive", label: "Inactivity", description: "No activity for at least 30 days", weight: 22 },
  { id: "overdue-close", label: "Overdue expected close", description: "Expected close is before review date", weight: 16 },
  { id: "uncertain-lifecycle", label: "Uncertain lifecycle", description: "Status cannot be confidently classified", weight: 12 },
];

const sample = (stage: string, date: string) => [
  { "Opportunity ID": "OP-101", Name: "Aster expansion", Company: "Aster", Value: "₹12,50,000", Stage: stage, Owner: "Meera", "Last Activity": date, "Next Follow Up": "2026-07-10" },
  { "Opportunity ID": "OP-102", Name: "Northstar rollout", Company: "Northstar", Value: "₹6,10,000", Stage: "Proposal", Owner: "", "Last Activity": "2026-05-01", "Next Follow Up": "" },
];
const stages = (open: string[], won: string, lost: string): StageDefinition[] => [...open.map((name, order) => ({ name, order, lifecycle: "open" as const })), { name: won, order: open.length, lifecycle: "won" }, { name: lost, order: open.length + 1, lifecycle: "lost" }];

export const verticalPacks: Record<PackId, VerticalPack> = {
  general: { id: "general", name: "General sales", description: "Flexible sales and opportunity pipelines", fields: shared, stages: stages(["Lead", "Qualified", "Proposal", "Negotiation"], "Won", "Lost"), rules: commonRules, samples: { previous: sample("Qualified", "2026-06-10"), current: sample("Negotiation", "2026-07-05") } },
  interiors: { id: "interiors", name: "Interior design & architecture", description: "Projects from enquiry through handover", fields: [...shared, extra("projectType", "Project type", "recommended", ["project type", "service"]), extra("siteVisit", "Site visit", "optional", ["site visit", "site visit date"]), extra("designFee", "Design fee", "optional", ["design fee", "fee"])], stages: stages(["Enquiry", "Consultation", "Site visit", "Design proposal", "Commercial proposal", "Execution"], "Handover", "Lost"), rules: [...commonRules, { id: "site-visit-gap", label: "Site visit gap", description: "Qualified project has no recorded site visit", weight: 12 }], samples: { previous: sample("Consultation", "2026-06-10"), current: sample("Design proposal", "2026-07-05") } },
  agency: { id: "agency", name: "Agency & consulting", description: "Retainers, projects, proposals, and renewals", fields: [...shared, extra("serviceLine", "Service line", "recommended", ["service", "service line"]), extra("engagementType", "Engagement type", "optional", ["engagement", "engagement type"]), extra("proposalSent", "Proposal sent", "optional", ["proposal sent", "proposal date"])], stages: stages(["Lead", "Discovery", "Qualified", "Proposal", "Negotiation", "Contracting"], "Won", "Lost"), rules: [...commonRules, { id: "proposal-silence", label: "Proposal silence", description: "Proposal has no recent activity", weight: 14 }], samples: { previous: sample("Discovery", "2026-06-10"), current: sample("Proposal", "2026-07-05") } },
  saas: { id: "saas", name: "SaaS", description: "Trials, subscriptions, expansions, and renewals", fields: [...shared, extra("plan", "Plan", "recommended", ["plan", "tier"]), extra("mrr", "MRR", "recommended", ["mrr", "monthly recurring revenue"]), extra("trialEnd", "Trial end", "optional", ["trial end", "trial ends"]), extra("seats", "Seats", "optional", ["seats", "licenses"])], stages: stages(["Lead", "Demo", "Trial", "Evaluation", "Procurement"], "Customer", "Churned"), rules: [...commonRules, { id: "trial-ending", label: "Trial ending", description: "Trial end is near without a next step", weight: 18 }], samples: { previous: sample("Demo", "2026-06-10"), current: sample("Trial", "2026-07-05") } },
};

export const getPack = (id: PackId) => verticalPacks[id];

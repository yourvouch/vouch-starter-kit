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
  { id: "missing-owner", label: "Missing owner", description: "Open opportunity has no accountable owner", weight: 6 },
  { id: "missing-contact", label: "Missing contact", description: "Neither email nor phone is available", weight: 6 },
  { id: "overdue-follow-up", label: "Overdue follow-up", description: "Next follow-up is before the review date", weight: 28 },
  { id: "missing-follow-up", label: "Missing follow-up", description: "Supported open opportunity has no next follow-up", weight: 10 },
  { id: "inactive", label: "Inactivity", description: "No activity for at least 30 days", weight: 22 },
  { id: "overdue-close", label: "Overdue expected close", description: "Expected close is before review date", weight: 16 },
  { id: "uncertain-lifecycle", label: "Uncertain lifecycle", description: "Status cannot be confidently classified", weight: 12 },
];

const sample = (stage: string, date: string) => [
  { "Opportunity ID": "OP-101", Name: "Aster expansion", Company: "Aster", Value: "₹12,50,000", Stage: stage, Owner: "Meera", "Last Activity": date, "Next Follow Up": "2026-07-10" },
  { "Opportunity ID": "OP-102", Name: "Northstar rollout", Company: "Northstar", Value: "₹6,10,000", Stage: "Proposal", Owner: "", "Last Activity": "2026-05-01", "Next Follow Up": "" },
];
const interiorSample = (stage: string, date: string) => [
  { "Opportunity ID": "INT-101", "Client Name": "Asha Rao", "Project Type": "Villa", Location: "Pune", Value: "₹12,50,000", Stage: stage, Owner: "Meera", "Last Activity": date, "Next Follow Up": "2026-07-10", "Site Visit": "2026-06-28" },
  { "Opportunity ID": "INT-102", "Client Name": "Northstar Homes", "Project Type": "Apartment", Location: "Mumbai", Value: "₹6,10,000", Stage: "Design proposal", Owner: "", "Last Activity": "2026-05-01", "Next Follow Up": "", "Site Visit": "" },
];
const agencySample = (stage: string, date: string) => sample(stage, date).map((row, index) => ({ ...row, "Service Line": index ? "Brand strategy" : "Growth consulting", "Proposal Sent": index ? "2026-04-24" : "2026-07-01" }));
const saasSample = (stage: string, date: string) => sample(stage, date).map((row, index) => ({ ...row, Plan: index ? "Growth" : "Scale", MRR: index ? "₹55,000" : "₹1,10,000", Seats: index ? "25" : "80" }));
const stages = (open: string[], won: string, lost: string): StageDefinition[] => [...open.map((name, order) => ({ name, order, lifecycle: "open" as const })), { name: won, order: open.length, lifecycle: "won" }, { name: lost, order: open.length + 1, lifecycle: "lost" }];

export const verticalPacks: Record<PackId, VerticalPack> = {
  general: { id: "general", name: "General sales", description: "Flexible sales and opportunity pipelines", fields: shared, stages: stages(["Lead", "Qualified", "Proposal", "Negotiation"], "Won", "Lost"), rules: commonRules, samples: { previous: sample("Qualified", "2026-06-10"), current: sample("Negotiation", "2026-07-05") } },
  interiors: { id: "interiors", name: "Interior design & architecture", description: "Projects from enquiry through handover", fields: [...shared.map((field) => field.key === "name" ? { ...field, importance: "recommended" as const, aliases: ["project name", "opportunity name", "enquiry name", "property name"] } : field.key === "company" ? { ...field, label: "Client / company", aliases: ["client", "client name", "company", "customer"] } : field), extra("projectType", "Project type", "recommended", ["project type", "property type", "service"]), extra("location", "Location", "recommended", ["location", "project location", "site location", "city"]), extra("siteVisit", "Site visit", "optional", ["site visit", "site visit date"]), extra("startDate", "Start date", "optional", ["start date", "project start"]), extra("designFee", "Design fee", "optional", ["design fee", "fee"])], stages: stages(["Enquiry", "Consultation", "Site visit", "Design proposal", "Commercial proposal", "Execution"], "Handover", "Lost"), rules: [...commonRules, { id: "site-visit-gap", label: "Site visit gap", description: "Qualified project has no recorded site visit", weight: 12 }], samples: { previous: interiorSample("Consultation", "2026-06-10"), current: interiorSample("Design proposal", "2026-07-05") } },
  agency: { id: "agency", name: "Agency & consulting", description: "Retainers, projects, proposals, and renewals", fields: [...shared, extra("serviceLine", "Service line", "recommended", ["service", "service line"]), extra("engagementType", "Engagement type", "optional", ["engagement", "engagement type"]), extra("proposalSent", "Proposal sent", "optional", ["proposal sent", "proposal date"])], stages: stages(["Lead", "Discovery", "Qualified", "Proposal", "Negotiation", "Contracting"], "Won", "Lost"), rules: [...commonRules, { id: "proposal-silence", label: "Proposal silence", description: "Proposal has no recent activity", weight: 14 }], samples: { previous: agencySample("Discovery", "2026-06-10"), current: agencySample("Proposal", "2026-07-05") } },
  saas: { id: "saas", name: "SaaS", description: "Trials, subscriptions, expansions, and renewals", fields: [...shared, extra("plan", "Plan", "recommended", ["plan", "tier"]), extra("mrr", "MRR", "recommended", ["mrr", "monthly recurring revenue"]), extra("trialEnd", "Trial end", "optional", ["trial end", "trial ends"]), extra("seats", "Seats", "optional", ["seats", "licenses"])], stages: stages(["Lead", "Demo", "Trial", "Evaluation", "Procurement"], "Customer", "Churned"), rules: [...commonRules, { id: "trial-ending", label: "Trial ending", description: "Trial end is near without a next step", weight: 18 }], samples: { previous: saasSample("Demo", "2026-06-10"), current: saasSample("Trial", "2026-07-05") } },
};

export const getPack = (id: PackId) => verticalPacks[id];

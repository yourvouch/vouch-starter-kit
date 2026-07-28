import type { FieldDefinition, PackId, StageDefinition, VerticalPack } from "./domain";

export const PACK_SCHEMA_VERSION = 1 as const;

export function validatePack(pack: VerticalPack): string[] {
  const errors: string[] = [];
  if (!/^[a-z][a-z0-9-]*$/.test(pack.id)) errors.push("Pack id must be a lowercase slug.");
  if (!pack.name.trim()) errors.push("Pack name is required.");
  if (pack.schemaVersion !== PACK_SCHEMA_VERSION) errors.push(`Unsupported pack schema version ${pack.schemaVersion}.`);
  const duplicateFields = pack.fields.filter((field, index) => pack.fields.findIndex((item) => item.key === field.key) !== index);
  const duplicateStages = pack.stages.filter((stage, index) => pack.stages.findIndex((item) => item.name.toLowerCase() === stage.name.toLowerCase()) !== index);
  const duplicateRules = pack.rules.filter((rule, index) => pack.rules.findIndex((item) => item.id === rule.id) !== index);
  if (duplicateFields.length) errors.push(`Duplicate fields: ${duplicateFields.map((field) => field.key).join(", ")}.`);
  if (duplicateStages.length) errors.push(`Duplicate stages: ${duplicateStages.map((stage) => stage.name).join(", ")}.`);
  if (duplicateRules.length) errors.push(`Duplicate rules: ${duplicateRules.map((rule) => rule.id).join(", ")}.`);
  if (!pack.fields.some((field) => field.importance === "required")) errors.push("At least one required field is needed.");
  if (!pack.stages.some((stage) => stage.lifecycle === "open")) errors.push("At least one open stage is needed.");
  if (!pack.samples.current.length) errors.push("A current sample is required.");
  for (const rule of pack.rules) {
    if (!/^[a-z][a-z0-9-]*$/.test(rule.id)) errors.push(`Rule id "${rule.id}" must be a lowercase slug.`);
    if (!Number.isInteger(rule.version) || rule.version < 1) errors.push(`Rule "${rule.id}" needs a positive integer version.`);
    if (rule.weight < 0 || rule.weight > 100) errors.push(`Rule "${rule.id}" weight must be between 0 and 100.`);
  }
  return errors;
}

export function definePack<T extends VerticalPack>(pack: T): T {
  const errors = validatePack(pack);
  if (errors.length) throw new Error(`Invalid Vouch pack "${pack.id}": ${errors.join(" ")}`);
  return Object.freeze(pack);
}

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
].map((rule) => ({ ...rule, version: 1, evidenceFields: [] }));

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
const recruitmentSample = (stage: string, date: string) => [
  { "Opportunity ID": "REC-101", Name: "Senior product designer · Meridian", Company: "Meridian Labs", "Candidate Name": "Candidate 101", "Role Title": "Senior product designer", Value: "₹3,00,000", Stage: stage, Owner: "Riya", "Last Activity": date, "Next Follow Up": "2026-07-10", "Interview Date": "2026-07-08", "Client Feedback Date": "", "Offer Due": "" },
  { "Opportunity ID": "REC-102", Name: "Finance lead · Northstar", Company: "Northstar Foods", "Candidate Name": "Candidate 102", "Role Title": "Finance lead", Value: "₹2,10,000", Stage: "Client interview", Owner: "", "Last Activity": "2026-05-20", "Next Follow Up": "", "Interview Date": "2026-06-10", "Client Feedback Date": "", "Offer Due": "" },
  { "Opportunity ID": "REC-103", Name: "Engineering manager · Aster", Company: "Aster Systems", "Candidate Name": "Candidate 103", "Role Title": "Engineering manager", Value: "₹4,20,000", Stage: "Offer", Owner: "Kabir", "Last Activity": "2026-06-30", "Next Follow Up": "", "Interview Date": "2026-06-22", "Client Feedback Date": "2026-06-24", "Offer Due": "2026-07-12" },
];
const stages = (open: string[], won: string, lost: string): StageDefinition[] => [...open.map((name, order) => ({ name, order, lifecycle: "open" as const })), { name: won, order: open.length, lifecycle: "won" }, { name: lost, order: open.length + 1, lifecycle: "lost" }];

export const verticalPacks: Record<PackId, VerticalPack> = {
  general: definePack({ id: "general", name: "General sales", description: "Flexible sales and opportunity pipelines", version: "2.0.0", schemaVersion: 1, category: "built-in", maintainer: "Vouch", fields: shared, stages: stages(["Lead", "Qualified", "Proposal", "Negotiation"], "Won", "Lost"), rules: commonRules, samples: { previous: sample("Qualified", "2026-06-10"), current: sample("Negotiation", "2026-07-05") } }),
  interiors: definePack({ id: "interiors", name: "Interior design & architecture", description: "Projects from enquiry through handover", version: "2.0.0", schemaVersion: 1, category: "built-in", maintainer: "Vouch", fields: [...shared.map((field) => field.key === "name" ? { ...field, importance: "recommended" as const, aliases: ["project name", "opportunity name", "enquiry name", "property name"] } : field.key === "company" ? { ...field, label: "Client / company", aliases: ["client", "client name", "company", "customer"] } : field), extra("projectType", "Project type", "recommended", ["project type", "property type", "service"]), extra("location", "Location", "recommended", ["location", "project location", "site location", "city"]), extra("siteVisit", "Site visit", "optional", ["site visit", "site visit date"]), extra("startDate", "Start date", "optional", ["start date", "project start"]), extra("designFee", "Design fee", "optional", ["design fee", "fee"])], stages: stages(["Enquiry", "Consultation", "Site visit", "Design proposal", "Commercial proposal", "Execution"], "Handover", "Lost"), rules: [...commonRules, { id: "site-visit-gap", version: 1, label: "Site visit gap", description: "Qualified project has no recorded site visit", weight: 12, evidenceFields: ["stage", "siteVisit"], missingEvidence: "Site-visit risk could not be evaluated." }], samples: { previous: interiorSample("Consultation", "2026-06-10"), current: interiorSample("Design proposal", "2026-07-05") } }),
  agency: definePack({ id: "agency", name: "Agency & consulting", description: "Retainers, projects, proposals, and renewals", version: "2.0.0", schemaVersion: 1, category: "built-in", maintainer: "Vouch", fields: [...shared, extra("serviceLine", "Service line", "recommended", ["service", "service line"]), extra("engagementType", "Engagement type", "optional", ["engagement", "engagement type"]), extra("proposalSent", "Proposal sent", "optional", ["proposal sent", "proposal date"])], stages: stages(["Lead", "Discovery", "Qualified", "Proposal", "Negotiation", "Contracting"], "Won", "Lost"), rules: [...commonRules, { id: "proposal-silence", version: 1, label: "Proposal silence", description: "Proposal has no recent activity", weight: 14, evidenceFields: ["stage", "lastActivity"], missingEvidence: "Proposal activity could not be evaluated." }], samples: { previous: agencySample("Discovery", "2026-06-10"), current: agencySample("Proposal", "2026-07-05") } }),
  saas: definePack({ id: "saas", name: "SaaS", description: "Trials, subscriptions, expansions, and renewals", version: "2.0.0", schemaVersion: 1, category: "built-in", maintainer: "Vouch", fields: [...shared, extra("plan", "Plan", "recommended", ["plan", "tier"]), extra("mrr", "MRR", "recommended", ["mrr", "monthly recurring revenue"]), extra("trialEnd", "Trial end", "optional", ["trial end", "trial ends"]), extra("seats", "Seats", "optional", ["seats", "licenses"])], stages: stages(["Lead", "Demo", "Trial", "Evaluation", "Procurement"], "Customer", "Churned"), rules: [...commonRules, { id: "trial-ending", version: 1, label: "Trial ending", description: "Trial end is near without a next step", weight: 18, evidenceFields: ["trialEnd", "nextFollowUp"], missingEvidence: "Trial timing could not be evaluated." }], samples: { previous: saasSample("Demo", "2026-06-10"), current: saasSample("Trial", "2026-07-05") } }),
  recruitment: definePack({ id: "recruitment", name: "Recruitment Agency", description: "Roles, candidates, interviews, offers, and placements", version: "1.0.0", schemaVersion: 1, category: "example", maintainer: "Vouch community examples", fields: [...shared, extra("candidateName", "Candidate name", "recommended", ["candidate", "candidate name"]), extra("roleTitle", "Role title", "recommended", ["role", "role title", "job title"]), extra("interviewDate", "Interview date", "optional", ["interview", "interview date"]), extra("clientFeedbackDate", "Client feedback date", "optional", ["client feedback", "feedback date"]), extra("offerDue", "Offer due", "optional", ["offer due", "offer date"])], stages: stages(["Role open", "Sourcing", "Submitted", "Client interview", "Offer"], "Placed", "Closed"), rules: [...commonRules, { id: "client-feedback-wait", version: 1, label: "Client feedback pending", description: "An interviewed candidate has no recorded client feedback", weight: 16, evidenceFields: ["stage", "clientFeedbackDate"], missingEvidence: "Client-feedback timing could not be evaluated." }, { id: "offer-overdue", version: 1, label: "Offer overdue", description: "An offer due date has passed without placement", weight: 22, evidenceFields: ["stage", "offerDue"], missingEvidence: "Offer timing could not be evaluated." }], samples: { previous: recruitmentSample("Submitted", "2026-06-10"), current: recruitmentSample("Client interview", "2026-07-05") } }),
};

export const getPack = (id: PackId) => verticalPacks[id];

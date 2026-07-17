export type PackId = "general" | "interiors" | "agency" | "saas";
export type FieldImportance = "required" | "recommended" | "optional";
export type Lifecycle = "open" | "won" | "lost" | "unknown";
export type PriorityBand = "critical" | "high" | "medium" | "low";

export type CanonicalField =
  | "opportunityId" | "name" | "company" | "email" | "phone" | "value"
  | "currency" | "stage" | "status" | "owner" | "source" | "createdDate"
  | "lastActivity" | "nextFollowUp" | "expectedClose" | string;

export interface FieldDefinition {
  key: CanonicalField;
  label: string;
  importance: FieldImportance;
  aliases: string[];
  description: string;
}

export interface StageDefinition { name: string; order: number; lifecycle: Lifecycle }
export interface IntelligenceRuleDefinition { id: string; label: string; description: string; weight: number }

export interface VerticalPack {
  id: PackId;
  name: string;
  description: string;
  fields: FieldDefinition[];
  stages: StageDefinition[];
  rules: IntelligenceRuleDefinition[];
  samples: { previous: Record<string, string>[]; current: Record<string, string>[] };
}

export interface Opportunity {
  id: string;
  explicitId?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  value?: number;
  currency?: string;
  stage?: string;
  status?: string;
  lifecycle: Lifecycle;
  owner?: string;
  source?: string;
  createdDate?: string;
  lastActivity?: string;
  nextFollowUp?: string;
  expectedClose?: string;
  vertical: Record<string, string | number | undefined>;
  sourceRow: number;
}

export interface TriggeredRule {
  id: string;
  label: string;
  weight: number;
  evidence: string;
  nextStep: string;
}

export interface Assessment {
  opportunityId: string;
  score: number;
  band: PriorityBand;
  confidence: "high" | "medium" | "low";
  rules: TriggeredRule[];
  unavailableChecks: string[];
  recommendedNextStep: string;
  valueAtRisk?: number;
  excludedReason?: string;
}

export interface ReviewSnapshot {
  id: string;
  workspaceId: string;
  packId: PackId;
  reviewDate: string;
  createdAt: string;
  readiness: "full" | "reduced" | "missing-essential";
  opportunities: Opportunity[];
  assessments: Assessment[];
}

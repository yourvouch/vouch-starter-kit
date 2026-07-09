import type { TargetField } from "./types";

export const MAX_PARSE_ROWS = 50_000;

export const TARGET_FIELDS: TargetField[] = [
  {
    id: "name",
    label: "Name",
    synonyms: ["name", "full name", "contact name", "customer name", "client name"],
    description: "Identifies each lead. Not used in any calculation.",
  },
  {
    id: "email",
    label: "Email",
    synonyms: ["email", "e-mail", "email address", "contact email"],
    description: "Used to check contact completeness and find duplicate leads.",
  },
  {
    id: "phone",
    label: "Phone",
    synonyms: ["phone", "phone number", "mobile", "cell", "telephone", "contact number"],
    description: "Used to check contact completeness and find duplicate leads.",
  },
  {
    id: "revenue",
    label: "Revenue",
    synonyms: [
      "revenue",
      "amount",
      "deal value",
      "value",
      "price",
      "total",
      "sales amount",
      "deal size",
      "mrr",
      "arr",
    ],
    description: "Used to calculate pipeline value, average deal size, and revenue by stage.",
  },
  {
    id: "stage",
    label: "Stage",
    synonyms: ["stage", "deal stage", "status", "pipeline stage"],
    description: "Used to group leads into your pipeline stages.",
  },
  {
    id: "owner",
    label: "Owner",
    synonyms: ["owner", "sales rep", "assigned to", "rep", "account owner"],
    description: "Used to track leads assigned to each team member.",
  },
  {
    id: "leadSource",
    label: "Lead Source",
    synonyms: ["lead source", "source", "channel", "origin"],
    description: "Used to identify your best-performing lead sources.",
  },
  {
    id: "date",
    label: "Date",
    synonyms: [
      "date",
      "created date",
      "close date",
      "date added",
      "created at",
      "signup date",
      "last activity",
    ],
    description: "Reserved for future timeline-based insights. Not used yet.",
  },
];

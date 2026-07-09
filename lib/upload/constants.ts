import type { TargetField } from "./types";

export const MAX_PARSE_ROWS = 50_000;

export const TARGET_FIELDS: TargetField[] = [
  {
    id: "name",
    label: "Name",
    synonyms: ["name", "full name", "contact name", "customer name", "client name"],
  },
  {
    id: "email",
    label: "Email",
    synonyms: ["email", "e-mail", "email address", "contact email"],
  },
  {
    id: "phone",
    label: "Phone",
    synonyms: ["phone", "phone number", "mobile", "cell", "telephone", "contact number"],
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
  },
  {
    id: "stage",
    label: "Stage",
    synonyms: ["stage", "deal stage", "status", "pipeline stage"],
  },
  {
    id: "owner",
    label: "Owner",
    synonyms: ["owner", "sales rep", "assigned to", "rep", "account owner"],
  },
  {
    id: "leadSource",
    label: "Lead Source",
    synonyms: ["lead source", "source", "channel", "origin"],
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
  },
];

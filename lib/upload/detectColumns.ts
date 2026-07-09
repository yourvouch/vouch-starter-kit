import { TARGET_FIELDS } from "./constants";
import type { ColumnMapping } from "./types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function detectColumns(headers: string[]): ColumnMapping {
  const mapping = Object.fromEntries(
    TARGET_FIELDS.map((field) => [field.id, null]),
  ) as ColumnMapping;

  const claimed = new Set<string>();
  const candidates = headers.map((header) => ({
    header,
    normalized: normalize(header),
  }));

  // Pass 1: exact match against a known synonym.
  for (const field of TARGET_FIELDS) {
    const normalizedSynonyms = field.synonyms.map(normalize);
    const match = candidates.find(
      ({ header, normalized }) =>
        !claimed.has(header) && normalizedSynonyms.includes(normalized),
    );
    if (match) {
      mapping[field.id] = match.header;
      claimed.add(match.header);
    }
  }

  // Pass 2: partial match, for headers that didn't hit an exact synonym.
  for (const field of TARGET_FIELDS) {
    if (mapping[field.id]) continue;
    const normalizedSynonyms = field.synonyms.map(normalize);
    const match = candidates.find(
      ({ header, normalized }) =>
        !claimed.has(header) &&
        normalizedSynonyms.some(
          (synonym) => normalized.includes(synonym) || synonym.includes(normalized),
        ),
    );
    if (match) {
      mapping[field.id] = match.header;
      claimed.add(match.header);
    }
  }

  return mapping;
}

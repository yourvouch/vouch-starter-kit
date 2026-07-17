import type { CanonicalField, FieldImportance, VerticalPack } from "./domain";
import { normalizeText } from "./normalize";

export interface MappingSuggestion { field: CanonicalField; column?: string; confidence: number; explanation: string; samples: string[]; importance: FieldImportance; ambiguous: string[] }
const canonical = (value: string) => normalizeText(value).toLowerCase().replace(/[_-]+/g, " ");

export function suggestMappings(headers: string[], rows: Record<string, unknown>[], pack: VerticalPack): MappingSuggestion[] {
  const claimed = new Set<string>();
  return pack.fields.map((field) => {
    const matches = headers.map((column) => {
      const normalized = canonical(column);
      const exact = [field.label, field.key, ...field.aliases].some((alias) => canonical(alias) === normalized);
      const partial = field.aliases.some((alias) => normalized.includes(canonical(alias)) || canonical(alias).includes(normalized));
      return { column, score: exact ? 1 : partial ? 0.72 : 0 };
    }).filter((item) => item.score > 0 && !claimed.has(item.column)).sort((a, b) => b.score - a.score);
    const selected = matches[0];
    if (selected) claimed.add(selected.column);
    return { field: field.key, column: selected?.column, confidence: selected?.score ?? 0, explanation: selected ? `${selected.score === 1 ? "Exact" : "Similar"} header match for ${field.label}` : `No reliable header match for ${field.label}`, samples: selected ? rows.slice(0, 3).map((row) => normalizeText(row[selected.column])).filter(Boolean) : [], importance: field.importance, ambiguous: matches.slice(1).map((item) => item.column) };
  });
}

export function mappingReadiness(suggestions: MappingSuggestion[]) {
  const missingRequired = suggestions.filter((item) => item.importance === "required" && !item.column);
  const missingRecommended = suggestions.filter((item) => item.importance === "recommended" && !item.column);
  return missingRequired.length ? "missing-essential" as const : missingRecommended.length > 2 ? "reduced" as const : "full" as const;
}

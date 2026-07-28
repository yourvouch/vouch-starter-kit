import type { ReviewSnapshot, VerticalPack } from "./domain";

export interface SanitizedResultCard {
  schemaVersion: 1;
  title: string;
  packName: string;
  reviewDate: string;
  opportunityCount: number;
  priorityCount: number;
  categories: Record<string, number>;
  localProcessing: true;
  attribution: "Built with Vouch Starter Kit";
  repository: "https://github.com/yourvouch/vouch-starter-kit";
}

export function createSanitizedResultCard(review: ReviewSnapshot, pack: VerticalPack): SanitizedResultCard {
  const attention = review.assessments.filter((assessment) => assessment.score >= 25 && !assessment.excludedReason);
  const categories = attention.flatMap((assessment) => assessment.rules.map((rule) => rule.label))
    .reduce<Record<string, number>>((counts, label) => ({ ...counts, [label]: (counts[label] ?? 0) + 1 }), {});
  return {
    schemaVersion: 1,
    title: `Vouch found ${attention.length} priorities in ${review.opportunities.length} opportunities`,
    packName: pack.name,
    reviewDate: review.reviewDate,
    opportunityCount: review.opportunities.length,
    priorityCount: attention.length,
    categories,
    localProcessing: true,
    attribution: "Built with Vouch Starter Kit",
    repository: "https://github.com/yourvouch/vouch-starter-kit",
  };
}

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
export function resultCardSvg(card: SanitizedResultCard) {
  const categories = Object.entries(card.categories).slice(0, 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" role="img" aria-labelledby="title desc"><title id="title">${escapeXml(card.title)}</title><desc id="desc">A privacy-safe summary generated locally by Vouch Starter Kit.</desc><rect width="1200" height="630" rx="36" fill="#f7f9f7"/><rect x="64" y="64" width="1072" height="502" rx="26" fill="#fff" stroke="#dce2de"/><text x="112" y="132" font-family="Arial" font-size="28" font-weight="700" fill="#075b3a">Vouch Starter Kit</text><text x="112" y="225" font-family="Arial" font-size="48" font-weight="700" fill="#17211c">${escapeXml(card.title)}</text><text x="112" y="280" font-family="Arial" font-size="24" fill="#66706a">${escapeXml(card.packName)} · ${escapeXml(card.reviewDate)}</text>${categories.map(([label, count], index) => `<rect x="${112 + index * 250}" y="342" width="220" height="104" rx="14" fill="#eaf2ed"/><text x="${136 + index * 250}" y="385" font-family="Arial" font-size="19" fill="#66706a">${escapeXml(label.slice(0, 22))}</text><text x="${136 + index * 250}" y="425" font-family="Arial" font-size="32" font-weight="700" fill="#075b3a">${count}</text>`).join("")}<text x="112" y="520" font-family="Arial" font-size="20" fill="#66706a">Processed locally · No source identifiers or record details included</text></svg>`;
}

export function assertSanitizedCard(value: string) {
  const withoutDates = value.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "");
  const forbidden = [/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/i, /mailto:|tel:|filename|sourceRow|companyName|clientName|phone number|email address/i];
  if (forbidden.some((pattern) => pattern.test(withoutDates))) throw new Error("Sanitized result card contains prohibited record-level data.");
  return true;
}

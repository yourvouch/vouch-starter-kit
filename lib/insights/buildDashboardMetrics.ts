import type { ColumnMapping, CsvRow } from "@/lib/upload/types";
import { getAverageDealValue } from "./metrics/averageDealValue";
import { getDuplicateEmailCount } from "./metrics/duplicateEmails";
import { getDuplicatePhoneCount } from "./metrics/duplicatePhones";
import { getMissingEmailCount } from "./metrics/missingEmailCount";
import { getMissingOwnerCount } from "./metrics/missingOwnerCount";
import { getMissingPhoneCount } from "./metrics/missingPhoneCount";
import { getPipelineByStage, getRevenueByStage } from "./metrics/stageBreakdown";
import { getTopLeadSources } from "./metrics/topLeadSources";
import { getTopOwners } from "./metrics/topOwners";
import { getTotalLeads } from "./metrics/totalLeads";
import { getTotalRevenue } from "./metrics/totalRevenue";
import type { DashboardMetrics } from "./types";

export function buildDashboardMetrics(rows: CsvRow[], mapping: ColumnMapping): DashboardMetrics {
  return {
    totalLeads: getTotalLeads(rows),
    totalRevenue: getTotalRevenue(rows, mapping.revenue),
    averageDealValue: getAverageDealValue(rows, mapping.revenue),
    pipelineByStage: getPipelineByStage(rows, mapping.stage),
    missingEmailCount: getMissingEmailCount(rows, mapping.email),
    missingPhoneCount: getMissingPhoneCount(rows, mapping.phone),
    missingOwnerCount: getMissingOwnerCount(rows, mapping.owner),
    duplicateEmailCount: getDuplicateEmailCount(rows, mapping.email),
    duplicatePhoneCount: getDuplicatePhoneCount(rows, mapping.phone),
    topLeadSources: getTopLeadSources(rows, mapping.leadSource),
    topOwners: getTopOwners(rows, mapping.owner, mapping.revenue),
    revenueByStage: getRevenueByStage(rows, mapping.stage, mapping.revenue),
  };
}

import { buildBusinessHealth } from "@/lib/insights/buildBusinessHealth";
import { buildDashboardMetrics } from "@/lib/insights/buildDashboardMetrics";
import { buildInsightSummary } from "@/lib/insights/buildInsightSummary";
import { formatCurrency } from "@/lib/insights/format";
import type { ColumnMapping, CsvRow } from "@/lib/upload/types";
import { BusinessHealthStrip } from "./BusinessHealthStrip";
import { DashboardCard } from "./DashboardCard";
import { InsightSummary } from "./InsightSummary";
import { LeadSourceTable } from "./LeadSourceTable";
import { OwnerTable } from "./OwnerTable";
import { RevenueChart } from "./RevenueChart";
import { StageChart } from "./StageChart";
import { StatCard } from "./StatCard";

interface DashboardProps {
  rows: CsvRow[];
  mapping: ColumnMapping;
}

export function Dashboard({ rows, mapping }: DashboardProps) {
  const metrics = buildDashboardMetrics(rows, mapping);
  const summary = buildInsightSummary(metrics);
  const businessHealth = buildBusinessHealth(metrics, mapping);

  return (
    <div className="w-full space-y-8">
      <BusinessHealthStrip items={businessHealth} />
      <InsightSummary summary={summary} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Leads" value={metrics.totalLeads} />
        <StatCard label="Total Revenue" value={metrics.totalRevenue} format={formatCurrency} />
        <StatCard
          label="Average Deal Value"
          value={metrics.averageDealValue}
          format={formatCurrency}
        />
        <StatCard label="Missing Email" value={metrics.missingEmailCount} />
        <StatCard label="Missing Phone" value={metrics.missingPhoneCount} />
        <StatCard label="Duplicate Emails" value={metrics.duplicateEmailCount} />
        <StatCard label="Duplicate Phones" value={metrics.duplicatePhoneCount} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCard title="Pipeline by Stage" description="Number of leads in each stage">
          <StageChart data={metrics.pipelineByStage} />
        </DashboardCard>
        <DashboardCard title="Revenue by Stage" description="Total revenue in each stage">
          <RevenueChart data={metrics.revenueByStage} />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCard title="Top Lead Sources" description="Where your leads are coming from">
          <LeadSourceTable data={metrics.topLeadSources} />
        </DashboardCard>
        <DashboardCard title="Top Owners" description="Leads and revenue by owner">
          <OwnerTable data={metrics.topOwners} />
        </DashboardCard>
      </div>
    </div>
  );
}

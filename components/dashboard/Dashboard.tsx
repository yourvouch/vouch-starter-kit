import type { BusinessHealthItem } from "@/lib/insights/buildBusinessHealth";
import { formatCurrency } from "@/lib/insights/format";
import { unavailableHelperText } from "@/lib/insights/emptyStateMessages";
import type { DashboardMetrics, InsightSummary } from "@/lib/insights/types";
import { BusinessHealthStrip } from "./BusinessHealthStrip";
import { DashboardCard } from "./DashboardCard";
import { InsightSummary as InsightSummaryPanel } from "./InsightSummary";
import { LeadSourceTable } from "./LeadSourceTable";
import { OwnerTable } from "./OwnerTable";
import { RevenueChart } from "./RevenueChart";
import { StageChart } from "./StageChart";
import { StatCard } from "./StatCard";

interface DashboardProps {
  metrics: DashboardMetrics;
  summary: InsightSummary;
  businessHealth: BusinessHealthItem[];
}

export function Dashboard({ metrics, summary, businessHealth }: DashboardProps) {
  return (
    <div className="w-full space-y-6">
      <BusinessHealthStrip items={businessHealth} />
      <InsightSummaryPanel summary={summary} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={metrics.totalLeads}
          helperText="Total rows parsed from your CSV"
        />
        <StatCard
          label="Total Revenue"
          value={metrics.totalRevenue}
          format={formatCurrency}
          helperText="Pipeline value from mapped revenue column"
          unavailableMessage={unavailableHelperText("Revenue")}
        />
        <StatCard
          label="Average Deal Value"
          value={metrics.averageDealValue}
          format={formatCurrency}
          helperText="Average value per lead in this file"
          unavailableMessage={unavailableHelperText("Revenue")}
        />
        <StatCard
          label="Missing Email"
          value={metrics.missingEmailCount}
          helperText="Leads with no email address on file"
          unavailableMessage={unavailableHelperText("Email")}
        />
        <StatCard
          label="Missing Phone"
          value={metrics.missingPhoneCount}
          helperText="Leads with no phone number on file"
          unavailableMessage={unavailableHelperText("Phone")}
        />
        <StatCard
          label="Duplicate Emails"
          value={metrics.duplicateEmailCount}
          helperText="Repeated email addresses found in this file"
          unavailableMessage={unavailableHelperText("Email")}
        />
        <StatCard
          label="Duplicate Phones"
          value={metrics.duplicatePhoneCount}
          helperText="Repeated phone numbers found in this file"
          unavailableMessage={unavailableHelperText("Phone")}
        />
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

"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/insights/format";
import { NOT_AVAILABLE_LABEL, type Metric, type StageBucket } from "@/lib/insights/types";
import { EmptyMetricState } from "./EmptyMetricState";

interface StageChartProps {
  data: Metric<StageBucket[]>;
}

export function StageChart({ data }: StageChartProps) {
  if (!data.available) {
    return <EmptyMetricState message={NOT_AVAILABLE_LABEL} />;
  }

  if (data.value.length === 0) {
    return <EmptyMetricState message="No stage data found" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.value} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis
            dataKey="stage"
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-zinc-500 dark:text-zinc-400"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-zinc-500 dark:text-zinc-400"
            width={40}
          />
          <Tooltip formatter={(value) => formatNumber(Number(value))} />
          <Bar dataKey="count" name="Leads" fill="#18181b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

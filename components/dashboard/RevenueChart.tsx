"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/insights/format";
import { NOT_AVAILABLE_LABEL, type Metric, type StageRevenueBucket } from "@/lib/insights/types";
import { EmptyMetricState } from "./EmptyMetricState";

interface RevenueChartProps {
  data: Metric<StageRevenueBucket[]>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data.available) {
    return <EmptyMetricState message={NOT_AVAILABLE_LABEL} />;
  }

  if (data.value.length === 0) {
    return <EmptyMetricState message="No revenue data found" />;
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
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-zinc-500 dark:text-zinc-400"
            width={72}
          />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

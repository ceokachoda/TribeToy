"use client";

import dynamic from "next/dynamic";

const CHART_HEIGHT = 256;

function ChartSkeleton() {
  return (
    <div
      className="w-full rounded-xl bg-slate-100 animate-pulse"
      style={{ height: CHART_HEIGHT }}
      aria-hidden
    />
  );
}

export const RevenueTrendChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.RevenueTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

export const OrdersTrendChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.OrdersTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

export const CategorySplitChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.CategorySplitChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

import MetricsDashboard from "@/components/MetricsDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard · FocusMind Experimento",
  robots: { index: false },
};

export default function MetricsPage() {
  return <MetricsDashboard />;
}

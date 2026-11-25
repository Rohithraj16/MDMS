import { useMemo, useState } from "react";
import DataTable, {
  type DataTableColumn,
} from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge, {
  type StatusBadgeTone,
} from "../../../shared/components/StatusBadge";
import Tabs, { type TabItem } from "../../../shared/components/Tabs";

type MeterStatus = "Active" | "Inactive" | "Maintenance";
type MeterFilter = "all" | MeterStatus;

interface MeterRow {
  id: string;
  zone: string;
  status: MeterStatus;
  readingKwh: number;
  lastUpdated: string;
}

const previewMeters: MeterRow[] = [
  {
    id: "MTR-1001",
    zone: "North",
    status: "Active",
    readingKwh: 1284,
    lastUpdated: "2026-11-24",
  },
  {
    id: "MTR-1002",
    zone: "South",
    status: "Maintenance",
    readingKwh: 947,
    lastUpdated: "2026-11-23",
  },
  {
    id: "MTR-1003",
    zone: "East",
    status: "Inactive",
    readingKwh: 1532,
    lastUpdated: "2026-11-22",
  },
  {
    id: "MTR-1004",
    zone: "West",
    status: "Active",
    readingKwh: 1108,
    lastUpdated: "2026-11-24",
  },
  {
    id: "MTR-1005",
    zone: "North",
    status: "Active",
    readingKwh: 1765,
    lastUpdated: "2026-11-21",
  },
  {
    id: "MTR-1006",
    zone: "South",
    status: "Inactive",
    readingKwh: 832,
    lastUpdated: "2026-11-20",
  },
];

const meterColumns: DataTableColumn<MeterRow>[] = [
  { key: "id", header: "Meter ID" },
  { key: "zone", header: "Zone" },
  {
    key: "status",
    header: "Status",
    render: (meter) => (
      <StatusBadge
        label={meter.status}
        tone={meter.status.toLocaleLowerCase() as StatusBadgeTone}
      />
    ),
  },
  { key: "readingKwh", header: "Reading (kWh)" },
  { key: "lastUpdated", header: "Last Updated" },
];

const meterTabs: TabItem<MeterFilter>[] = [
  { value: "all", label: "All meters" },
  { value: "Active", label: "Active" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Inactive", label: "Inactive" },
];

export default function MetersPage() {
  const [filter, setFilter] = useState<MeterFilter>("all");
  const visibleMeters = useMemo(
    () =>
      filter === "all"
        ? previewMeters
        : previewMeters.filter((meter) => meter.status === filter),
    [filter],
  );

  return (
    <section>
      <PageHeader
        title="Zone Meter Management"
        subtitle="Sample data for preview; API connection is not set up yet."
      />
      <Tabs
        items={meterTabs}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter meters by status"
      />
      <DataTable
        data={visibleMeters}
        columns={meterColumns}
        getRowKey={(meter) => meter.id}
        pageSize={3}
      />
    </section>
  );
}

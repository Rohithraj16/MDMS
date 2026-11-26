import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import DataTable, {
  type DataTableColumn,
} from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge, {
  type StatusBadgeTone,
} from "../../../shared/components/StatusBadge";
import Tabs, { type TabItem } from "../../../shared/components/Tabs";
import { getMeters } from "../services/metersApi";
import type { Meter, MeterStatus } from "../types/Meter";

type MeterFilter = "all" | MeterStatus;

const meterColumns: DataTableColumn<Meter>[] = [
  { key: "id", header: "Meter ID" },
  { key: "zone", header: "Zone" },
  {
    key: "status",
    header: "Status",
    render: (meter) => (
      <StatusBadge
        label={meter.status}
        tone={statusTones[meter.status]}
      />
    ),
  },
  { key: "readingKwh", header: "Reading (kWh)" },
  { key: "lastUpdated", header: "Last Updated" },
];

const statusTones: Record<MeterStatus, StatusBadgeTone> = {
  Active: "active",
  Inactive: "inactive",
  Maintenance: "maintenance",
};

const meterTabs: TabItem<MeterFilter>[] = [
  { value: "all", label: "All meters" },
  { value: "Active", label: "Active" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Inactive", label: "Inactive" },
];

export default function MetersPage() {
  const [filter, setFilter] = useState<MeterFilter>("all");
  const [meters, setMeters] = useState<Meter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getMeters(controller.signal)
      .then(setMeters)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const visibleMeters = useMemo(
    () =>
      filter === "all"
        ? meters
        : meters.filter((meter) => meter.status === filter),
    [filter, meters],
  );

  return (
    <section>
      <PageHeader
        title="Zone Meter Management"
        subtitle="Meters loaded from the MDMS API."
      />
      <Tabs
        items={meterTabs}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter meters by status"
      />
      {isLoading ? (
        <p role="status">Loading meters...</p>
      ) : loadError ? (
        <p role="alert">{loadError}</p>
      ) : (
        <DataTable
          data={visibleMeters}
          columns={meterColumns}
          getRowKey={(meter) => meter.id}
        />
      )}
    </section>
  );
}

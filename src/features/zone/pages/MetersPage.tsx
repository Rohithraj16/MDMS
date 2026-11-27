import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../services/http";
import DataTable, {
  type DataTableColumn,
} from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge, {
  type StatusBadgeTone,
} from "../../../shared/components/StatusBadge";
import Tabs, { type TabItem } from "../../../shared/components/Tabs";
import AddMeterDialog from "../components/AddMeterDialog";
import { getMeters } from "../services/metersApi";
import type { Meter, MeterStatus } from "../types/Meter";
import "./MetersPage.css";

type MeterFilter = "all" | MeterStatus;

const meterColumns: DataTableColumn<Meter>[] = [
  {
    key: "id",
    header: "Meter ID",
    render: (meter) => (
      <Link to={`/zone/meters/${encodeURIComponent(meter.id)}`}>{meter.id}</Link>
    ),
  },
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
  const [metersResult, setMetersResult] = useState<{
    key: number;
    data?: Meter[];
    error?: string;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddMeterOpen, setIsAddMeterOpen] = useState(false);
  const meters = useMemo(
    () =>
      metersResult?.key === refreshKey ? (metersResult.data ?? []) : [],
    [metersResult, refreshKey],
  );
  const isLoading = metersResult?.key !== refreshKey;
  const loadError =
    metersResult?.key === refreshKey ? (metersResult.error ?? null) : null;

  useEffect(() => {
    const controller = new AbortController();

    getMeters(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setMetersResult({ key: refreshKey, data });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setMetersResult({
            key: refreshKey,
            error: getErrorMessage(error),
          });
        }
      });

    return () => controller.abort();
  }, [refreshKey]);

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
        actions={
          <button
            className="zone-meters__add-button"
            type="button"
            onClick={() => setIsAddMeterOpen(true)}
          >
            Add Meter
          </button>
        }
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
      {isAddMeterOpen && (
        <AddMeterDialog
          isOpen
          onClose={() => setIsAddMeterOpen(false)}
          onCreated={() => {
            setIsAddMeterOpen(false);
            setRefreshKey((current) => current + 1);
          }}
        />
      )}
    </section>
  );
}

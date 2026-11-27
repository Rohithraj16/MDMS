
import { useMemo, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import DataTable, {
  type DataTableColumn,
} from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import "./AlertsPage.css";

type Severity = "Critical" | "High" | "Medium" | "Low";
type AlertStatus = "Active" | "Resolved";

type Alert = {
  id: string;
  meterId: string;
  zone: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  timestamp: string;
};

const sampleAlerts: Alert[] = [
  {
    id: "ALT-1001",
    meterId: "MTR-2041",
    zone: "Kadapa",
    description: "Abnormally high power consumption detected",
    severity: "Critical",
    status: "Active",
    timestamp: "27 Nov 2026, 10:42 AM",
  },
  {
    id: "ALT-1002",
    meterId: "MTR-1082",
    zone: "Tirupati",
    description: "Meter communication failure",
    severity: "High",
    status: "Active",
    timestamp: "27 Nov 2026, 09:18 AM",
  },
  {
    id: "ALT-1003",
    meterId: "MTR-3094",
    zone: "Kurnool",
    description: "Voltage fluctuation detected",
    severity: "Medium",
    status: "Resolved",
    timestamp: "26 Nov 2026, 04:30 PM",
  },
  {
    id: "ALT-1004",
    meterId: "MTR-4012",
    zone: "Anantapur",
    description: "Meter data not received within expected interval",
    severity: "High",
    status: "Active",
    timestamp: "26 Nov 2026, 02:15 PM",
  },
  {
    id: "ALT-1005",
    meterId: "MTR-2055",
    zone: "Nellore",
    description: "Unusual consumption pattern detected",
    severity: "Low",
    status: "Resolved",
    timestamp: "26 Nov 2026, 11:05 AM",
  },
  {
    id: "ALT-1006",
    meterId: "MTR-2077",
    zone: "Kadapa",
    description: "Possible meter tampering detected",
    severity: "Critical",
    status: "Active",
    timestamp: "25 Nov 2026, 06:45 PM",
  },
  {
    id: "ALT-1007",
    meterId: "MTR-1098",
    zone: "Tirupati",
    description: "Low battery warning",
    severity: "Low",
    status: "Resolved",
    timestamp: "25 Nov 2026, 01:20 PM",
  },
  {
    id: "ALT-1008",
    meterId: "MTR-3021",
    zone: "Kurnool",
    description: "Voltage outside configured threshold",
    severity: "Medium",
    status: "Active",
    timestamp: "24 Nov 2026, 09:50 AM",
  },
];

const severityTone = {
  Critical: "danger",
  High: "warning",
  Medium: "neutral",
  Low: "success",
} as const;

const statusTone = {
  Active: "warning",
  Resolved: "success",
} as const;

export default function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");

  const zones = useMemo(
    () => [...new Set(sampleAlerts.map((alert) => alert.zone))],
    []
  );

  const filteredAlerts = useMemo(() => {
    return sampleAlerts.filter((alert) => {
      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" || alert.status === statusFilter;

      const matchesZone =
        zoneFilter === "All" || alert.zone === zoneFilter;

      return matchesSeverity && matchesStatus && matchesZone;
    });
  }, [severityFilter, statusFilter, zoneFilter]);

  const columns = useMemo<DataTableColumn<Alert>[]>(
    () => [
      {
        key: "id",
        header: "Alert ID",
        sortable: true,
      },
      {
        key: "meterId",
        header: "Meter ID",
        sortable: true,
      },
      {
        key: "zone",
        header: "Zone",
        sortable: true,
      },
      {
        key: "description",
        header: "Description",
      },
      {
        key: "severity",
        header: "Severity",
        render: (row) => {
  const severity = row.severity;

  return (
    <StatusBadge
      label={severity}
      tone={severityTone[severity]}
    />
  );
},
      },
      {
        key: "status",
        header: "Status",
       render: (row) => {
  const status = row.status;

  return (
    <StatusBadge
      label={status}
      tone={statusTone[status]}
    />
  );
},
      },
      {
        key: "timestamp",
        header: "Reported At",
        sortable: true,
      },
    ],
    []
  );

  const criticalCount = sampleAlerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const activeCount = sampleAlerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  const resolvedCount = sampleAlerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  const resetFilters = () => {
    setSeverityFilter("All");
    setStatusFilter("All");
    setZoneFilter("All");
  };

  return (
    <div className="alerts-page">
      <PageHeader
        title="Enterprise Alerts"
        subtitle="Monitor and review alerts reported across all enterprise zones."
      />

      <section className="alerts-stats-grid">
        <StatCard
          label="Total Alerts"
          value={sampleAlerts.length}
          description="Across all zones"
          icon="🔔"
          accent="blue"
        />

        <StatCard
          label="Critical Alerts"
          value={criticalCount}
          description="Require immediate attention"
          icon="🚨"
          accent="red"
        />

        <StatCard
          label="Active Alerts"
          value={activeCount}
          description="Awaiting resolution"
          icon="⚠️"
          accent="orange"
        />

        <StatCard
          label="Resolved Alerts"
          value={resolvedCount}
          description="Successfully addressed"
          icon="✓"
          accent="green"
        />
      </section>

      <section className="alerts-content-card">
        <div className="alerts-content-header">
          <div>
            <h2>Alert Records</h2>
            <p>
              Review alerts, their severity and current resolution status.
            </p>
          </div>

          <span className="alerts-record-count">
            {filteredAlerts.length} of {sampleAlerts.length} alerts
          </span>
        </div>

        <div className="alerts-filters">
          <div className="alerts-filter-field">
            <label htmlFor="alert-severity">Severity</label>
            <select
              id="alert-severity"
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="alerts-filter-field">
            <label htmlFor="alert-status">Status</label>
            <select
              id="alert-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="alerts-filter-field">
            <label htmlFor="alert-zone">Zone</label>
            <select
              id="alert-zone"
              value={zoneFilter}
              onChange={(event) => setZoneFilter(event.target.value)}
            >
              <option value="All">All Zones</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="alerts-reset-button"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>

        <DataTable
          data={filteredAlerts}
          columns={columns}
          getRowKey={(row) => row.id}
          pageSize={5}
        />
      </section>
    </div>
  );
}

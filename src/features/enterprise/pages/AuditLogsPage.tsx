
import { useMemo, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import DataTable, {
  type DataTableColumn,
} from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import "./AuditLogsPage.css";

type AuditStatus = "Success" | "Failed" | "Warning";

type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: AuditStatus;
};

const sampleLogs: AuditLog[] = [
  {
    id: "LOG-1001",
    timestamp: "2026-11-27T10:42:00",
    user: "admin@mdms.com",
    action: "Created",
    resource: "Zone - Kadapa",
    status: "Success",
  },
  {
    id: "LOG-1002",
    timestamp: "2026-11-27T09:35:00",
    user: "rohit@mdms.com",
    action: "Updated",
    resource: "Meter - MTR-2041",
    status: "Success",
  },
  {
    id: "LOG-1003",
    timestamp: "2026-11-27T09:12:00",
    user: "saiganesh@mdms.com",
    action: "Login Failed",
    resource: "Authentication",
    status: "Failed",
  },
  {
    id: "LOG-1004",
    timestamp: "2026-11-26T16:45:00",
    user: "admin@mdms.com",
    action: "Deleted",
    resource: "User - USR-104",
    status: "Success",
  },
  {
    id: "LOG-1005",
    timestamp: "2026-11-26T14:20:00",
    user: "zoneadmin@mdms.com",
    action: "Exported",
    resource: "Consumption Report",
    status: "Warning",
  },
  {
    id: "LOG-1006",
    timestamp: "2026-11-26T11:05:00",
    user: "admin@mdms.com",
    action: "Updated",
    resource: "Enterprise Settings",
    status: "Success",
  },
  {
    id: "LOG-1007",
    timestamp: "2026-11-25T17:30:00",
    user: "zoneadmin@mdms.com",
    action: "Login Failed",
    resource: "Authentication",
    status: "Failed",
  },
  {
    id: "LOG-1008",
    timestamp: "2026-11-25T12:15:00",
    user: "rohit@mdms.com",
    action: "Viewed",
    resource: "Audit Logs",
    status: "Success",
  },
];

const statusTone = {
  Success: "success",
  Failed: "danger",
  Warning: "warning",
} as const;

const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AuditLogsPage() {
  const [userFilter, setUserFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const users = useMemo(
    () => [...new Set(sampleLogs.map((log) => log.user))],
    []
  );

  const filteredLogs = useMemo(() => {
    return sampleLogs.filter((log) => {
      const matchesUser =
        userFilter === "All" || log.user === userFilter;

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      const matchesDate =
        !dateFilter || log.timestamp.startsWith(dateFilter);

      return matchesUser && matchesStatus && matchesDate;
    });
  }, [userFilter, statusFilter, dateFilter]);

  const columns = useMemo<DataTableColumn<AuditLog>[]>(
    () => [
      {
        key: "id",
        header: "Log ID",
        sortable: true,
      },
      {
        key: "timestamp",
        header: "Timestamp",
        sortable: true,
        render: (value) => formatTimestamp(String(value)),
      },
      {
        key: "user",
        header: "User",
        sortable: true,
      },
      {
        key: "action",
        header: "Action",
        sortable: true,
      },
      {
        key: "resource",
        header: "Resource",
        sortable: true,
      },
      {
        key: "status",
        header: "Status",
       
      },
    ],
    []
  );

  const successCount = sampleLogs.filter(
    (log) => log.status === "Success"
  ).length;

  const failedCount = sampleLogs.filter(
    (log) => log.status === "Failed"
  ).length;

  const warningCount = sampleLogs.filter(
    (log) => log.status === "Warning"
  ).length;

  const resetFilters = () => {
    setUserFilter("All");
    setStatusFilter("All");
    setDateFilter("");
  };

  return (
    <div className="audit-page">
      <PageHeader
        title="Audit Logs"
        subtitle="Track user activities and monitor important actions across the MDMS platform."
      />

      <section className="audit-stats-grid">
        <StatCard
          label="Total Activities"
          value={sampleLogs.length}
          description="Recorded audit events"
          icon="📋"
          accent="blue"
        />

        <StatCard
          label="Successful Actions"
          value={successCount}
          description="Completed successfully"
          icon="✓"
          accent="green"
        />

        <StatCard
          label="Failed Actions"
          value={failedCount}
          description="Failed operations"
          icon="⚠️"
          accent="red"
        />

        <StatCard
          label="Warnings"
          value={warningCount}
          description="Require review"
          icon="🔔"
          accent="orange"
        />
      </section>

      <section className="audit-content-card">
        <div className="audit-content-header">
          <div>
            <h2>Activity History</h2>
            <p>
              Review who performed an action, what resource was affected,
              and when it happened.
            </p>
          </div>

          <span className="audit-record-count">
            {filteredLogs.length} of {sampleLogs.length} records
          </span>
        </div>

        <div className="audit-filters">
          <div className="audit-filter-field">
            <label htmlFor="audit-user">User</label>
            <select
              id="audit-user"
              value={userFilter}
              onChange={(event) => setUserFilter(event.target.value)}
            >
              <option value="All">All Users</option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="audit-filter-field">
            <label htmlFor="audit-status">Status</label>
            <select
              id="audit-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Warning">Warning</option>
            </select>
          </div>

          <div className="audit-filter-field">
            <label htmlFor="audit-date">Date</label>
            <input
              id="audit-date"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="audit-reset-button"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>

        <DataTable
          data={filteredLogs}
          columns={columns}
          getRowKey={(row) => row.id}
          pageSize={5}
        />
      </section>

      <p className="audit-note">
        Audit records are displayed in read-only mode. Entries cannot be
        edited or deleted from this screen.
      </p>
    </div>
  );
}



import { useMemo, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import DataTable from "../../../shared/components/DataTable";
import type { DataTableColumn } from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import Tabs from "../../../shared/components/Tabs";
import "./UsersPage.css";

type UserStatus = "Active" | "Deactivated";
type UserRole = "Enterprise Admin" | "Zone Admin" | "Consumer";
type UserTab = "admins" | "consumers";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zone: string;
  status: UserStatus;
}

const sampleUsers: User[] = [
  {
    id: "USR-001",
    name: "Rohit Sharma",
    email: "rohit@example.com",
    role: "Enterprise Admin",
    zone: "All Zones",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Priya Reddy",
    email: "priya@example.com",
    role: "Zone Admin",
    zone: "Kadapa",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Suresh Kumar",
    email: "suresh@example.com",
    role: "Zone Admin",
    zone: "Tirupati",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Anil Kumar",
    email: "anil@example.com",
    role: "Zone Admin",
    zone: "Kurnool",
    status: "Deactivated",
  },
  {
    id: "USR-005",
    name: "Arjun Reddy",
    email: "arjun@example.com",
    role: "Consumer",
    zone: "Kadapa",
    status: "Active",
  },
  {
    id: "USR-006",
    name: "Lakshmi Devi",
    email: "lakshmi@example.com",
    role: "Consumer",
    zone: "Tirupati",
    status: "Active",
  },
  {
    id: "USR-007",
    name: "Kiran Kumar",
    email: "kiran@example.com",
    role: "Consumer",
    zone: "Kadapa",
    status: "Deactivated",
  },
  {
    id: "USR-008",
    name: "Divya Rani",
    email: "divya@example.com",
    role: "Consumer",
    zone: "Anantapur",
    status: "Active",
  },
  {
    id: "USR-009",
    name: "Rahul Varma",
    email: "rahul@example.com",
    role: "Consumer",
    zone: "Nellore",
    status: "Active",
  },
  {
    id: "USR-010",
    name: "Meena Kumari",
    email: "meena@example.com",
    role: "Consumer",
    zone: "Kurnool",
    status: "Deactivated",
  },
];

const yearlyUserStats: Record<
  string,
  { active: number; deactivated: number }
> = {
  "2024": { active: 720, deactivated: 85 },
  "2025": { active: 940, deactivated: 110 },
  "2026": { active: 1240, deactivated: 160 },
};

const columns: DataTableColumn<User>[] = [
  {
    key: "id",
    header: "User ID",
    render: (user) => <strong className="users-id">{user.id}</strong>,
  },
  {
    key: "name",
    header: "User",
    render: (user) => (
      <div className="users-name-cell">
        <span className="users-avatar">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <strong>{user.name}</strong>
      </div>
    ),
  },
  { key: "email", header: "Email" },
  {
    key: "role",
    header: "Role",
    render: (user) => (
      <span className="users-role">{user.role}</span>
    ),
  },
  { key: "zone", header: "Zone" },
  {
    key: "status",
    header: "Status",
    render: (user) => (
      <StatusBadge
        label={user.status}
        tone={user.status === "Active" ? "active" : "inactive"}
      />
    ),
  },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<UserTab>("admins");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [statusFilter, setStatusFilter] = useState("All");

  const tabs = [
    { value: "admins" as const, label: "Admins" },
    { value: "consumers" as const, label: "Consumers" },
  ];

  const displayedUsers = useMemo(() => {
    return sampleUsers.filter((user) => {
      const roleMatches =
        activeTab === "admins"
          ? user.role !== "Consumer"
          : user.role === "Consumer";

      const statusMatches =
        statusFilter === "All" || user.status === statusFilter;

      return roleMatches && statusMatches;
    });
  }, [activeTab, statusFilter]);

  const adminCount = sampleUsers.filter(
    (user) => user.role !== "Consumer",
  ).length;

  const consumerCount = sampleUsers.filter(
    (user) => user.role === "Consumer",
  ).length;

  const activeCount = sampleUsers.filter(
    (user) => user.status === "Active",
  ).length;

  const yearlyStats = yearlyUserStats[selectedYear];
  const totalYearlyUsers = yearlyStats.active + yearlyStats.deactivated;
  const activePercentage =
    totalYearlyUsers > 0
      ? (yearlyStats.active / totalYearlyUsers) * 100
      : 0;

  return (
    <main className="users-page">
      <PageHeader
        title="User & Role Management"
        subtitle="Monitor enterprise administrators, zone administrators and consumers."
      />

      <section className="users-stats">
        <StatCard
          label="Total Users"
          value={sampleUsers.length}
          description="Across all roles"
          icon="👥"
          accent="blue"
        />
        <StatCard
          label="Administrators"
          value={adminCount}
          description="Enterprise and zone admins"
          icon="🛡️"
          accent="blue"
        />
        <StatCard
          label="Consumers"
          value={consumerCount}
          description="Registered consumers"
          icon="👤"
          accent="green"
        />
        <StatCard
          label="Active Users"
          value={activeCount}
          description="Currently active accounts"
          icon="✓"
          accent="green"
        />
      </section>

      <section className="users-analytics">
        <div className="users-analytics-heading">
          <div>
            <h2>User Account Analytics</h2>
            <p>Active and deactivated account distribution by year.</p>
          </div>

          <label className="users-year-select">
            <span>Year</span>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {Object.keys(yearlyUserStats).map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="users-chart-content">
          <div className="users-donut-wrapper">
            <div
              className="users-donut"
              style={{
                background: `conic-gradient(#2563eb 0% ${activePercentage}%, #f59e0b ${activePercentage}% 100%)`,
              }}
              role="img"
              aria-label={`${yearlyStats.active} active and ${yearlyStats.deactivated} deactivated users in ${selectedYear}`}
            >
              <div className="users-donut-center">
                <strong>{totalYearlyUsers.toLocaleString("en-IN")}</strong>
                <span>Total Users</span>
              </div>
            </div>
          </div>

          <div className="users-chart-legend">
            <div className="users-legend-item">
              <span className="users-legend-dot active" />
              <div>
                <span>Active Users</span>
                <strong>
                  {yearlyStats.active.toLocaleString("en-IN")}
                </strong>
              </div>
              <b>{activePercentage.toFixed(1)}%</b>
            </div>

            <div className="users-legend-item">
              <span className="users-legend-dot deactivated" />
              <div>
                <span>Deactivated Users</span>
                <strong>
                  {yearlyStats.deactivated.toLocaleString("en-IN")}
                </strong>
              </div>
              <b>{(100 - activePercentage).toFixed(1)}%</b>
            </div>

            <div className="users-chart-footnote">
              Account distribution for {selectedYear}
            </div>
          </div>
        </div>
      </section>

      <section className="users-table-panel">
        <div className="users-table-heading">
          <div>
            <h2>Enterprise Users</h2>
            <p>View user profiles, assigned roles and account status.</p>
          </div>

          <label className="users-status-filter">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Deactivated">Deactivated</option>
            </select>
          </label>
        </div>

        <Tabs
          items={tabs}
          value={activeTab}
          onChange={(value) => {
            setActiveTab(value);
            setStatusFilter("All");
          }}
          ariaLabel="User role categories"
        />

        <div className="users-table-content">
          <div className="users-tab-description">
            <strong>
              {activeTab === "admins" ? "Administrators" : "Consumers"}
            </strong>
            <span>{displayedUsers.length} records</span>
          </div>

          <DataTable
            data={displayedUsers}
            columns={columns}
            getRowKey={(user) => user.id}
            pageSize={5}
          />
        </div>
      </section>

      <p className="users-demo-note">
        Illustrative sample data. Live user records and yearly account
        statistics will be retrieved from the ASP.NET Core API.
      </p>
    </main>
  );
}


import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import DataTable from "../../../shared/components/DataTable";
import type { DataTableColumn } from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import Tabs from "../../../shared/components/Tabs";
import "./ZoneDetailsPage.css";

type ZoneStatus = "Active" | "Inactive" | "Maintenance";

interface Zone {
  id: string;
  name: string;
  admin: string;
  meters: number;
  location: string;
  pincode: string;
  status: ZoneStatus;
}

interface Meter {
  id: string;
  consumer: string;
  address: string;
  consumption: number;
  status: "Online" | "Offline" | "Fault";
}

interface ZoneUser {
  id: string;
  name: string;
  email: string;
  role: "Zone Admin" | "Consumer";
  status: "Active" | "Inactive";
}

const zones: Zone[] = [
  {
    id: "ZONE-001",
    name: "Kadapa",
    admin: "Ramesh Kumar",
    meters: 1240,
    location: "Kadapa, Andhra Pradesh",
    pincode: "516001",
    status: "Active",
  },
  {
    id: "ZONE-002",
    name: "Tirupati",
    admin: "Priya Sharma",
    meters: 980,
    location: "Tirupati, Andhra Pradesh",
    pincode: "517501",
    status: "Active",
  },
  {
    id: "ZONE-003",
    name: "Kurnool",
    admin: "Suresh Reddy",
    meters: 860,
    location: "Kurnool, Andhra Pradesh",
    pincode: "518001",
    status: "Maintenance",
  },
  {
    id: "ZONE-004",
    name: "Anantapur",
    admin: "Anil Kumar",
    meters: 720,
    location: "Anantapur, Andhra Pradesh",
    pincode: "515001",
    status: "Active",
  },
  {
    id: "ZONE-005",
    name: "Nellore",
    admin: "Not assigned",
    meters: 540,
    location: "Nellore, Andhra Pradesh",
    pincode: "524001",
    status: "Inactive",
  },
];

const sampleMeters: Meter[] = [
  {
    id: "MTR-1001",
    consumer: "Arjun Reddy",
    address: "Main Road, Kadapa",
    consumption: 245,
    status: "Online",
  },
  {
    id: "MTR-1002",
    consumer: "Priya Devi",
    address: "Nagarajupeta, Kadapa",
    consumption: 186,
    status: "Online",
  },
  {
    id: "MTR-1003",
    consumer: "Kiran Kumar",
    address: "Almaspet, Kadapa",
    consumption: 312,
    status: "Offline",
  },
  {
    id: "MTR-1004",
    consumer: "Lakshmi Rao",
    address: "Co-operative Colony, Kadapa",
    consumption: 198,
    status: "Online",
  },
  {
    id: "MTR-1005",
    consumer: "Sanjay Kumar",
    address: "Ravindra Nagar, Kadapa",
    consumption: 420,
    status: "Fault",
  },
];

const sampleUsers: ZoneUser[] = [
  {
    id: "USR-001",
    name: "Ramesh Kumar",
    email: "ramesh@example.com",
    role: "Zone Admin",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Arjun Reddy",
    email: "arjun@example.com",
    role: "Consumer",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Priya Devi",
    email: "priya@example.com",
    role: "Consumer",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Kiran Kumar",
    email: "kiran@example.com",
    role: "Consumer",
    status: "Inactive",
  },
];

const meterColumns: DataTableColumn<Meter>[] = [
  { key: "id", header: "Meter ID" },
  { key: "consumer", header: "Consumer" },
  { key: "address", header: "Address" },
  {
    key: "consumption",
    header: "Consumption (kWh)",
    render: (meter) => `${meter.consumption} kWh`,
  },
  {
    key: "status",
    header: "Status",
    render: (meter) => (
      <StatusBadge
        label={meter.status}
        tone={
          meter.status === "Online"
            ? "success"
            : meter.status === "Offline"
              ? "warning"
              : "danger"
        }
      />
    ),
  },
];

const userColumns: DataTableColumn<ZoneUser>[] = [
  { key: "id", header: "User ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
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

export default function ZoneDetailsPage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const [activeTab, setActiveTab] = useState<"meters" | "users">("meters");

  const zone = zones.find((item) => item.id === zoneId);

  if (!zone) {
    return (
      <main className="zone-details-page">
        <PageHeader title="Zone Not Found" subtitle="The requested zone could not be found." />
        <Link to="/enterprise/zones" className="zone-back-link">
          ← Back to Zone Management
        </Link>
      </main>
    );
  }

  const tabs = [
    { value: "meters" as const, label: "Meters" },
    { value: "users" as const, label: "Users" },
  ];

  const onlineMeters = sampleMeters.filter(
    (meter) => meter.status === "Online",
  ).length;

  const activeUsers = sampleUsers.filter(
    (user) => user.status === "Active",
  ).length;

  return (
    <main className="zone-details-page">
      <div className="zone-breadcrumb">
        <Link to="/enterprise/zones">Zone Management</Link>
        <span>/</span>
        <span>{zone.name}</span>
      </div>

      <PageHeader
        title={`${zone.name} Zone`}
        subtitle="Zone overview, meter activity and assigned users."
        actions={
          <Link to="/enterprise/zones" className="zone-back-button">
            ← All Zones
          </Link>
        }
      />

      <section className="zone-overview-card">
        <div className="zone-overview-main">
          <div className="zone-overview-icon">📍</div>
          <div>
            <span className="zone-overview-label">OPERATIONAL ZONE</span>
            <h2>{zone.name}</h2>
            <p>{zone.location}</p>
          </div>
        </div>

        <StatusBadge
          label={zone.status}
          tone={
            zone.status === "Active"
              ? "active"
              : zone.status === "Maintenance"
                ? "maintenance"
                : "inactive"
          }
        />

        <div className="zone-overview-meta">
          <div>
            <span>Zone ID</span>
            <strong>{zone.id}</strong>
          </div>
          <div>
            <span>Assigned Admin</span>
            <strong>{zone.admin}</strong>
          </div>
          <div>
            <span>Pincode</span>
            <strong>{zone.pincode}</strong>
          </div>
        </div>
      </section>

      <section className="zone-details-stats">
        <StatCard
          label="Total Meters"
          value={zone.meters.toLocaleString("en-IN")}
          description="Registered in this zone"
          icon="⚡"
          accent="blue"
        />
        <StatCard
          label="Online Meters"
          value={onlineMeters}
          description="From displayed sample records"
          icon="✓"
          accent="green"
        />
        <StatCard
          label="Total Users"
          value={sampleUsers.length}
          description="Assigned to this zone"
          icon="👥"
          accent="blue"
        />
        <StatCard
          label="Active Users"
          value={activeUsers}
          description="From displayed sample records"
          icon="●"
          accent="green"
        />
      </section>

      <section className="zone-records-panel">
        <div className="zone-records-heading">
          <div>
            <h2>Zone Records</h2>
            <p>Explore the meters and users associated with this zone.</p>
          </div>
        </div>

        <Tabs
          items={tabs}
          value={activeTab}
          onChange={setActiveTab}
          ariaLabel="Zone records"
        />

        <div className="zone-tab-content">
          {activeTab === "meters" ? (
            <>
              <div className="zone-tab-heading">
                <div>
                  <h3>Meter List</h3>
                  <p>Meter status and consumption overview.</p>
                </div>
                <span className="zone-record-count">
                  {sampleMeters.length} sample records
                </span>
              </div>

              <DataTable
                data={sampleMeters}
                columns={meterColumns}
                getRowKey={(meter) => meter.id}
                pageSize={5}
              />
            </>
          ) : (
            <>
              <div className="zone-tab-heading">
                <div>
                  <h3>Assigned Users</h3>
                  <p>Administrators and consumers in this zone.</p>
                </div>
                <span className="zone-record-count">
                  {sampleUsers.length} sample records
                </span>
              </div>

              <DataTable
                data={sampleUsers}
                columns={userColumns}
                getRowKey={(user) => user.id}
                pageSize={5}
              />
            </>
          )}
        </div>
      </section>

      <p className="zone-details-note">
        Illustrative sample records are displayed. Actual zone, meter and user
        information will be retrieved from the ASP.NET Core API.
      </p>
    </main>
  );
}

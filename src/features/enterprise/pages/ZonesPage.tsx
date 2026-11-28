
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import type { DataTableColumn } from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import StatCard from "../../../shared/components/StatCard";
import "./ZonesPage.css";

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

const sampleZones: Zone[] = [
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

const columns: DataTableColumn<Zone>[] = [
  {
    key: "id",
    header: "Zone ID",
  },
  {
    key: "name",
    header: "Zone Name",
    render: (zone) => (
      <div className="zone-name-cell">
        <span className="zone-name-cell__icon">📍</span>
        <strong>{zone.name}</strong>
      </div>
    ),
  },
  {
    key: "admin",
    header: "Assigned Admin",
  },
  {
    key: "meters",
    header: "Total Meters",
    render: (zone) => zone.meters.toLocaleString("en-IN"),
  },
  {
    key: "location",
    header: "Location",
  },
  {
    key: "status",
    header: "Status",
    render: (zone) => (
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
    ),
  },
  {
    key: "id",
    header: "Action",
    sortable: false,
    render: (zone) => (
      <Link
        to={`/enterprise/zones/${zone.id}`}
        className="zone-view-link"
      >
        View details <span>→</span>
      </Link>
    ),
  },
];

export default function ZonesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const filteredZones = useMemo(() => {
    if (statusFilter === "All") return sampleZones;
    return sampleZones.filter((zone) => zone.status === statusFilter);
  }, [statusFilter]);

  const activeZones = sampleZones.filter(
    (zone) => zone.status === "Active",
  ).length;

  const totalMeters = sampleZones.reduce(
    (total, zone) => total + zone.meters,
    0,
  );

  const maintenanceZones = sampleZones.filter(
    (zone) => zone.status === "Maintenance",
  ).length;

  function closeForm() {
    setShowForm(false);
    setFormMessage("");
  }

  // Close the modal when Escape is pressed.
  useEffect(() => {
    if (!showForm) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeForm();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showForm]);

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormMessage(
      "Form validation successful. API integration is pending; no data has been saved.",
    );
  }

  return (
    <main className="zones-page">
      <PageHeader
        title="Zone Management"
        subtitle="Manage operational zones, administrators and meter distribution."
        actions={
          <button
            type="button"
            className="zones-add-button"
            onClick={() => {
              setFormMessage("");
              setShowForm(true);
            }}
          >
            <span>＋</span> Add New Zone
          </button>
        }
      />

      <section className="zones-stats">
        <StatCard
          label="Total Zones"
          value={sampleZones.length}
          description="Across the enterprise"
          icon="🌐"
          accent="blue"
        />
        <StatCard
          label="Active Zones"
          value={activeZones}
          description="Currently operational"
          icon="✓"
          accent="green"
        />
        <StatCard
          label="Total Meters"
          value={totalMeters.toLocaleString("en-IN")}
          description="Meters across all zones"
          icon="⚡"
          accent="blue"
        />
        <StatCard
          label="Under Maintenance"
          value={maintenanceZones}
          description="Require monitoring"
          icon="⚠️"
          accent="orange"
        />
      </section>

      <section className="zones-table-panel">
        <div className="zones-table-heading">
          <div>
            <h2>All Zones</h2>
            <p>View and manage all registered operational zones.</p>
          </div>

          <label className="zones-filter">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>
        </div>

        <DataTable
          data={filteredZones}
          columns={columns}
          getRowKey={(zone) => zone.id}
          pageSize={5}
        />
      </section>

      <p className="zones-demo-note">
        Showing illustrative sample data. Live zone records will be loaded
        through the ASP.NET Core API after backend integration.
      </p>

      {/* Add Zone Modal */}
      {showForm && (
        <div
          className="zones-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className="zones-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="zones-modal-title"
          >
            <div className="zones-form-heading">
              <div>
                <h2 id="zones-modal-title">Add New Zone</h2>
                <p>
                  Enter the basic information for the new operational zone.
                </p>
              </div>

              <button
                type="button"
                className="zones-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="zones-form">
              <label>
                Zone Name *
                <input
                  name="name"
                  placeholder="Enter zone name"
                  required
                  autoFocus
                />
              </label>

              <label>
                Assigned Admin *
                <input
                  name="admin"
                  placeholder="Enter administrator name"
                  required
                />
              </label>

              <label>
                Location *
                <input
                  name="location"
                  placeholder="Enter location"
                  required
                />
              </label>

              <label>
                Pincode *
                <input
                  name="pincode"
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  inputMode="numeric"
                  required
                />
              </label>

              <label className="zones-form-full">
                Description
                <textarea
                  name="description"
                  placeholder="Enter zone description"
                  rows={3}
                />
              </label>

              <div className="zones-form-actions">
                <button
                  type="button"
                  className="zones-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="zones-submit-button">
                  Validate Details
                </button>
              </div>
            </form>

            {formMessage && (
              <p className="zones-form-message" role="status">
                {formMessage}
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

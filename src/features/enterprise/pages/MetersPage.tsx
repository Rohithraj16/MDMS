
import { useMemo, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import DataTable from "../../../shared/components/DataTable";
import type { DataTableColumn } from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import "./MetersPage.css";

type MeterStatus = "Online" | "Offline" | "Fault";

interface Meter {
  id: string;
  consumer: string;
  zone: string;
  location: string;
  consumption: number;
  status: MeterStatus;
}

const sampleMeters: Meter[] = [
  { id: "MTR-1001", consumer: "Arjun Reddy", zone: "Kadapa", location: "Main Road", consumption: 245, status: "Online" },
  { id: "MTR-1002", consumer: "Priya Devi", zone: "Kadapa", location: "Nagarajupeta", consumption: 186, status: "Online" },
  { id: "MTR-1003", consumer: "Kiran Kumar", zone: "Kadapa", location: "Almaspet", consumption: 312, status: "Offline" },
  { id: "MTR-1004", consumer: "Lakshmi Rao", zone: "Tirupati", location: "Renigunta Road", consumption: 198, status: "Online" },
  { id: "MTR-1005", consumer: "Sanjay Kumar", zone: "Tirupati", location: "Tata Nagar", consumption: 420, status: "Fault" },
  { id: "MTR-1006", consumer: "Ravi Teja", zone: "Tirupati", location: "Korlagunta", consumption: 275, status: "Online" },
  { id: "MTR-1007", consumer: "Divya Rani", zone: "Kurnool", location: "N R Peta", consumption: 340, status: "Online" },
  { id: "MTR-1008", consumer: "Mahesh Babu", zone: "Kurnool", location: "Budhwarpet", consumption: 160, status: "Offline" },
  { id: "MTR-1009", consumer: "Sneha Reddy", zone: "Anantapur", location: "Kamalanagar", consumption: 290, status: "Online" },
  { id: "MTR-1010", consumer: "Vijay Kumar", zone: "Anantapur", location: "Old Town", consumption: 225, status: "Online" },
  { id: "MTR-1011", consumer: "Meena Kumari", zone: "Nellore", location: "Dargamitta", consumption: 310, status: "Fault" },
  { id: "MTR-1012", consumer: "Rahul Varma", zone: "Nellore", location: "Magunta Layout", consumption: 205, status: "Online" },
];

const columns: DataTableColumn<Meter>[] = [
  {
    key: "id",
    header: "Meter ID",
    render: (meter) => (
      <strong className="meter-id">{meter.id}</strong>
    ),
  },
  {
    key: "consumer",
    header: "Consumer",
  },
  {
    key: "zone",
    header: "Zone",
  },
  {
    key: "location",
    header: "Location",
  },
  {
    key: "consumption",
    header: "Consumption",
    render: (meter) => (
      <strong>{meter.consumption} kWh</strong>
    ),
  },
  {
    key: "status",
    header: "Meter Status",
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

const zoneColors: Record<string, string> = {
  Kadapa: "#3b82f6",
  Tirupati: "#8b5cf6",
  Kurnool: "#06b6d4",
  Anantapur: "#10b981",
  Nellore: "#f59e0b",
};

export default function MetersPage() {
  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const zones = useMemo(
    () => [...new Set(sampleMeters.map((meter) => meter.zone))],
    [],
  );

  const filteredMeters = useMemo(() => {
    return sampleMeters.filter((meter) => {
      const zoneMatches =
        selectedZone === "All" || meter.zone === selectedZone;

      const statusMatches =
        selectedStatus === "All" || meter.status === selectedStatus;

      return zoneMatches && statusMatches;
    });
  }, [selectedZone, selectedStatus]);

  const onlineCount = sampleMeters.filter(
    (meter) => meter.status === "Online",
  ).length;

  const offlineCount = sampleMeters.filter(
    (meter) => meter.status === "Offline",
  ).length;

  const faultCount = sampleMeters.filter(
    (meter) => meter.status === "Fault",
  ).length;

  const totalConsumption = sampleMeters.reduce(
    (total, meter) => total + meter.consumption,
    0,
  );

  const zoneConsumption = zones.map((zone) => ({
    name: zone,
    consumption: sampleMeters
      .filter((meter) => meter.zone === zone)
      .reduce((total, meter) => total + meter.consumption, 0),
  }));

  const maxConsumption = Math.max(
    ...zoneConsumption.map((item) => item.consumption),
  );

  return (
    <main className="meters-page">
      <PageHeader
        title="Enterprise Meter Management"
        subtitle="Monitor meter inventory, connectivity and energy consumption across all zones."
      />

      <section className="meters-stats">
        <StatCard
          label="Total Meters"
          value={sampleMeters.length}
          description="Registered across all zones"
          icon="⚡"
          accent="blue"
        />
        <StatCard
          label="Online Meters"
          value={onlineCount}
          description="Currently connected"
          icon="✓"
          accent="green"
        />
        <StatCard
          label="Offline Meters"
          value={offlineCount}
          description="Not currently connected"
          icon="○"
          accent="orange"
        />
        <StatCard
          label="Faulty Meters"
          value={faultCount}
          description="Require attention"
          icon="⚠️"
          accent="red"
        />
      </section>

      <section className="meters-chart-panel">
        <div className="meters-section-heading">
          <div>
            <h2>Consumption by Zone</h2>
            <p>Energy consumption distribution across operational zones.</p>
          </div>
          <span className="meters-chart-unit">kWh</span>
        </div>

        <div className="meters-chart">
          {zoneConsumption.map((item) => {
            const percentage =
              maxConsumption > 0
                ? (item.consumption / maxConsumption) * 100
                : 0;

            return (
              <div className="meters-chart-row" key={item.name}>
                <div className="meters-chart-label">
                  <span>{item.name}</span>
                  <strong>{item.consumption.toLocaleString("en-IN")} kWh</strong>
                </div>

                <div
                  className="meters-chart-track"
                  role="img"
                  aria-label={`${item.name}: ${item.consumption} kilowatt hours`}
                >
                  <div
                    className="meters-chart-bar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: zoneColors[item.name],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="meters-chart-footer">
          <span>Total displayed consumption</span>
          <strong>{totalConsumption.toLocaleString("en-IN")} kWh</strong>
        </div>
      </section>

      <section className="meters-table-panel">
        <div className="meters-section-heading">
          <div>
            <h2>Meter Inventory</h2>
            <p>Search, filter and monitor meters across the enterprise.</p>
          </div>

          <span className="meters-record-count">
            {filteredMeters.length} of {sampleMeters.length} meters
          </span>
        </div>

        <div className="meters-filters">
          <label>
            <span>Filter by Zone</span>
            <select
              value={selectedZone}
              onChange={(event) => setSelectedZone(event.target.value)}
            >
              <option value="All">All Zones</option>
              {zones.map((zone) => (
                <option value={zone} key={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Filter by Status</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Fault">Fault</option>
            </select>
          </label>

          <button
            type="button"
            className="meters-reset-button"
            onClick={() => {
              setSelectedZone("All");
              setSelectedStatus("All");
            }}
          >
            Reset Filters
          </button>
        </div>

        <DataTable
          data={filteredMeters}
          columns={columns}
          getRowKey={(meter) => meter.id}
          pageSize={5}
        />
      </section>

      <p className="meters-demo-note">
        Illustrative sample data only. Actual meter information and consumption
        records will be retrieved from the ASP.NET Core API.
      </p>
    </main>
  );
}

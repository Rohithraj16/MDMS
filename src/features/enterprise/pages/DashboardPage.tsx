
import { Link } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import "./DashboardPage.css";

const zoneConsumption = [
  { name: "Kadapa", value: 820, color: "blue" },
  { name: "Tirupati", value: 740, color: "green" },
  { name: "Kurnool", value: 680, color: "purple" },
  { name: "Anantapur", value: 590, color: "orange" },
  { name: "Nellore", value: 510, color: "blue" },
];

const recentAlerts = [
  {
    id: "ALT-1024",
    title: "High energy consumption detected",
    zone: "Kadapa",
    time: "10 minutes ago",
    severity: "Critical",
  },
  {
    id: "ALT-1023",
    title: "Meter communication failure",
    zone: "Tirupati",
    time: "35 minutes ago",
    severity: "Critical",
  },
  {
    id: "ALT-1022",
    title: "Voltage fluctuation detected",
    zone: "Kurnool",
    time: "1 hour ago",
    severity: "High",
  },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState("Weekly");

  const maxConsumption = Math.max(
    ...zoneConsumption.map((zone) => zone.value),
  );

  return (
    <div className="enterprise-dashboard">
      <PageHeader
        title="Enterprise Dashboard"
        subtitle="Monitor your organization's overall meter performance and activity."
        actions={
          <span className="dashboard-updated">
            <span className="dashboard-live-dot" />
            Overview
          </span>
        }
      />

      {/* KPI cards */}
      <section className="dashboard-stats">
        <StatCard
          label="Total Zones"
          value="12"
          description="Registered operational zones"
          icon="🌐"
          accent="blue"
          to="/enterprise/zones"
        />

        <StatCard
          label="Total Meters"
          value="24,850"
          description="Meters across all zones"
          icon="⚡"
          accent="green"
          to="/enterprise/meters"
        />

        <StatCard
          label="Critical Alerts"
          value="18"
          description="Require immediate attention"
          icon="⚠️"
          accent="red"
          to="/enterprise/alerts"
        />
      </section>

      {/* Consumption chart */}
      <section className="dashboard-panel consumption-panel">
        <div className="dashboard-panel__header">
          <div>
            <h2>Average Consumption by Zone</h2>
            <p>Compare energy consumption across operational zones</p>
          </div>

          <select
            className="dashboard-period-select"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Select consumption period"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div className="consumption-chart">
          {zoneConsumption.map((zone) => (
            <div className="consumption-row" key={zone.name}>
              <span className="consumption-zone">{zone.name}</span>

              <div className="consumption-track">
                <div
                  className={`consumption-bar consumption-bar--${zone.color}`}
                  style={{
                    width: `${(zone.value / maxConsumption) * 100}%`,
                  }}
                />
              </div>

              <span className="consumption-value">
                {zone.value.toLocaleString("en-IN")} kWh
              </span>
            </div>
          ))}
        </div>

        <div className="chart-footnote">
          Average consumption · {period} view · Illustrative data
        </div>
      </section>

      {/* Recent critical alerts */}
      <section className="dashboard-panel alerts-panel">
        <div className="dashboard-panel__header">
          <div>
            <h2>Recent Critical Alerts</h2>
            <p>Important events that need your attention</p>
          </div>

          <Link to="/enterprise/alerts" className="dashboard-view-all">
            View all alerts →
          </Link>
        </div>

        <div className="dashboard-alert-list">
          {recentAlerts.map((alert) => (
            <div className="dashboard-alert" key={alert.id}>
              <div className="dashboard-alert__icon">!</div>

              <div className="dashboard-alert__content">
                <h3>{alert.title}</h3>
                <p>
                  {alert.id} <span>·</span> {alert.zone} Zone
                </p>
              </div>

              <div className="dashboard-alert__meta">
                <span
                  className={`alert-severity alert-severity--${alert.severity.toLowerCase()}`}
                >
                  {alert.severity}
                </span>
                <span className="alert-time">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

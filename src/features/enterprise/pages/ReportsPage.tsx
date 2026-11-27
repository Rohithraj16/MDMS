
import { useMemo, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import DataTable, {
  type DataTableColumn,
} from "../../../shared/components/DataTable";
import "./ReportsPage.css";

type Period = "Day" | "Week" | "Month";

type ZoneReport = {
  zone: string;
  currentConsumption: number;
  previousConsumption: number;
  change: string;
};

const reportData: Record<Period, ZoneReport[]> = {
  Day: [
    { zone: "Kadapa", currentConsumption: 1240, previousConsumption: 1100, change: "+12.7%" },
    { zone: "Tirupati", currentConsumption: 980, previousConsumption: 1050, change: "-6.7%" },
    { zone: "Kurnool", currentConsumption: 1450, previousConsumption: 1300, change: "+11.5%" },
    { zone: "Anantapur", currentConsumption: 870, previousConsumption: 820, change: "+6.1%" },
    { zone: "Nellore", currentConsumption: 1120, previousConsumption: 1000, change: "+12.0%" },
  ],
  Week: [
    { zone: "Kadapa", currentConsumption: 8240, previousConsumption: 7900, change: "+4.3%" },
    { zone: "Tirupati", currentConsumption: 6920, previousConsumption: 7200, change: "-3.9%" },
    { zone: "Kurnool", currentConsumption: 9450, previousConsumption: 8800, change: "+7.4%" },
    { zone: "Anantapur", currentConsumption: 5870, previousConsumption: 6100, change: "-3.8%" },
    { zone: "Nellore", currentConsumption: 7120, previousConsumption: 6800, change: "+4.7%" },
  ],
  Month: [
    { zone: "Kadapa", currentConsumption: 34200, previousConsumption: 32100, change: "+6.5%" },
    { zone: "Tirupati", currentConsumption: 28600, previousConsumption: 30100, change: "-5.0%" },
    { zone: "Kurnool", currentConsumption: 39800, previousConsumption: 36500, change: "+9.0%" },
    { zone: "Anantapur", currentConsumption: 25100, previousConsumption: 26300, change: "-4.6%" },
    { zone: "Nellore", currentConsumption: 31500, previousConsumption: 29800, change: "+5.7%" },
  ],
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("Week");

  const zones = reportData[period];

  const totalConsumption = zones.reduce(
    (total, zone) => total + zone.currentConsumption,
    0
  );

  const previousTotal = zones.reduce(
    (total, zone) => total + zone.previousConsumption,
    0
  );

  const averageConsumption = Math.round(
    totalConsumption / zones.length
  );

  const percentageChange =
    previousTotal === 0
      ? 0
      : ((totalConsumption - previousTotal) / previousTotal) * 100;

  const highestZone = zones.reduce((highest, zone) =>
    zone.currentConsumption > highest.currentConsumption ? zone : highest
  );

  const maxConsumption = Math.max(
    ...zones.map((zone) =>
      Math.max(zone.currentConsumption, zone.previousConsumption)
    )
  );

  const columns = useMemo<DataTableColumn<ZoneReport>[]>(
    () => [
      { key: "zone", header: "Zone", sortable: true },
      {
        key: "currentConsumption",
        header: "Current Consumption (kWh)",
        sortable: true,
      },
      {
        key: "previousConsumption",
        header: "Previous Consumption (kWh)",
        sortable: true,
      },
      { key: "change", header: "Change", sortable: true },
    ],
    []
  );

  return (
    <div className="reports-page">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Compare energy consumption and monitor performance across zones."
      />

      <section className="reports-period-section">
        <div>
          <h2>Consumption Overview</h2>
          <p>Compare consumption with the previous period.</p>
        </div>

        <div className="reports-period-toggle" aria-label="Report period">
          {(["Day", "Week", "Month"] as Period[]).map((item) => (
            <button
              key={item}
              type="button"
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
              aria-pressed={period === item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="reports-stats-grid">
        <StatCard
          label="Total Consumption"
          value={`${formatNumber(totalConsumption)} kWh`}
          description={`Across ${zones.length} zones`}
          icon="⚡"
          accent="blue"
        />

        <StatCard
          label="Average Zone Consumption"
          value={`${formatNumber(averageConsumption)} kWh`}
          description={`Average per zone · ${period.toLowerCase()}`}
          icon="📊"
          accent="green"
        />

        <StatCard
          label="Highest Consumption"
          value={`${formatNumber(highestZone.currentConsumption)} kWh`}
          description={highestZone.zone}
          icon="📈"
          accent="orange"
        />

        <StatCard
          label="Period Change"
          value={`${percentageChange >= 0 ? "+" : ""}${percentageChange.toFixed(1)}%`}
          description="Compared with previous period"
          icon="↗"
          accent={percentageChange > 0 ? "red" : "green"}
        />
      </section>

      <section className="reports-chart-card">
        <div className="reports-chart-header">
          <div>
            <h2>Zone-wise Consumption Comparison</h2>
            <p>Current period vs previous period · Values in kWh</p>
          </div>

          <div className="reports-chart-legend">
            <span><i className="legend-current" /> Current period</span>
            <span><i className="legend-previous" /> Previous period</span>
          </div>
        </div>

        <div className="reports-chart">
          {zones.map((zone) => {
            const currentHeight =
              (zone.currentConsumption / maxConsumption) * 100;
            const previousHeight =
              (zone.previousConsumption / maxConsumption) * 100;

            return (
              <div className="reports-chart-group" key={zone.zone}>
                <div className="reports-bars">
                  <div className="reports-bar-column">
                    <span className="reports-bar-value">
                      {formatNumber(zone.currentConsumption)}
                    </span>
                    <div
                      className="reports-bar current-bar"
                      style={{ height: `${currentHeight}%` }}
                      title={`Current: ${formatNumber(zone.currentConsumption)} kWh`}
                    />
                  </div>

                  <div className="reports-bar-column">
                    <span className="reports-bar-value">
                      {formatNumber(zone.previousConsumption)}
                    </span>
                    <div
                      className="reports-bar previous-bar"
                      style={{ height: `${previousHeight}%` }}
                      title={`Previous: ${formatNumber(zone.previousConsumption)} kWh`}
                    />
                  </div>
                </div>

                <span className="reports-zone-label">{zone.zone}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="reports-table-card">
        <div className="reports-table-header">
          <div>
            <h2>Zone Consumption Details</h2>
            <p>Detailed comparison for the selected period.</p>
          </div>
          <span className="reports-period-label">{period} Report</span>
        </div>

        <DataTable
          data={zones}
          columns={columns}
          getRowKey={(row) => row.zone}
          pageSize={5}
        />
      </section>
    </div>
  );
}

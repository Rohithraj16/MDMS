import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import AddMeterDialog from "../components/AddMeterDialog";
import {
	getZoneDashboard,
	getZones,
	type DashboardPeriod,
	type ZoneDashboard,
	type ZoneOption,
} from "../services/zoneApi";
import "./DashboardPage.css";

const numberFormatter = new Intl.NumberFormat("en-IN", {
	maximumFractionDigits: 2,
});

function quoteCsv(value: string | number): string {
	return `"${String(value).replaceAll('"', '""')}"`;
}

export default function DashboardPage() {
	const [zones, setZones] = useState<ZoneOption[]>([]);
	const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
	const [period, setPeriod] = useState<DashboardPeriod>("weekly");
	const [dashboardResult, setDashboardResult] = useState<{
		key: string;
		data?: ZoneDashboard;
		error?: string;
	}>({ key: "" });
	const [isLoadingZones, setIsLoadingZones] = useState(true);
	const [zonesError, setZonesError] = useState<string | null>(null);
	const [refreshKey, setRefreshKey] = useState(0);
	const [isAddMeterOpen, setIsAddMeterOpen] = useState(false);

	const selectedZone = useMemo(
		() => zones.find((zone) => zone.id === selectedZoneId) ?? null,
		[selectedZoneId, zones],
	);
	const dashboardRequestKey =
		selectedZoneId === null ? "" : `${selectedZoneId}-${period}-${refreshKey}`;
	const dashboard =
		dashboardResult.key === dashboardRequestKey
			? (dashboardResult.data ?? null)
			: null;
	const isLoadingDashboard =
		selectedZoneId !== null && dashboardResult.key !== dashboardRequestKey;
	const loadError =
		zonesError ??
		(dashboardResult.key === dashboardRequestKey
			? (dashboardResult.error ?? null)
			: null);

	useEffect(() => {
		const controller = new AbortController();
		getZones(controller.signal)
			.then((items) => {
				setZones(items);
				setSelectedZoneId((current) => current ?? items[0]?.id ?? null);
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setZonesError(getErrorMessage(error));
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					setIsLoadingZones(false);
				}
			});

		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (selectedZoneId === null) {
			return;
		}

		const requestKey = `${selectedZoneId}-${period}-${refreshKey}`;
		const controller = new AbortController();
		getZoneDashboard(selectedZoneId, period, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setDashboardResult({ key: requestKey, data });
				}
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setDashboardResult({
						key: requestKey,
						error: getErrorMessage(error),
					});
				}
			});

		return () => controller.abort();
	}, [period, refreshKey, selectedZoneId]);

	function generateReport() {
		if (!dashboard) {
			return;
		}

		const rows: (string | number)[][] = [
			["Zone", dashboard.zoneName],
			["Period", dashboard.period],
			["Data through", dashboard.dataThrough ?? "No reading data"],
			["Active meters", dashboard.activeMeters],
			["Average daily usage (kWh per meter)", dashboard.averageDailyUsageKwh],
			["Pending alerts", dashboard.pendingAlerts],
			[],
			["Period", "Consumption (kWh)"],
			...dashboard.consumption.map((bucket) => [
				bucket.label,
				bucket.usageKwh,
			]),
		];
		const csv = rows.map((row) => row.map(quoteCsv).join(",")).join("\r\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
		const downloadUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = downloadUrl;
		anchor.download = `${dashboard.zoneName.toLowerCase()}-${dashboard.period}-report.csv`;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
	}

	const maximumUsage = Math.max(
		0,
		...(dashboard?.consumption.map((bucket) => bucket.usageKwh) ?? []),
	);
	const statsLoading = isLoadingZones || isLoadingDashboard;
	const statsUnavailable = Boolean(loadError);

	return (
		<div className="zone-dashboard">
			<PageHeader
				title="Zone Dashboard"
				subtitle="Monitor meter activity, usage, and pending alerts for a zone."
				actions={
					<div className="zone-dashboard__actions">
						<label className="zone-dashboard__zone-picker">
							<span className="zone-dashboard__sr-only">Select zone</span>
							<select
								aria-label="Select zone"
								value={selectedZoneId ?? ""}
								onChange={(event) =>
									setSelectedZoneId(Number(event.target.value))
								}
								disabled={isLoadingZones || zones.length === 0}
							>
								{zones.map((zone) => (
									<option key={zone.id} value={zone.id}>
										{zone.name}
									</option>
								))}
							</select>
						</label>
						<button
							className="zone-dashboard__button zone-dashboard__button--secondary"
							type="button"
							onClick={() => setIsAddMeterOpen(true)}
							disabled={selectedZoneId === null}
						>
							Add Meter
						</button>
						<button
							className="zone-dashboard__button zone-dashboard__button--primary"
							type="button"
							onClick={generateReport}
							disabled={!dashboard || isLoadingDashboard}
						>
							Generate Report
						</button>
					</div>
				}
			/>

			{loadError && <p className="zone-dashboard__error" role="alert">{loadError}</p>}

			<section className="zone-dashboard__stats" aria-label="Zone metrics">
				<StatCard
					label="Active Meters"
					value={
						statsLoading
							? "…"
							: statsUnavailable
								? "—"
								: (dashboard?.activeMeters ?? 0)
					}
					description="Currently active in this zone"
					icon="⚡"
					accent="blue"
				/>
				<StatCard
					label="Average Daily Usage"
					value={
						statsLoading
							? "…"
							: statsUnavailable
								? "—"
								: `${numberFormatter.format(dashboard?.averageDailyUsageKwh ?? 0)} kWh`
					}
					description="Per meter for the selected period"
					icon="📊"
					accent="green"
				/>
				<StatCard
					label="Pending Alerts"
					value={
						statsLoading
							? "…"
							: statsUnavailable
								? "—"
								: (dashboard?.pendingAlerts ?? 0)
					}
					description="Alerts that need attention"
					icon="⚠️"
					accent="red"
				/>
			</section>

			<section className="zone-dashboard__panel">
				<div className="zone-dashboard__panel-header">
					<div>
						<h2>Consumption</h2>
						<p>
							{selectedZone?.name ?? "Selected zone"} usage
							{dashboard?.dataThrough
								? ` through ${new Date(`${dashboard.dataThrough}T00:00:00`).toLocaleDateString()}`
								: ""}
						</p>
					</div>
					<label className="zone-dashboard__period-picker">
						<span className="zone-dashboard__sr-only">Consumption period</span>
						<select
							aria-label="Consumption period"
							value={period}
							onChange={(event) =>
								setPeriod(
									event.target.value === "monthly" ? "monthly" : "weekly",
								)
							}
						>
							<option value="weekly">Weekly</option>
							<option value="monthly">Monthly</option>
						</select>
					</label>
				</div>

				{isLoadingDashboard ? (
					<p className="zone-dashboard__status" role="status">
						Loading consumption…
					</p>
				) : dashboard?.consumption.length ? (
					<div
						className="zone-dashboard__chart"
						role="img"
						aria-label={`${dashboard.period} consumption for ${dashboard.zoneName}`}
					>
						{dashboard.consumption.map((bucket) => (
							<div className="zone-dashboard__chart-row" key={bucket.label}>
								<span className="zone-dashboard__chart-label">
									{bucket.label}
								</span>
								<div className="zone-dashboard__chart-track">
									<div
										className="zone-dashboard__chart-bar"
										style={{
											width: maximumUsage
												? `${(bucket.usageKwh / maximumUsage) * 100}%`
												: "0%",
										}}
									/>
								</div>
								<span className="zone-dashboard__chart-value">
									{numberFormatter.format(bucket.usageKwh)} kWh
								</span>
							</div>
						))}
					</div>
				) : (
					<p className="zone-dashboard__status">
						No meter-reading history is available for this zone.
					</p>
				)}
			</section>

			{isAddMeterOpen && selectedZone && (
				<AddMeterDialog
					isOpen={isAddMeterOpen}
					zoneId={selectedZone.id}
					zoneName={selectedZone.name}
					onClose={() => setIsAddMeterOpen(false)}
					onCreated={() => setRefreshKey((current) => current + 1)}
				/>
			)}
		</div>
	);
}

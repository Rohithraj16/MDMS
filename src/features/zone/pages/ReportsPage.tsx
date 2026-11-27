import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import {
	getZoneMeters,
	getZoneReport,
	getZones,
	type MeterUsageSummary,
	type ZoneOption,
	type ZoneReport,
} from "../services/zoneApi";
import type { Meter } from "../types/Meter";
import "./ReportsPage.css";

function localDate(value: Date): string {
	const year = value.getFullYear();
	const month = String(value.getMonth() + 1).padStart(2, "0");
	const day = String(value.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatKwh(value: number | null): string {
	return value === null
		? "—"
		: `${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kWh`;
}

const meterColumns: DataTableColumn<MeterUsageSummary>[] = [
	{ key: "meterNumber", header: "Meter number" },
	{ key: "customerName", header: "Customer" },
	{ key: "status", header: "Status" },
	{
		key: "totalUsageKwh",
		header: "Total usage",
		render: (meter) => formatKwh(meter.totalUsageKwh),
	},
	{
		key: "averageDailyUsageKwh",
		header: "Daily average",
		render: (meter) => formatKwh(meter.averageDailyUsageKwh),
	},
	{
		key: "latestReadingKwh",
		header: "Latest reading",
		render: (meter) => formatKwh(meter.latestReadingKwh),
	},
];

export default function ReportsPage() {
	const [zones, setZones] = useState<ZoneOption[]>([]);
	const [zonesError, setZonesError] = useState("");
	const [isLoadingZones, setIsLoadingZones] = useState(true);
	const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
	const [metersResult, setMetersResult] = useState<{
		zoneId: number;
		meters: Meter[];
		error?: string;
	} | null>(null);
	const [meterNumber, setMeterNumber] = useState("");
	const [toDate, setToDate] = useState(() => localDate(new Date()));
	const [fromDate, setFromDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() - 6);
		return localDate(date);
	});
	const [reportResult, setReportResult] = useState<{
		key: string;
		data?: ZoneReport;
		error?: string;
	}>({ key: "" });

	useEffect(() => {
		const controller = new AbortController();
		getZones(controller.signal)
			.then((items) => setZones(items))
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

	const zoneId = selectedZoneId ?? zones[0]?.id ?? null;

	useEffect(() => {
		if (zoneId === null) return;
		const controller = new AbortController();
		getZoneMeters(zoneId, controller.signal)
			.then((meters) => setMetersResult({ zoneId, meters }))
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setMetersResult({ zoneId, meters: [], error: getErrorMessage(error) });
				}
			});
		return () => controller.abort();
	}, [zoneId]);

	const rangeError =
		fromDate && toDate && fromDate > toDate
			? "The start date must be on or before the end date."
			: "";
	const reportKey =
		zoneId !== null && fromDate && toDate && !rangeError
			? `${zoneId}-${fromDate}-${toDate}-${meterNumber}`
			: "";
	const report =
		reportResult.key === reportKey ? (reportResult.data ?? null) : null;
	const reportError =
		reportResult.key === reportKey ? (reportResult.error ?? "") : "";
	const isLoadingReport = Boolean(reportKey) && reportResult.key !== reportKey;
	const meters = metersResult?.zoneId === zoneId ? metersResult.meters : [];
	const metersError =
		metersResult?.zoneId === zoneId ? (metersResult.error ?? "") : "";
	const maximumUsage = Math.max(
		0,
		...(report?.trend.map((point) => point.usageKwh) ?? []),
	);

	useEffect(() => {
		if (!reportKey || zoneId === null) return;
		const controller = new AbortController();
		getZoneReport(zoneId, fromDate, toDate, meterNumber, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setReportResult({ key: reportKey, data });
				}
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setReportResult({ key: reportKey, error: getErrorMessage(error) });
				}
			});
		return () => controller.abort();
	}, [fromDate, meterNumber, reportKey, toDate, zoneId]);

	const zoneOptions = useMemo(
		() => zones.map((zone) => ({ id: zone.id, name: zone.name })),
		[zones],
	);

	return (
		<section className="zone-reports">
			<PageHeader
				title="Zone Reports & Analytics"
				subtitle="Explore meter consumption and usage trends for a selected period."
			/>

			{zonesError && <p className="zone-reports__error" role="alert">{zonesError}</p>}

			<section className="zone-reports__filters" aria-label="Report filters">
				<label>
					<span>Zone</span>
					<select
						aria-label="Select report zone"
						value={zoneId ?? ""}
						onChange={(event) => {
							setSelectedZoneId(Number(event.target.value));
							setMeterNumber("");
						}}
						disabled={isLoadingZones || zoneOptions.length === 0}
					>
						{zoneOptions.map((zone) => (
							<option key={zone.id} value={zone.id}>{zone.name}</option>
						))}
					</select>
				</label>
				<label>
					<span>From date</span>
					<input
						type="date"
						aria-label="Report start date"
						value={fromDate}
						max={toDate || undefined}
						onChange={(event) => setFromDate(event.target.value)}
					/>
				</label>
				<label>
					<span>To date</span>
					<input
						type="date"
						aria-label="Report end date"
						value={toDate}
						min={fromDate || undefined}
						onChange={(event) => setToDate(event.target.value)}
					/>
				</label>
				<label>
					<span>Meter</span>
					<select
						aria-label="Filter by meter"
						value={meterNumber}
						onChange={(event) => setMeterNumber(event.target.value)}
						disabled={meters.length === 0}
					>
						<option value="">All meters</option>
						{meters.map((meter) => (
							<option key={meter.id} value={meter.id}>{meter.id}</option>
						))}
					</select>
				</label>
			</section>

			{metersError && <p className="zone-reports__error" role="alert">{metersError}</p>}
			{rangeError && <p className="zone-reports__error" role="alert">{rangeError}</p>}
			{reportError && <p className="zone-reports__error" role="alert">{reportError}</p>}

			{isLoadingZones || isLoadingReport ? (
				<p className="zone-reports__state" role="status">Loading report…</p>
			) : report ? (
				<>
					<section className="zone-reports__summary" aria-label="Report summary">
						<StatCard
							label="Total usage"
							value={formatKwh(report.totalUsageKwh)}
							description={`${report.fromDate} to ${report.toDate}`}
							accent="blue"
						/>
						<StatCard
							label="Average daily usage"
							value={formatKwh(report.averageDailyUsageKwh)}
							description="Combined usage across selected meters"
							accent="green"
						/>
						<StatCard
							label="Meters included"
							value={String(report.meterCount)}
							description={report.zoneName}
							accent="orange"
						/>
					</section>

					<section className="zone-reports__panel" aria-label="Usage trend">
						<div className="zone-reports__panel-heading">
							<div>
								<h2>Daily usage trend</h2>
								<p>{report.zoneName} · {report.fromDate} to {report.toDate}</p>
							</div>
						</div>
						{report.trend.length === 0 ? (
							<p className="zone-reports__state">No readings for this date range.</p>
						) : (
							<div className="zone-reports__chart" role="img" aria-label="Daily meter usage trend in kilowatt-hours">
								{report.trend.map((point) => {
									const percent = maximumUsage === 0
										? 0
										: (point.usageKwh / maximumUsage) * 100;
									return (
										<div className="zone-reports__bar-column" key={point.date}>
											<strong>{point.usageKwh.toLocaleString("en-IN", { maximumFractionDigits: 1 })}</strong>
											<div className="zone-reports__bar-track">
												<div
													className="zone-reports__bar"
													style={{ height: `${percent}%` }}
													title={`${point.date}: ${formatKwh(point.usageKwh)}`}
												/>
											</div>
											<span>{point.date.slice(5)}</span>
										</div>
									);
								})}
							</div>
						)}
					</section>

					<section className="zone-reports__panel">
						<div className="zone-reports__panel-heading">
							<div>
								<h2>Meter summary</h2>
								<p>Consumption totals for each meter in this report.</p>
							</div>
						</div>
						<DataTable
							data={report.meters}
							columns={meterColumns}
							getRowKey={(meter) => meter.meterNumber}
							pageSize={10}
						/>
					</section>
				</>
			) : !zonesError && !rangeError && !reportError ? (
				<p className="zone-reports__state" role="status">Select a zone and date range to view a report.</p>
			) : null}
		</section>
	);
}

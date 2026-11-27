import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge from "../../../shared/components/StatusBadge";
import Tabs, { type TabItem } from "../../../shared/components/Tabs";
import {
	getZoneAlerts,
	getZones,
	updateZoneAlertStatus,
	type ZoneAlert,
	type ZoneAlertStatus,
	type ZoneOption,
} from "../services/zoneApi";
import "./AlertsPage.css";

type AlertFilter = "all" | ZoneAlertStatus;

const alertTabs: TabItem<AlertFilter>[] = [
	{ value: "all", label: "All alerts" },
	{ value: "Pending", label: "Pending" },
	{ value: "Resolved", label: "Resolved" },
];

function formatAlertDate(value: string): string {
	return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export default function AlertsPage() {
	const [zones, setZones] = useState<ZoneOption[]>([]);
	const [zonesError, setZonesError] = useState("");
	const [isLoadingZones, setIsLoadingZones] = useState(true);
	const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
	const [filter, setFilter] = useState<AlertFilter>("all");
	const [refreshKey, setRefreshKey] = useState(0);
	const [alertsResult, setAlertsResult] = useState<{
		key: string;
		data?: ZoneAlert[];
		error?: string;
	}>({ key: "" });
	const [actionError, setActionError] = useState("");
	const [busyAlert, setBusyAlert] = useState("");

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
	const requestKey = zoneId === null
		? ""
		: `${zoneId}-${filter}-${refreshKey}`;
	const alerts =
		alertsResult.key === requestKey ? (alertsResult.data ?? []) : [];
	const alertsError =
		alertsResult.key === requestKey ? (alertsResult.error ?? "") : "";
	const isLoadingAlerts = Boolean(requestKey) && alertsResult.key !== requestKey;

	useEffect(() => {
		if (!requestKey || zoneId === null) return;
		const controller = new AbortController();
		getZoneAlerts(
			zoneId,
			filter === "all" ? undefined : filter,
			controller.signal,
		)
			.then((data) => {
				if (!controller.signal.aborted) {
					setAlertsResult({ key: requestKey, data });
				}
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setAlertsResult({ key: requestKey, error: getErrorMessage(error) });
				}
			});
		return () => controller.abort();
	}, [filter, requestKey, zoneId]);

	async function changeAlertStatus(
		alert: ZoneAlert,
		status: ZoneAlertStatus,
	): Promise<void> {
		if (zoneId === null) return;
		setBusyAlert(alert.alertNumber);
		setActionError("");
		try {
			await updateZoneAlertStatus(zoneId, alert.alertNumber, status);
			setRefreshKey((current) => current + 1);
		} catch (error) {
			setActionError(getErrorMessage(error));
		} finally {
			setBusyAlert("");
		}
	}

	const columns: DataTableColumn<ZoneAlert>[] = [
		{ key: "alertNumber", header: "Alert ID" },
		{
			key: "title",
			header: "Alert",
			render: (alert) => (
				<div className="zone-alerts__summary">
					<span>{alert.title}</span>
					<button
						type="button"
						className="zone-alerts__action"
						onClick={() =>
							void changeAlertStatus(
								alert,
								alert.status === "Pending" ? "Resolved" : "Pending",
							)
						}
						disabled={busyAlert === alert.alertNumber}
					>
						{busyAlert === alert.alertNumber
							? "Saving…"
							: alert.status === "Pending"
								? "Resolve"
								: "Reopen"}
					</button>
				</div>
			),
		},
		{ key: "meterNumber", header: "Meter" },
		{ key: "customerName", header: "Customer" },
		{
			key: "severity",
			header: "Severity",
			render: (alert) => (
				<StatusBadge
					label={alert.severity}
					tone={
						alert.severity === "Critical"
							? "danger"
							: alert.severity === "High"
								? "warning"
								: "neutral"
					}
				/>
			),
		},
		{
			key: "createdDate",
			header: "Date",
			render: (alert) => formatAlertDate(alert.createdDate),
		},
		{
			key: "status",
			header: "Status",
			render: (alert) => (
				<StatusBadge
					label={alert.status}
					tone={alert.status === "Resolved" ? "success" : "warning"}
				/>
			),
		},
	];

	return (
		<section className="zone-alerts">
			<PageHeader
				title="Zone Alerts"
				subtitle="Review and manage alerts raised by meters in your zone."
				actions={
					<label className="zone-alerts__zone-picker">
						<span>Zone</span>
						<select
							aria-label="Select alert zone"
							value={zoneId ?? ""}
							onChange={(event) => setSelectedZoneId(Number(event.target.value))}
							disabled={isLoadingZones || zones.length === 0}
						>
							{zones.map((zone) => (
								<option key={zone.id} value={zone.id}>{zone.name}</option>
							))}
						</select>
					</label>
				}
			/>

			{zonesError && <p className="zone-alerts__error" role="alert">{zonesError}</p>}
			<Tabs
				items={alertTabs}
				value={filter}
				onChange={setFilter}
				ariaLabel="Filter alerts by status"
			/>
			{actionError && <p className="zone-alerts__error" role="alert">{actionError}</p>}
			{alertsError && <p className="zone-alerts__error" role="alert">{alertsError}</p>}
			{isLoadingZones || isLoadingAlerts ? (
				<p className="zone-alerts__state" role="status">Loading alerts…</p>
			) : alertsError || zonesError ? null : (
				<div className="zone-alerts__table">
					<DataTable
						data={alerts}
						columns={columns}
						getRowKey={(alert) => alert.alertNumber}
						pageSize={10}
					/>
				</div>
			)}
		</section>
	);
}

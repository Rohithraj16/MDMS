import http from "../../../services/http";
import type { Meter, MeterStatus } from "../types/Meter";

export type DashboardPeriod = "weekly" | "monthly";

export interface ZoneOption {
	id: number;
	code: string;
	name: string;
	customerCount: number;
}

export interface ZoneCustomer {
	id: number;
	accountNumber: string;
	fullName: string;
	zoneId: number;
	zone: string;
	meterCount: number;
}

export interface CustomerMeter {
	id: string;
	status: MeterStatus;
	readingKwh: number;
	lastUpdated: string;
}

export interface CustomerDetails {
	id: number;
	accountNumber: string;
	fullName: string;
	zoneId: number;
	zone: string;
	meters: CustomerMeter[];
}

export interface MeterDetails {
	id: string;
	zone: string;
	status: MeterStatus;
	readingKwh: number;
	lastUpdated: string;
	customerId: number;
	accountNumber: string;
	customerName: string;
}

export interface ConsumptionBucket {
	label: string;
	usageKwh: number;
}

export interface ZoneDashboard {
	zoneId: number;
	zoneName: string;
	activeMeters: number;
	averageDailyUsageKwh: number;
	pendingAlerts: number;
	period: DashboardPeriod;
	dataThrough: string | null;
	consumption: ConsumptionBucket[];
}

export interface CreateMeterRequest {
	meterNumber: string;
	customerId: number;
}

export interface ZoneReport {
	zoneId: number;
	zoneName: string;
	fromDate: string;
	toDate: string;
	totalUsageKwh: number;
	averageDailyUsageKwh: number;
	meterCount: number;
	trend: { date: string; usageKwh: number }[];
	meters: MeterUsageSummary[];
}

export interface MeterUsageSummary {
	meterNumber: string;
	customerName: string;
	status: MeterStatus;
	totalUsageKwh: number;
	averageDailyUsageKwh: number;
	latestReadingKwh: number | null;
}

export type ZoneAlertStatus = "Pending" | "Resolved";

export interface ZoneAlert {
	alertNumber: string;
	title: string;
	severity: string;
	status: ZoneAlertStatus;
	createdDate: string;
	meterNumber: string;
	customerName: string;
}

export interface ZoneSettings {
	zoneId: number;
	highConsumptionThresholdKwh: number;
	lowVoltageThresholdVolts: number;
	highVoltageThresholdVolts: number;
	emailNotificationsEnabled: boolean;
	smsNotificationsEnabled: boolean;
	inAppNotificationsEnabled: boolean;
}

export async function getZones(signal?: AbortSignal): Promise<ZoneOption[]> {
	const response = await http.get<ZoneOption[]>("/api/zones", { signal });
	return response.data;
}

export async function getZoneMeters(
	zoneId: number,
	signal?: AbortSignal,
): Promise<Meter[]> {
	const response = await http.get<Meter[]>("/api/meters", {
		params: { zoneId },
		signal,
	});
	return response.data;
}

export async function getZoneCustomers(
	zoneId: number,
	signal?: AbortSignal,
): Promise<ZoneCustomer[]> {
	return getCustomers(zoneId, signal);
}

export async function getCustomers(
	zoneId?: number,
	signal?: AbortSignal,
): Promise<ZoneCustomer[]> {
	const response = await http.get<ZoneCustomer[]>("/api/customers", {
		params: zoneId === undefined ? undefined : { zoneId },
		signal,
	});
	return response.data;
}

export async function getCustomerDetails(
	customerId: number,
	signal?: AbortSignal,
): Promise<CustomerDetails> {
	const response = await http.get<CustomerDetails>(
		`/api/customers/${customerId}`,
		{ signal },
	);
	return response.data;
}

export async function getMeterDetails(
	meterNumber: string,
	signal?: AbortSignal,
): Promise<MeterDetails> {
	const response = await http.get<MeterDetails>(
		`/api/meters/${encodeURIComponent(meterNumber)}`,
		{ signal },
	);
	return response.data;
}

export async function getZoneDashboard(
	zoneId: number,
	period: DashboardPeriod,
	signal?: AbortSignal,
): Promise<ZoneDashboard> {
	const response = await http.get<ZoneDashboard>(
		`/api/zones/${zoneId}/dashboard`,
		{ params: { period }, signal },
	);
	return response.data;
}

export async function createMeter(
	request: CreateMeterRequest,
	signal?: AbortSignal,
): Promise<void> {
	await http.post("/api/meters", request, { signal });
}

export async function getZoneReport(
	zoneId: number,
	fromDate: string,
	toDate: string,
	meterNumber?: string,
	signal?: AbortSignal,
): Promise<ZoneReport> {
	const response = await http.get<ZoneReport>(
		`/api/zones/${zoneId}/reports/consumption`,
		{
			params: { fromDate, toDate, meterNumber: meterNumber || undefined },
			signal,
		},
	);
	return response.data;
}

export async function getZoneAlerts(
	zoneId: number,
	status?: ZoneAlertStatus,
	signal?: AbortSignal,
): Promise<ZoneAlert[]> {
	const response = await http.get<ZoneAlert[]>(
		`/api/zones/${zoneId}/alerts`,
		{ params: { status }, signal },
	);
	return response.data;
}

export async function updateZoneAlertStatus(
	zoneId: number,
	alertNumber: string,
	status: ZoneAlertStatus,
	signal?: AbortSignal,
): Promise<ZoneAlert> {
	const response = await http.patch<ZoneAlert>(
		`/api/zones/${zoneId}/alerts/${encodeURIComponent(alertNumber)}/status`,
		{ status },
		{ signal },
	);
	return response.data;
}

export async function getZoneSettings(
	zoneId: number,
	signal?: AbortSignal,
): Promise<ZoneSettings> {
	const response = await http.get<ZoneSettings>(
		`/api/zones/${zoneId}/settings`,
		{ signal },
	);
	return response.data;
}

export async function updateZoneSettings(
	settings: ZoneSettings,
	signal?: AbortSignal,
): Promise<ZoneSettings> {
	const response = await http.put<ZoneSettings>(
		`/api/zones/${settings.zoneId}/settings`,
		{
			highConsumptionThresholdKwh: settings.highConsumptionThresholdKwh,
			lowVoltageThresholdVolts: settings.lowVoltageThresholdVolts,
			highVoltageThresholdVolts: settings.highVoltageThresholdVolts,
			emailNotificationsEnabled: settings.emailNotificationsEnabled,
			smsNotificationsEnabled: settings.smsNotificationsEnabled,
			inAppNotificationsEnabled: settings.inAppNotificationsEnabled,
		},
		{ signal },
	);
	return response.data;
}

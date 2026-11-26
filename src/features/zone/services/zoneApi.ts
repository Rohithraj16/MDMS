import http from "../../../services/http";
import type { MeterStatus } from "../types/Meter";

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

export async function getZones(signal?: AbortSignal): Promise<ZoneOption[]> {
	const response = await http.get<ZoneOption[]>("/api/zones", { signal });
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

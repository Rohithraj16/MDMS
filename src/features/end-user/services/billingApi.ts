import axios from "axios";
import http from "../../../services/http";
import type { Bill, BillDay, BillDetails, DataSource, MeterData, MeterDataPeriod, MeterUsagePoint } from "../types/billing";

export interface ApiResult<T> {
	data: T;
	source: DataSource;
}

function toIsoDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function createDemoBillDays(month: Date): BillDay[] {
	const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
	let reading = 1200;
	return Array.from({ length: count }, (_, index) => {
		const consumption = Number((8 + ((index * 7) % 19) + (index % 3) * 0.35).toFixed(2));
		reading += consumption;
		return {
			date: toIsoDate(new Date(month.getFullYear(), month.getMonth(), index + 1)),
			readingKwh: reading,
			consumptionKwh: consumption,
			cost: Number((consumption * 7.5).toFixed(2)),
		};
	});
}

function createDemoBills(): Bill[] {
	const now = new Date();
	return Array.from({ length: 12 }, (_, offset) => {
		const month = new Date(now.getFullYear(), now.getMonth() - offset, 1);
		const monthIndex = month.getFullYear() * 12 + month.getMonth() + 1;
		const status = monthIndex % 6 === 0 ? "Overdue" : monthIndex % 6 === 1 ? "Pending" : "Paid";
		const id = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
		const amount = createDemoBillDays(month).reduce((total, day) => total + day.cost, 0);
		return {
			id,
			billingMonth: `${id}-01`,
			amount,
			dueDate: toIsoDate(new Date(month.getFullYear(), month.getMonth() + 1, 10)),
			status,
			paidOn: status === "Paid" ? toIsoDate(new Date(month.getFullYear(), month.getMonth() + 1, -1)) : null,
		};
	});
}

function createDemoBillDetails(billId: string): BillDetails {
	const bill = createDemoBills().find((item) => item.id === billId);
	if (!bill) throw new Error("Bill not found");
	const month = new Date(`${bill.billingMonth}T00:00:00`);
	return { bill, meterNumber: "MTR-1001", days: createDemoBillDays(month) };
}

function createDemoMeterData(period: MeterDataPeriod): MeterData {
	const today = new Date();
	const count = period === "day" ? 24 : period === "week" ? 7 : 30;
	const makeSeries = (previousOffset: number): MeterUsagePoint[] => {
		let reading = 1000 + previousOffset * 220;
		return Array.from({ length: count }, (_, index) => {
			const date = period === "day"
				? today
				: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (count - index - 1) - previousOffset * count);
			const consumption = Number(((period === "day" ? 0.45 : 5.2) + ((index * 11 + previousOffset * 3) % 17) * 0.42).toFixed(2));
			reading += consumption;
			return {
				label: period === "day" ? `${String(index).padStart(2, "0")}:00` : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
				date: toIsoDate(date),
				readingKwh: reading,
				consumptionKwh: consumption,
				notes: index % 9 === 0 ? "Peak usage" : "Normal",
			};
		});
	};
	return { meterNumber: "MTR-1001", current: makeSeries(0), previous: makeSeries(1) };
}

async function useDemoIfApiUnavailable<T>(request: () => Promise<T>, demo: () => T, signal?: AbortSignal): Promise<ApiResult<T>> {
	try {
		return { data: await request(), source: "api" };
	} catch (error) {
		if (!signal?.aborted && !axios.isCancel(error) && axios.isAxiosError(error) && !error.response) {
			return { data: demo(), source: "demo" };
		}
		throw error;
	}
}

export async function getBills(signal?: AbortSignal): Promise<ApiResult<Bill[]>> {
	return useDemoIfApiUnavailable(async () => {
		const { data } = await http.get<Bill[]>("/api/enduser/bills", { signal });
		return data;
	}, createDemoBills, signal);
}

export async function getBillDetails(
	billId: string,
	signal?: AbortSignal,
): Promise<ApiResult<BillDetails>> {
	return useDemoIfApiUnavailable(async () => {
		const { data } = await http.get<BillDetails>(
			`/api/enduser/bills/${encodeURIComponent(billId)}`,
			{ signal },
		);
		return data;
	}, () => createDemoBillDetails(billId), signal);
}

export async function getMeterData(
	period: MeterDataPeriod,
	signal?: AbortSignal,
): Promise<ApiResult<MeterData>> {
	return useDemoIfApiUnavailable(async () => {
		const { data } = await http.get<MeterData>("/api/enduser/meter-data", {
			params: { period },
			signal,
		});
		return data;
	}, () => createDemoMeterData(period), signal);
}

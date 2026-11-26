export type BillStatus = "Pending" | "Paid" | "Overdue";
export type DataSource = "api" | "demo";

export interface Bill {
	id: string;
	billingMonth: string;
	amount: number;
	dueDate: string;
	status: BillStatus;
	paidOn: string | null;
}

export interface BillDay {
	date: string;
	readingKwh: number;
	consumptionKwh: number;
	cost: number;
}

export interface BillDetails {
	bill: Bill;
	meterNumber: string;
	days: BillDay[];
}

export type MeterDataPeriod = "day" | "week" | "month";

export interface MeterUsagePoint {
	label: string;
	date: string;
	readingKwh: number;
	consumptionKwh: number;
	notes: string;
}

export interface MeterData {
	meterNumber: string;
	current: MeterUsagePoint[];
	previous: MeterUsagePoint[];
}

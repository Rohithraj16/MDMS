export type Period = "day" | "week" | "month" | "year";

export interface ConsumptionPoint {
	label: string;
	value: number; // kWh
}

export interface DashboardData {
	userName: string;
	currentConsumption: number; // kWh in the selected period
	currentBill: number; // rupees
	activeMeters: number;
	unreadAlerts: number;
	consumption: ConsumptionPoint[];
}

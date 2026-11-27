import axios from "axios";
import http from "../../../services/http";
import type { DashboardData, Period } from "../types/dashboard";

// Set VITE_USE_MOCK=true in .env to work without the C# API
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_LABELS: Record<Period, string[]> = {
	day: ["12am", "4am", "8am", "12pm", "4pm", "8pm"],
	week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	month: ["W1", "W2", "W3", "W4"],
	year: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
};

function mockDashboard(period: Period): DashboardData {
	return {
		userName: "Rohith",
		currentConsumption: 248.5,
		currentBill: 1860,
		activeMeters: 2,
		unreadAlerts: 3,
		consumption: MOCK_LABELS[period].map((label, i) => ({
			label,
			value: 10 + ((i * 37) % 23),
		})),
	};
}

export async function getDashboard(period: Period): Promise<DashboardData> {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return { ...mockDashboard(period), dataSource: "demo" };
	}
	try {
		const { data } = await http.get<DashboardData>("/api/enduser/dashboard", {
			params: { period },
		});
		return { ...data, dataSource: "api" };
	} catch (error) {
		if (axios.isAxiosError(error) && !error.response && !axios.isCancel(error)) {
			return { ...mockDashboard(period), dataSource: "demo" };
		}
		throw error;
	}
}

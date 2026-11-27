import axios from "axios";
import http from "../../../services/http";
import type { EndUserNotification, NotificationFilter, NotificationsResult } from "../types/notifications";

const demoMessages: [string, string, string][] = [
	["Bill", "Your latest bill is ready", "Your November bill is available to view."],
	["Payment", "Payment due soon", "Your electricity bill is due in five days."],
	["Payment", "Payment received", "We received your payment of ₹1,860."],
	["Usage", "Higher than usual consumption", "Your usage was higher than your recent average yesterday."],
	["Meter", "Meter maintenance scheduled", "A technician visit is scheduled for your area."],
	["Bill", "Your October bill is ready", "Your October bill is available to view."],
	["Payment", "Payment due soon", "Your October bill is due in five days."],
	["Usage", "Weekly usage summary", "Your weekly consumption summary is ready."],
	["Meter", "Meter reading received", "A new reading was received from meter MTR-1001."],
	["Payment", "Payment received", "Your recent payment has been recorded."],
	["Usage", "Higher than usual consumption", "Your usage was higher than usual this week."],
	["Bill", "Your September bill is ready", "Your September bill is available to view."],
	["Meter", "Meter maintenance completed", "Scheduled maintenance for your meter is complete."],
	["Payment", "Payment due reminder", "Your bill payment date is approaching."],
	["Usage", "Monthly usage summary", "Your monthly consumption summary is ready."],
];

function createDemoNotifications(filter: NotificationFilter): EndUserNotification[] {
	const notifications = demoMessages.map(([type, title, message], index) => ({
		id: `NTF-${String(index + 1).padStart(4, "0")}`,
		type,
		title,
		message,
		createdAt: new Date(Date.now() - index * 5 * 60 * 60 * 1000).toISOString(),
		isRead: index % 3 !== 0,
	}));
	return filter === "unread" ? notifications.filter((notification) => !notification.isRead) : notifications;
}

export async function getNotifications(
	filter: NotificationFilter,
	signal?: AbortSignal,
): Promise<NotificationsResult> {
	try {
		const { data } = await http.get<EndUserNotification[]>("/api/enduser/notifications", {
			params: { unreadOnly: filter === "unread" },
			signal,
		});
		return { notifications: data, source: "api" };
	} catch (error) {
		if (signal?.aborted || axios.isCancel(error)) throw error;
		if (axios.isAxiosError(error) && !error.response) {
			return { notifications: createDemoNotifications(filter), source: "demo" };
		}
		throw error;
	}
}

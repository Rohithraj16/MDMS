export type NotificationFilter = "all" | "unread";

export interface EndUserNotification {
	id: string;
	type: string;
	title: string;
	message: string;
	createdAt: string;
	isRead: boolean;
}

export interface NotificationsResult {
	notifications: EndUserNotification[];
	source: "api" | "demo";
}

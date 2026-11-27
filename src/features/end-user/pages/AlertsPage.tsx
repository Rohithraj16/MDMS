import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import EmptyState from "../../../shared/components/EmptyState";
import PageHeader from "../../../shared/components/PageHeader";
import Tabs, { type TabItem } from "../../../shared/components/Tabs";
import { getNotifications } from "../services/notificationsApi";
import type { EndUserNotification, NotificationFilter } from "../types/notifications";
import "./AlertsPage.css";

const filterTabs: TabItem<NotificationFilter>[] = [
	{ value: "all", label: "All" },
	{ value: "unread", label: "Unread" },
];

function formatDate(value: string) {
	return new Date(value).toLocaleString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function NotificationItem({ notification }: { notification: EndUserNotification }) {
	return (
		<li>
			<article className={`notification-card${notification.isRead ? "" : " notification-card--unread"}`}>
				<div className="notification-card__marker" aria-hidden="true">{notification.type.slice(0, 1)}</div>
				<div className="notification-card__body">
					<div className="notification-card__title-row">
						<h2>{notification.title}</h2>
						{!notification.isRead && <span className="notification-unread-label"><i />Unread</span>}
					</div>
					<p>{notification.message}</p>
					<div className="notification-card__meta"><span>{notification.type}</span><time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time></div>
				</div>
			</article>
		</li>
	);
}

export default function AlertsPage() {
	const [filter, setFilter] = useState<NotificationFilter>("all");
	const [notifications, setNotifications] = useState<EndUserNotification[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isDemo, setIsDemo] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError("");
		getNotifications(filter, controller.signal)
			.then((result) => {
				setNotifications(result.notifications);
				setIsDemo(result.source === "demo");
			})
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) setError(getErrorMessage(requestError));
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [filter, attempt]);

	const unreadCount = filter === "unread"
		? notifications.length
		: notifications.filter((notification) => !notification.isRead).length;

	return (
		<section className="alerts-page">
			<PageHeader title="Alerts and notifications" subtitle="Updates about your bills, payments and meter activity." />
			<div className="alerts-toolbar">
				<Tabs items={filterTabs} value={filter} onChange={setFilter} ariaLabel="Filter notifications" />
				<span className="alerts-unread-count">{unreadCount} unread</span>
			</div>
			{isDemo && !loading && <p className="alerts-demo-note" role="status">Showing demo notifications because the API server is unavailable.</p>}
			{loading ? <p className="alerts-state" role="status">Loading notifications…</p> : error ? (
				<div className="alerts-error" role="alert"><span>{error}</span><button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button></div>
			) : notifications.length === 0 ? (
				<EmptyState title={filter === "unread" ? "You’re all caught up" : "No notifications yet"} description={filter === "unread" ? "You have no unread notifications." : "New bill, payment and meter updates will appear here."} />
			) : (
				<ul className="notification-list" aria-label={`${filter === "unread" ? "Unread" : "All"} notifications`}>
					{notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)}
				</ul>
			)}
		</section>
	);
}

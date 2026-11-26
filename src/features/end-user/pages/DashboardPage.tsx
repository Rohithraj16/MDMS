import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import ConsumptionChart from "../components/ConsumptionChart";
import PeriodSelector from "../components/PeriodSelector";
import StatCard from "../components/statCard";
import { useDashboard } from "../hooks/useDashboard";
import type { Period } from "../types/dashboard";
import "./DashboardPage.css";

const PERIOD_TEXT: Record<Period, string> = {
	day: "today",
	week: "this week",
	month: "this month",
	year: "this year",
};

export default function DashboardPage() {
	const [period, setPeriod] = useState<Period>("week");
	const { data, loading, error, retry } = useDashboard(period);

	const today = new Date().toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div>
			<PageHeader title="Dashboard" />

			<section className="welcome-banner">
				<h2>Welcome back{data ? `, ${data.userName}` : ""}</h2>
				<p>{today}</p>
			</section>

			{error && (
				<div className="dash-error" role="alert">
					<span>{error}</span>
					<button type="button" onClick={retry}>
						Try again
					</button>
				</div>
			)}

			<section className="stat-grid" aria-busy={loading}>
				<StatCard
					label={`Consumption ${PERIOD_TEXT[period]}`}
					value={data ? `${data.currentConsumption} kWh` : "..."}
				/>
				<StatCard
					label="Current bill"
					value={data ? `₹${data.currentBill.toLocaleString("en-IN")}` : "..."}
				/>
				<StatCard
					label="Active meters"
					value={data ? String(data.activeMeters) : "..."}
				/>
				<StatCard
					label="Unread alerts"
					value={data ? String(data.unreadAlerts) : "..."}
				/>
			</section>

			<section className="dash-card">
				<div className="dash-card__head">
					<h2>Consumption overview</h2>
					<PeriodSelector value={period} onChange={setPeriod} />
				</div>
				{loading ? (
					<p className="chart-empty">Loading...</p>
				) : (
					data && <ConsumptionChart points={data.consumption} />
				)}
			</section>

			<section className="dash-card">
				<h2>Quick actions</h2>
				<div className="quick-actions">
					<Link to="/user/bills" className="quick-actions__btn">
						Pay bill
					</Link>
					<Link to="/user/meter-data" className="quick-actions__btn">
						View meter data
					</Link>
					<Link to="/user/alerts" className="quick-actions__btn">
						View alerts
					</Link>
					<Link to="/profile" className="quick-actions__btn">
						Update profile
					</Link>
				</div>
			</section>
		</div>
	);
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getErrorMessage } from "../../../services/http";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge from "../../../shared/components/StatusBadge";
import { getBillDetails } from "../services/billingApi";
import type { BillDetails } from "../types/billing";
import "./BillDetailsPage.css";

const money = (value: number) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const date = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BillDetailsPage() {
	const { billId = "" } = useParams();
	const [details, setDetails] = useState<BillDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isDemo, setIsDemo] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError("");
		getBillDetails(billId, controller.signal)
			.then((result) => {
				setDetails(result.data);
				setIsDemo(result.source === "demo");
			})
			.catch((err: unknown) => {
				if (!controller.signal.aborted) setError(getErrorMessage(err));
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [billId]);

	if (loading) return <p role="status" className="bill-details-state">Loading bill details…</p>;
	if (error || !details) return (
		<section className="bill-details-page">
			<PageHeader title="Bill details" />
			<p role="alert" className="bill-details-error">{error || "Bill not found."}</p>
			<Link to="/user/bills">Back to bills</Link>
		</section>
	);

	const { bill, days, meterNumber } = details;
	return (
		<section className="bill-details-page">
			<div className="no-print"><PageHeader
				title={`Bill for ${new Date(`${bill.billingMonth}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`}
				subtitle={`Meter ${meterNumber}`}
				actions={<button className="bill-print-button" type="button" onClick={() => window.print()}>Print bill</button>}
			/></div>
			<div className="bill-summary">
				<div><span>Billing period</span><strong>{new Date(`${bill.billingMonth}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong></div>
				<div><span>Total amount</span><strong>{money(bill.amount)}</strong></div>
				<div><span>Due date</span><strong>{date(bill.dueDate)}</strong></div>
				<div><span>Status</span><StatusBadge label={bill.status} tone={bill.status === "Paid" ? "success" : bill.status === "Overdue" ? "danger" : "warning"} /></div>
				{bill.paidOn && <div><span>Paid on</span><strong>{date(bill.paidOn)}</strong></div>}
			</div>
			{isDemo && <p className="bill-details-demo-note no-print" role="status">Showing demo bill data because the API server is unavailable.</p>}
			<div className="bill-days-heading"><h2>Daily readings and charges</h2><span>{days.length} readings</span></div>
			<div className="bill-days-table-wrap">
				<table className="bill-days-table">
					<thead><tr><th>Date</th><th>Meter reading (kWh)</th><th>Consumption (kWh)</th><th>Cost</th></tr></thead>
					<tbody>{days.map((day) => <tr key={day.date}><td>{date(day.date)}</td><td>{day.readingKwh.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td><td>{day.consumptionKwh.toFixed(2)}</td><td>{money(day.cost)}</td></tr>)}</tbody>
				</table>
			</div>
			<p className="bill-detail-footer no-print"><Link to="/user/bills">← Back to bills</Link></p>
		</section>
	);
}

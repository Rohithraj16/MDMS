import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../services/http";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge, { type StatusBadgeTone } from "../../../shared/components/StatusBadge";
import Tabs, { type TabItem } from "../../../shared/components/Tabs";
import { getBills } from "../services/billingApi";
import type { Bill, BillStatus } from "../types/billing";
import "./BillsPage.css";

type BillFilter = "All" | BillStatus;

const statusTone: Record<BillStatus, StatusBadgeTone> = {
	Pending: "warning",
	Paid: "success",
	Overdue: "danger",
};

const billTabs: TabItem<BillFilter>[] = [
	{ value: "All", label: "All bills" },
	{ value: "Pending", label: "Pending" },
	{ value: "Paid", label: "Paid" },
	{ value: "Overdue", label: "Overdue" },
];

const columns: DataTableColumn<Bill>[] = [
	{
		key: "billingMonth",
		header: "Billing month",
		render: (bill) => new Date(`${bill.billingMonth}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
	},
	{ key: "amount", header: "Amount", render: (bill) => `₹${bill.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
	{ key: "dueDate", header: "Due date", render: (bill) => new Date(`${bill.dueDate}T00:00:00`).toLocaleDateString("en-IN") },
	{ key: "status", header: "Status", render: (bill) => <StatusBadge label={bill.status} tone={statusTone[bill.status]} /> },
	{
		key: "id",
		header: "Action",
		sortable: false,
		render: (bill) => <Link className="bill-action" to={`/user/bills/${bill.id}`}>View bill</Link>,
	},
];

export default function BillsPage() {
	const [bills, setBills] = useState<Bill[]>([]);
	const [filter, setFilter] = useState<BillFilter>("All");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isDemo, setIsDemo] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError("");
		getBills(controller.signal)
			.then((result) => {
				setBills(result.data);
				setIsDemo(result.source === "demo");
			})
			.catch((err: unknown) => {
				if (!controller.signal.aborted) setError(getErrorMessage(err));
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [attempt]);

	const visibleBills = useMemo(
		() => filter === "All" ? bills : bills.filter((bill) => bill.status === filter),
		[bills, filter],
	);

	return (
		<section className="bills-page">
			<PageHeader title="My bills" subtitle="Review your monthly bills and payment history." />
			<p className="bills-note">All bills are generated on the 1st of every month.</p>
			<Tabs items={billTabs} value={filter} onChange={setFilter} ariaLabel="Filter bills by status" />
			{isDemo && !loading && <p className="bills-demo-note" role="status">Showing demo bills because the API server is unavailable.</p>}
			{loading ? <p role="status" className="bills-state">Loading bills…</p> : error ? (
				<div className="bills-error" role="alert"><span>{error}</span><button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button></div>
			) : (
				<DataTable data={visibleBills} columns={columns} getRowKey={(bill) => bill.id} pageSize={8} />
			)}
		</section>
	);
}

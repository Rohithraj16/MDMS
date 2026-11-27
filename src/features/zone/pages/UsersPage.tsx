import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../services/http";
import DataTable, {
	type DataTableColumn,
} from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge, {
	type StatusBadgeTone,
} from "../../../shared/components/StatusBadge";
import type { MeterStatus } from "../types/Meter";
import {
	getCustomerDetails,
	getCustomers,
	type CustomerDetails,
	type CustomerMeter,
	type ZoneCustomer,
} from "../services/zoneApi";
import "./UsersPage.css";

function getCustomerColumns(
	onViewDetails: (customerId: number) => void,
): DataTableColumn<ZoneCustomer>[] {
	return [
		{ key: "accountNumber", header: "Account Number" },
		{ key: "fullName", header: "Customer" },
		{ key: "zone", header: "Zone" },
		{ key: "meterCount", header: "Meters" },
		{
			key: "id",
			header: "Details",
			sortable: false,
			render: (customer) => (
				<button
					className="zone-users__details-button"
					type="button"
					onClick={() => onViewDetails(customer.id)}
				>
					View details
				</button>
			),
		},
	];
}

const customerMeterColumns: DataTableColumn<CustomerMeter>[] = [
	{
		key: "id",
		header: "Meter ID",
		render: (meter) => (
			<Link to={`/zone/meters/${encodeURIComponent(meter.id)}`}>{meter.id}</Link>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (meter) => (
			<StatusBadge label={meter.status} tone={statusTones[meter.status]} />
		),
	},
	{ key: "readingKwh", header: "Reading (kWh)" },
	{ key: "lastUpdated", header: "Last Updated" },
];

const statusTones: Record<MeterStatus, StatusBadgeTone> = {
	Active: "active",
	Inactive: "inactive",
	Maintenance: "maintenance",
};

function CustomerDetailsDialog({
	customerId,
	onClose,
}: {
	customerId: number;
	onClose: () => void;
}) {
	const [result, setResult] = useState<{
		id: number;
		data?: CustomerDetails;
		error?: string;
	} | null>(null);
	const customer = result?.id === customerId ? (result.data ?? null) : null;
	const error = result?.id === customerId ? (result.error ?? null) : null;
	const isLoading = result?.id !== customerId;

	useEffect(() => {
		const controller = new AbortController();
		getCustomerDetails(customerId, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setResult({ id: customerId, data });
				}
			})
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) {
					setResult({
						id: customerId,
						error: getErrorMessage(requestError),
					});
				}
			});

		return () => controller.abort();
	}, [customerId]);

	return (
		<div
			className="zone-users__backdrop"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<section
				className="zone-users__dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="customer-details-title"
			>
				<div className="zone-users__dialog-header">
					<div>
						<h2 id="customer-details-title">
							{customer ? customer.fullName : "Customer details"}
						</h2>
						{customer && <p>{customer.accountNumber} · {customer.zone}</p>}
					</div>
					<button
						className="zone-users__close-button"
						type="button"
						onClick={onClose}
						aria-label="Close customer details"
					>
						×
					</button>
				</div>
				{isLoading ? (
					<p className="zone-users__message" role="status">
						Loading customer details…
					</p>
				) : error ? (
					<p className="zone-users__error" role="alert">{error}</p>
				) : customer ? (
					<>
						<dl className="zone-users__summary">
							<div>
								<dt>Customer ID</dt>
								<dd>{customer.id}</dd>
							</div>
							<div>
								<dt>Zone</dt>
								<dd>{customer.zone}</dd>
							</div>
							<div>
								<dt>Registered meters</dt>
								<dd>{customer.meters.length}</dd>
							</div>
						</dl>
						<h3 className="zone-users__meters-heading">Customer meters</h3>
						<DataTable
							data={customer.meters}
							columns={customerMeterColumns}
							getRowKey={(meter) => meter.id}
						/>
					</>
				) : null}
			</section>
		</div>
	);
}

export default function UsersPage() {
	const [customersResult, setCustomersResult] = useState<{
		data?: ZoneCustomer[];
		error?: string;
	} | null>(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
		null,
	);
	const customers = customersResult?.data ?? [];
	const error = customersResult?.error ?? null;
	const isLoading = customersResult === null;

	useEffect(() => {
		const controller = new AbortController();
		getCustomers(undefined, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setCustomersResult({ data });
				}
			})
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) {
					setCustomersResult({ error: getErrorMessage(requestError) });
				}
			});

		return () => controller.abort();
	}, []);

	const customerColumns = getCustomerColumns(setSelectedCustomerId);

	return (
		<section className="zone-users">
			<PageHeader
				title="Zone User Management"
				subtitle="Customer accounts and their registered meter information."
			/>

			{isLoading ? (
				<p className="zone-users__message" role="status">
					Loading customers…
				</p>
			) : error ? (
				<p className="zone-users__error" role="alert">{error}</p>
			) : (
				<DataTable
					data={customers}
					columns={customerColumns}
					getRowKey={(customer) => customer.id}
				/>
			)}

			{selectedCustomerId !== null && (
				<CustomerDetailsDialog
					customerId={selectedCustomerId}
					onClose={() => setSelectedCustomerId(null)}
				/>
			)}
		</section>
	);
}

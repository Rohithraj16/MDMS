import { useEffect, useState, type FormEvent } from "react";
import { getErrorMessage } from "../../../services/http";
import {
	createMeter,
	getCustomers,
	type ZoneCustomer,
} from "../services/zoneApi";
import "./AddMeterDialog.css";

interface AddMeterDialogProps {
	isOpen: boolean;
	zoneId?: number;
	zoneName?: string;
	onClose: () => void;
	onCreated: () => void;
}

export default function AddMeterDialog({
	isOpen,
	zoneId,
	zoneName,
	onClose,
	onCreated,
}: AddMeterDialogProps) {
	const [customerResult, setCustomerResult] = useState<{
		queryKey: number;
		items?: ZoneCustomer[];
		error?: string;
	} | null>(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState("");
	const [meterNumber, setMeterNumber] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const customerQueryKey = zoneId ?? 0;
	const customers =
		customerResult?.queryKey === customerQueryKey
			? (customerResult.items ?? [])
			: [];
	const customerLoadError =
		customerResult?.queryKey === customerQueryKey
			? (customerResult.error ?? null)
			: null;
	const isLoadingCustomers =
		isOpen && customerResult?.queryKey !== customerQueryKey;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const controller = new AbortController();
		getCustomers(zoneId, controller.signal)
			.then((items) => {
				if (controller.signal.aborted) {
					return;
				}
				setCustomerResult({ queryKey: customerQueryKey, items });
				setSelectedCustomerId((current) =>
					items.some((customer) => String(customer.id) === current)
						? current
						: String(items[0]?.id ?? ""),
				);
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setCustomerResult({
						queryKey: customerQueryKey,
						error: getErrorMessage(error),
					});
				}
			});

		return () => controller.abort();
	}, [customerQueryKey, isOpen, zoneId]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selectedCustomerId) {
			return;
		}

		setIsSaving(true);
		setFormError(null);
		try {
			await createMeter({
				meterNumber: meterNumber.trim(),
				customerId: Number(selectedCustomerId),
			});
			onClose();
			onCreated();
		} catch (error: unknown) {
			setFormError(getErrorMessage(error));
		} finally {
			setIsSaving(false);
		}
	}

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="add-meter-dialog__backdrop"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget && !isSaving) {
					onClose();
				}
			}}
		>
			<section
				className="add-meter-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="add-meter-dialog-title"
			>
				<h2 id="add-meter-dialog-title">
					{zoneName ? `Add meter to ${zoneName}` : "Add meter"}
				</h2>
				<form onSubmit={handleSubmit}>
					<label className="add-meter-dialog__field">
						<span>Meter number</span>
						<input
							autoFocus
							required
							minLength={4}
							maxLength={24}
							value={meterNumber}
							onChange={(event) => setMeterNumber(event.target.value)}
							placeholder="MTR-2001"
						/>
					</label>
					<label className="add-meter-dialog__field">
						<span>Customer</span>
						<select
							required
							value={selectedCustomerId}
							onChange={(event) => setSelectedCustomerId(event.target.value)}
							disabled={isLoadingCustomers || customers.length === 0}
						>
							{customers.map((customer) => (
								<option key={customer.id} value={customer.id}>
									{customer.accountNumber} — {customer.fullName}
									{zoneId === undefined ? ` (${customer.zone})` : ""}
								</option>
							))}
						</select>
					</label>
					{isLoadingCustomers && (
						<p className="add-meter-dialog__status" role="status">
							Loading customers…
						</p>
					)}
					{!isLoadingCustomers &&
						!customerLoadError &&
						customers.length === 0 && (
							<p className="add-meter-dialog__status">
								No customers are available.
							</p>
						)}
					{(formError || customerLoadError) && (
						<p className="add-meter-dialog__error" role="alert">
							{formError ?? customerLoadError}
						</p>
					)}
					<div className="add-meter-dialog__actions">
						<button
							className="add-meter-dialog__button add-meter-dialog__button--secondary"
							type="button"
							onClick={onClose}
							disabled={isSaving}
						>
							Cancel
						</button>
						<button
							className="add-meter-dialog__button add-meter-dialog__button--primary"
							type="submit"
							disabled={
								isSaving || isLoadingCustomers || customers.length === 0
							}
						>
							{isSaving ? "Saving…" : "Save Meter"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

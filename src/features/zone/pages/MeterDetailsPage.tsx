import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getErrorMessage } from "../../../services/http";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge, {
	type StatusBadgeTone,
} from "../../../shared/components/StatusBadge";
import { getMeterDetails, type MeterDetails } from "../services/zoneApi";
import type { MeterStatus } from "../types/Meter";
import "./MeterDetailsPage.css";

const statusTones: Record<MeterStatus, StatusBadgeTone> = {
	Active: "active",
	Inactive: "inactive",
	Maintenance: "maintenance",
};

export default function MeterDetailsPage() {
	const { meterId } = useParams();
	const [result, setResult] = useState<{
		key: string;
		data?: MeterDetails;
		error?: string;
	}>({ key: "" });
	const meter = result.key === meterId ? (result.data ?? null) : null;
	const error = result.key === meterId ? (result.error ?? null) : null;
	const isLoading = Boolean(meterId) && result.key !== meterId;

	useEffect(() => {
		if (!meterId) {
			return;
		}

		const controller = new AbortController();
		getMeterDetails(meterId, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setResult({ key: meterId, data });
				}
			})
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) {
					setResult({
						key: meterId,
						error: getErrorMessage(requestError),
					});
				}
			});

		return () => controller.abort();
	}, [meterId]);

	return (
		<section className="meter-details">
			<PageHeader
				title={meter ? `Meter ${meter.id}` : "Meter Details"}
				subtitle="Meter status, reading, and registered customer."
				actions={
					<Link className="meter-details__back-link" to="/zone/meters">
						Back to meters
					</Link>
				}
			/>

			{isLoading ? (
				<p className="meter-details__message" role="status">
					Loading meter details…
				</p>
			) : error ? (
				<p className="meter-details__error" role="alert">
					{error}
				</p>
			) : meter ? (
				<div className="meter-details__grid">
					<section className="meter-details__card" aria-labelledby="meter-info-title">
						<h2 id="meter-info-title">Meter information</h2>
						<dl>
							<div>
								<dt>Meter ID</dt>
								<dd>{meter.id}</dd>
							</div>
							<div>
								<dt>Status</dt>
								<dd>
									<StatusBadge
										label={meter.status}
										tone={statusTones[meter.status]}
									/>
								</dd>
							</div>
							<div>
								<dt>Zone</dt>
								<dd>{meter.zone}</dd>
							</div>
							<div>
								<dt>Current reading</dt>
								<dd>{meter.readingKwh.toLocaleString("en-IN")} kWh</dd>
							</div>
							<div>
								<dt>Last updated</dt>
								<dd>{meter.lastUpdated}</dd>
							</div>
						</dl>
					</section>

					<section
						className="meter-details__card"
						aria-labelledby="meter-customer-title"
					>
						<h2 id="meter-customer-title">Registered customer</h2>
						<dl>
							<div>
								<dt>Customer</dt>
								<dd>{meter.customerName}</dd>
							</div>
							<div>
								<dt>Account number</dt>
								<dd>{meter.accountNumber}</dd>
							</div>
							<div>
								<dt>Customer ID</dt>
								<dd>{meter.customerId}</dd>
							</div>
						</dl>
						<Link className="meter-details__customers-link" to="/zone/users">
							View customer directory
						</Link>
					</section>
				</div>
			) : (
				<p className="meter-details__error" role="alert">
					Meter ID is missing from this address.
				</p>
			)}
		</section>
	);
}

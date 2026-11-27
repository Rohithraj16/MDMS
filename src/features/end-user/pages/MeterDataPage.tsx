import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import PageHeader from "../../../shared/components/PageHeader";
import { getMeterData } from "../services/billingApi";
import type { MeterData, MeterDataPeriod, MeterUsagePoint } from "../types/billing";
import "./MeterDataPage.css";

const periods: { value: MeterDataPeriod; label: string }[] = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
];

function getLine(points: MeterUsagePoint[], max: number) {
	return points.map((point, index) => {
		const x = points.length === 1 ? 400 : 24 + (index / (points.length - 1)) * 752;
		const y = 220 - (point.consumptionKwh / max) * 190;
		return `${x},${y}`;
	}).join(" ");
}

const prettyDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function MeterDataPage() {
	const [period, setPeriod] = useState<MeterDataPeriod>("week");
	const [data, setData] = useState<MeterData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isDemo, setIsDemo] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError("");
		getMeterData(period, controller.signal)
			.then((result) => {
				setData(result.data);
				setIsDemo(result.source === "demo");
			})
			.catch((err: unknown) => {
				if (!controller.signal.aborted) setError(getErrorMessage(err));
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [period, attempt]);

	const max = data ? Math.max(1, ...data.current.map((point) => point.consumptionKwh), ...data.previous.map((point) => point.consumptionKwh)) : 1;
	return (
		<section className="meter-data-page">
			<PageHeader title="Meter data" subtitle={data ? `Detailed consumption for meter ${data.meterNumber}.` : "Compare your recent energy use with the previous period."} />
			<section className="meter-chart-card" aria-label="Consumption comparison">
				<div className="meter-chart-head">
					<div><h2>Consumption comparison</h2><p>Current period compared with the previous period</p></div>
					<div className="meter-periods" role="group" aria-label="Select meter data period">
						{periods.map((item) => <button key={item.value} type="button" aria-pressed={period === item.value} className={period === item.value ? "is-active" : ""} onClick={() => setPeriod(item.value)}>{item.label}</button>)}
					</div>
				</div>
				{loading ? <p className="meter-data-state" role="status">Loading meter data…</p> : error ? (
					<div className="meter-data-error" role="alert"><span>{error}</span><button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button></div>
				) : data ? <>
					<div className="meter-chart-legend"><span><i className="legend-current" /> Current period</span><span><i className="legend-previous" /> Previous period</span></div>
					<div className="meter-chart-wrap">
						<svg className="meter-chart" viewBox="0 0 800 260" role="img" aria-label={`Line chart comparing consumption over ${period}`} preserveAspectRatio="none">
							{[30, 90, 150, 210].map((y) => <line key={y} x1="24" x2="776" y1={y} y2={y} className="meter-chart-grid" />)}
							<polyline points={getLine(data.previous, max)} className="meter-chart-line meter-chart-line--previous" />
							<polyline points={getLine(data.current, max)} className="meter-chart-line meter-chart-line--current" />
							{data.current.map((point, index) => {
								const x = data.current.length === 1 ? 400 : 24 + (index / (data.current.length - 1)) * 752;
								const y = 220 - (point.consumptionKwh / max) * 190;
								return <circle key={point.label} cx={x} cy={y} r="3.5" className="meter-chart-point" />;
							})}
						</svg>
					</div>
					<div className="meter-chart-axis"><span>{data.current[0]?.label}</span><span>{data.current[Math.floor(data.current.length / 2)]?.label}</span><span>{data.current.at(-1)?.label}</span><span>kWh</span></div>
				</> : null}
			</section>
			{isDemo && !loading && <p className="meter-data-demo-note" role="status">Showing demo meter data because the API server is unavailable.</p>}
			<section className="meter-reading-card">
				<div className="meter-reading-head"><h2>Reading history</h2><span>{data?.current.length ?? 0} records</span></div>
				<div className="meter-reading-table-wrap">
					<table className="meter-reading-table">
						<thead><tr><th>Date / time</th><th>Meter reading (kWh)</th><th>Consumption (kWh)</th><th>Notes</th></tr></thead>
						<tbody>{loading ? <tr><td colSpan={4}>Loading readings…</td></tr> : data?.current.map((point) => <tr key={point.label}><td>{period === "day" ? point.label : prettyDate(point.date)}</td><td>{point.readingKwh.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td><td>{point.consumptionKwh.toFixed(2)}</td><td>{point.notes}</td></tr>)}</tbody>
					</table>
				</div>
			</section>
		</section>
	);
}

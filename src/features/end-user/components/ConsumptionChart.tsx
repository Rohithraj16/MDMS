import type { ConsumptionPoint } from "../types/dashboard";

interface ConsumptionChartProps {
	points: ConsumptionPoint[];
}

export default function ConsumptionChart({ points }: ConsumptionChartProps) {
	if (points.length === 0) {
		return <p className="chart-empty">No consumption data for this period.</p>;
	}

	const max = Math.max(...points.map((p) => p.value), 1);

	return (
		<div
			className="chart"
			role="img"
			aria-label="Bar chart of energy consumption in kWh"
		>
			{points.map((point) => (
				<div key={point.label} className="chart__col">
					<span className="chart__value">{point.value}</span>
					<div
						className="chart__bar"
						style={{ height: `${(point.value / max) * 100}%` }}
						title={`${point.label}: ${point.value} kWh`}
					/>
					<span className="chart__label">{point.label}</span>
				</div>
			))}
		</div>
	);
}

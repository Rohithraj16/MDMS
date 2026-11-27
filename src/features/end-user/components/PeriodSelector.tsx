import type { Period } from "../types/dashboard";

const OPTIONS: { value: Period; label: string }[] = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

interface PeriodSelectorProps {
	value: Period;
	onChange: (period: Period) => void;
}

export default function PeriodSelector({
	value,
	onChange,
}: PeriodSelectorProps) {
	return (
		<div
			className="period-selector"
			role="group"
			aria-label="Select time period"
		>
			{OPTIONS.map((option) => (
				<button
					key={option.value}
					type="button"
					className={`period-selector__btn ${value === option.value ? "period-selector__btn--active" : ""}`}
					aria-pressed={value === option.value}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

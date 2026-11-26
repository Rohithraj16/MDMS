
import "./TimeRangeToggle.css";

export type TimeRange = "Day" | "Week" | "Month" | "Year";

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TIME_RANGES: TimeRange[] = [
  "Day",
  "Week",
  "Month",
  "Year",
];

export default function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  return (
    <div
      className="time-range-toggle"
      role="group"
      aria-label="Select chart time range"
    >
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          className={`time-range-toggle__button ${
            value === range ? "active" : ""
          }`}
          aria-pressed={value === range}
          onClick={() => onChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

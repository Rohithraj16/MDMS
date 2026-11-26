
import type { ReactNode } from "react";
import TimeRangeToggle, {
  type TimeRange,
} from "./TimeRangeToggle";
import "./ChartCard.css";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  selectedRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  selectedRange,
  onRangeChange,
}: ChartCardProps) {
  const showTimeRange =
    selectedRange !== undefined && onRangeChange !== undefined;

  return (
    <section className="chart-card" aria-label={title}>
      <div className="chart-card__header">
        <div className="chart-card__heading">
          <h2 className="chart-card__title">{title}</h2>

          {subtitle && (
            <p className="chart-card__subtitle">{subtitle}</p>
          )}
        </div>

        {showTimeRange && (
          <TimeRangeToggle
            value={selectedRange}
            onChange={onRangeChange}
          />
        )}
      </div>

      <div className="chart-card__content">
        {children}
      </div>
    </section>
  );
}

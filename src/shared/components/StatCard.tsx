
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  accent?: "blue" | "green" | "red" | "orange";
  to?: string;
}

export default function StatCard({
  label,
  value,
  description,
  icon,
  accent = "blue",
  to,
}: StatCardProps) {
  const content = (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>

      <div className="stat-card__value">{value}</div>

      {description && (
        <p className="stat-card__description">{description}</p>
      )}
    </div>
  );

  return to ? (
    <Link to={to} className="stat-card__link">
      {content}
    </Link>
  ) : (
    content
  );
}

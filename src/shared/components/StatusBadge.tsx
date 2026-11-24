import "./StatusBadge.css";

export type StatusBadgeTone =
  | "active"
  | "inactive"
  | "maintenance"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
}

export default function StatusBadge({
  label,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      {label}
    </span>
  );
}

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../../services/http";
import { getDashboard } from "../services/dashboardService";
import type { DashboardData, Period } from "../types/dashboard";

export function useDashboard(period: Period) {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError("");
		getDashboard(period)
			.then((result) => {
				if (!cancelled) setData(result);
			})
			.catch((err) => {
				if (!cancelled) setError(getErrorMessage(err));
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [period, attempt]);

	const retry = useCallback(() => setAttempt((n) => n + 1), []);

	return { data, loading, error, retry };
}

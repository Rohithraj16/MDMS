export type Role = "user" | "zone" | "enterprise";

export interface MenuItem {
	label: string;
	path: string;
}

export const ROLE_LABELS: Record<Role, string> = {
	user: "End user",
	zone: "Zone manager",
	enterprise: "Enterprise admin",
};

export const MENUS: Record<Role, MenuItem[]> = {
	user: [
		{ label: "Dashboard", path: "/user/dashboard" },
		{ label: "Bills and payments", path: "/user/bills" },
		{ label: "Meter data", path: "/user/meter-data" },
		{ label: "Alerts", path: "/user/alerts" },
		{ label: "Profile and settings", path: "/profile" },
	],
	zone: [
		{ label: "Dashboard", path: "/zone/dashboard" },
		{ label: "Meters", path: "/zone/meters" },
		{ label: "Users", path: "/zone/users" },
		{ label: "Reports", path: "/zone/reports" },
		{ label: "Alerts", path: "/zone/alerts" },
		{ label: "Settings", path: "/zone/settings" },
		{ label: "Profile and settings", path: "/profile" },
	],
	enterprise: [
		{ label: "Dashboard", path: "/enterprise/dashboard" },
		{ label: "Zones", path: "/enterprise/zones" },
		{ label: "Meters", path: "/enterprise/meters" },
		{ label: "Users and roles", path: "/enterprise/users" },
		{ label: "Reports", path: "/enterprise/reports" },
		{ label: "Alerts", path: "/enterprise/alerts" },
		{ label: "Audit logs", path: "/enterprise/audit-logs" },
		{ label: "Settings", path: "/enterprise/settings" },
		{ label: "Profile and settings", path: "/profile" },
	],
};

const ROLE_KEY = "mdms_current_role";

export function roleFromPath(pathname: string): Role | null {
	const first = pathname.split("/")[1];
	if (first === "user" || first === "zone" || first === "enterprise")
		return first;
	return null;
}

// /profile is shared, so remember the last role the person was in
export function saveRole(role: Role) {
	try {
		sessionStorage.setItem(ROLE_KEY, role);
	} catch {
		// storage unavailable, ignore
	}
}

export function getSavedRole(): Role {
	try {
		const value = sessionStorage.getItem(ROLE_KEY);
		if (value === "user" || value === "zone" || value === "enterprise")
			return value;
	} catch {
		// ignore
	}
	return "user";
}

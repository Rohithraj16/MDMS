import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getSavedRole, roleFromPath, saveRole } from "./menuConfig";
import "./AppLayout.css";

export default function AppLayout() {
	const { pathname } = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	const pathRole = roleFromPath(pathname);
	const role = pathRole ?? getSavedRole();

	useEffect(() => {
		if (pathRole) saveRole(pathRole);
	}, [pathRole]);

	// Close the mobile menu with the Escape key
	useEffect(() => {
		if (!menuOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMenuOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [menuOpen]);

	return (
		<div className="app-layout">
			<Sidebar
				role={role}
				open={menuOpen}
				onNavigate={() => setMenuOpen(false)}
			/>
			{menuOpen && (
				<div
					className="app-layout__overlay"
					onClick={() => setMenuOpen(false)}
				/>
			)}
			<div className="app-layout__main">
				<Header
					role={role}
					menuOpen={menuOpen}
					onToggleMenu={() => setMenuOpen((v) => !v)}
				/>
				<main className="app-layout__content">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

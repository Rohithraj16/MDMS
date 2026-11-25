import { Outlet } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";

export default function AppLayout() {
	return (
		<div>
			<header className="app-header">
				<span>MDMS</span>
				<ThemeToggle />
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}

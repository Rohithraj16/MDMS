import { Outlet } from "react-router-dom";

export default function AppLayout() {
	return (
		<div>
			<header>MDMS</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}

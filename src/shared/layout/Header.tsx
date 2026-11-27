import { Link, useNavigate } from "react-router-dom";
import { ROLE_LABELS } from "./menuConfig";
import type { Role } from "./menuConfig";
import ThemeToggle from "../theme/ThemeToggle";

interface HeaderProps {
	role: Role;
	menuOpen: boolean;
	onToggleMenu: () => void;
}

export default function Header({ role, menuOpen, onToggleMenu }: HeaderProps) {
	const navigate = useNavigate();

	return (
		<header className="app-header">
			<button
				type="button"
				className="app-header__menu"
				onClick={onToggleMenu}
				aria-label={menuOpen ? "Close menu" : "Open menu"}
				aria-expanded={menuOpen}
			>
				☰
			</button>
			<span className="app-header__title">Meter Data Management System</span>
			<div className="app-header__right">
				<span className="app-header__badge">{ROLE_LABELS[role]}</span>
				<ThemeToggle />
				<Link to="/profile">Profile</Link>
				{/* Temporary: real logout comes with authentication */}
				<button
					type="button"
					className="app-header__logout"
					onClick={() => navigate("/login")}
				>
					Log out
				</button>
			</div>
		</header>
	);
}

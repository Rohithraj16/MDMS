import { NavLink } from "react-router-dom";
import { MENUS, ROLE_LABELS } from "./menuConfig";
import type { Role } from "./menuConfig";

interface SidebarProps {
	role: Role;
	open: boolean;
	onNavigate: () => void;
}

export default function Sidebar({ role, open, onNavigate }: SidebarProps) {
	return (
		<aside
			className={`sidebar ${open ? "sidebar--open" : ""}`}
			aria-label="Main navigation"
		>
			<div className="sidebar__brand">
				MDMS
				<span className="sidebar__role">{ROLE_LABELS[role]}</span>
			</div>
			<nav>
				<ul className="sidebar__list">
					{MENUS[role].map((item) => (
						<li key={item.path}>
							<NavLink
								to={item.path}
								onClick={onNavigate}
								className={({ isActive }) =>
									`sidebar__link ${isActive ? "sidebar__link--active" : ""}`
								}
							>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}

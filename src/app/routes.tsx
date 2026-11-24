import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout";
import ServerErrorPage from "../shared/pages/ServerErrorPage";

// Turns a default-exported page into a lazy-loaded route
const page =
	(loader: () => Promise<{ default: ComponentType }>) => async () => {
		const module = await loader();
		return { Component: module.default };
	};

export const router = createBrowserRouter([
	{
		errorElement: <ServerErrorPage />,
		children: [
			{ path: "/", element: <Navigate to="/login" replace /> },

			// Auth
			{
				path: "/login",
				lazy: page(() => import("../features/auth/pages/LoginPage")),
			},
			{
				path: "/forgot-password",
				lazy: page(() => import("../features/auth/pages/ForgotPasswordPage")),
			},
			{
				path: "/reset-password/:token",
				lazy: page(() => import("../features/auth/pages/ResetPasswordPage")),
			},

			// Utility
			{
				path: "/maintenance",
				lazy: page(() => import("../shared/pages/MaintenancePage")),
			},
			{
				path: "/access-denied",
				lazy: page(() => import("../shared/pages/AccessDeniedPage")),
			},

			// All three roles share one layout
			{
				element: <AppLayout />,
				children: [
					{
						path: "/profile",
						lazy: page(() => import("../shared/pages/ProfilePage")),
					},

					{
						path: "/user",
						children: [
							{ index: true, element: <Navigate to="dashboard" replace /> },
							{
								path: "dashboard",
								lazy: page(
									() => import("../features/end-user/pages/DashboardPage"),
								),
							},
							{
								path: "bills",
								lazy: page(
									() => import("../features/end-user/pages/BillsPage"),
								),
							},
							{
								path: "bills/:billId",
								lazy: page(
									() => import("../features/end-user/pages/BillDetailsPage"),
								),
							},
							{
								path: "meter-data",
								lazy: page(
									() => import("../features/end-user/pages/MeterDataPage"),
								),
							},
							{
								path: "alerts",
								lazy: page(
									() => import("../features/end-user/pages/AlertsPage"),
								),
							},
						],
					},

					{
						path: "/zone",
						children: [
							{ index: true, element: <Navigate to="dashboard" replace /> },
							{
								path: "dashboard",
								lazy: page(
									() => import("../features/zone/pages/DashboardPage"),
								),
							},
							{
								path: "meters",
								lazy: page(() => import("../features/zone/pages/MetersPage")),
							},
							{
								path: "meters/:meterId",
								lazy: page(
									() => import("../features/zone/pages/MeterDetailsPage"),
								),
							},
							{
								path: "users",
								lazy: page(() => import("../features/zone/pages/UsersPage")),
							},
							{
								path: "reports",
								lazy: page(() => import("../features/zone/pages/ReportsPage")),
							},
							{
								path: "alerts",
								lazy: page(() => import("../features/zone/pages/AlertsPage")),
							},
							{
								path: "settings",
								lazy: page(() => import("../features/zone/pages/SettingsPage")),
							},
						],
					},

					{
						path: "/enterprise",
						children: [
							{ index: true, element: <Navigate to="dashboard" replace /> },
							{
								path: "dashboard",
								lazy: page(
									() => import("../features/enterprise/pages/DashboardPage"),
								),
							},
							{
								path: "zones",
								lazy: page(
									() => import("../features/enterprise/pages/ZonesPage"),
								),
							},
							{
								path: "zones/:zoneId",
								lazy: page(
									() => import("../features/enterprise/pages/ZoneDetailsPage"),
								),
							},
							{
								path: "meters",
								lazy: page(
									() => import("../features/enterprise/pages/MetersPage"),
								),
							},
							{
								path: "users",
								lazy: page(
									() => import("../features/enterprise/pages/UsersPage"),
								),
							},
							{
								path: "reports",
								lazy: page(
									() => import("../features/enterprise/pages/ReportsPage"),
								),
							},
							{
								path: "alerts",
								lazy: page(
									() => import("../features/enterprise/pages/AlertsPage"),
								),
							},
							{
								path: "audit-logs",
								lazy: page(
									() => import("../features/enterprise/pages/AuditLogsPage"),
								),
							},
							{
								path: "settings",
								lazy: page(
									() => import("../features/enterprise/pages/SettingsPage"),
								),
							},
						],
					},
				],
			},

			// Catch-all 404
			{ path: "*", lazy: page(() => import("../shared/pages/NotFoundPage")) },
		],
	},
]);

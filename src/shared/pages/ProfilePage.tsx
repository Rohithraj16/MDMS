import { useState } from "react";
import type { FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import "./ProfilePage.css";

export default function ProfilePage() {
	// Temporary demo values; real user data comes later
	const [name, setName] = useState("Rohith");
	const [email, setEmail] = useState("rohith@example.com");
	const [emailAlerts, setEmailAlerts] = useState(true);
	const [billReminders, setBillReminders] = useState(true);
	const [errors, setErrors] = useState({ name: "", email: "" });
	const [saved, setSaved] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const next = {
			name: name.trim() ? "" : "Name is required",
			email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
				? ""
				: "Enter a valid email address",
		};
		setErrors(next);
		if (next.name || next.email) {
			setSaved(false);
			return;
		}
		setSaved(true); // Temporary: nothing is stored yet
	};

	return (
		<div>
			<PageHeader
				title="Profile and settings"
				subtitle="Manage your details and preferences"
			/>

			<form className="profile-card" onSubmit={handleSubmit} noValidate>
				<h2>Profile</h2>

				<div className="profile-field">
					<label htmlFor="profile-name">Name</label>
					<input
						id="profile-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						aria-invalid={!!errors.name}
					/>
					{errors.name && (
						<p className="profile-error" role="alert">
							{errors.name}
						</p>
					)}
				</div>

				<div className="profile-field">
					<label htmlFor="profile-email">Email</label>
					<input
						id="profile-email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						aria-invalid={!!errors.email}
					/>
					{errors.email && (
						<p className="profile-error" role="alert">
							{errors.email}
						</p>
					)}
				</div>

				<h2>Notifications</h2>
				<label className="profile-check">
					<input
						type="checkbox"
						checked={emailAlerts}
						onChange={(e) => setEmailAlerts(e.target.checked)}
					/>
					Email me about alerts
				</label>
				<label className="profile-check">
					<input
						type="checkbox"
						checked={billReminders}
						onChange={(e) => setBillReminders(e.target.checked)}
					/>
					Send bill reminders
				</label>

				{saved && <p className="profile-success">Settings saved.</p>}
				<button type="submit" className="profile-save">
					Save changes
				</button>
			</form>
		</div>
	);
}

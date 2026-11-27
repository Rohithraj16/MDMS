import { useState } from "react";
import type { FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import { validateConfirm, validateEmail, validatePassword } from "../../features/auth/utils/validators";
import "./ProfilePage.css";

type ProfileTab = "profile" | "security" | "notifications";

const tabs: { id: ProfileTab; label: string }[] = [
	{ id: "profile", label: "Profile" },
	{ id: "security", label: "Security" },
	{ id: "notifications", label: "Notifications" },
];

export default function ProfilePage() {
	const [tab, setTab] = useState<ProfileTab>("profile");
	const [name, setName] = useState("Rohith");
	const [email, setEmail] = useState("rohith@example.com");
	const [phone, setPhone] = useState("+91 98765 43210");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailAlerts, setEmailAlerts] = useState(true);
	const [billReminders, setBillReminders] = useState(true);
	const [smsAlerts, setSmsAlerts] = useState(false);
	const [errors, setErrors] = useState({ name: "", email: "", phone: "", currentPassword: "", newPassword: "", confirmPassword: "" });
	const [feedback, setFeedback] = useState("");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFeedback("");

		if (tab === "profile") {
			const next = {
				name: name.trim() ? "" : "Name is required.",
				email: validateEmail(email),
				phone: /^\+?[0-9\s()-]{7,20}$/.test(phone.trim()) ? "" : "Enter a valid phone number.",
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			};
			setErrors(next);
			if (next.name || next.email || next.phone) return;
			setFeedback("Profile details are valid. Changes are not saved in Phase 1.");
			return;
		}

		if (tab === "security") {
			const next = {
				name: "",
				email: "",
				phone: "",
				currentPassword: currentPassword ? "" : "Enter your current password.",
				newPassword: validatePassword(newPassword),
				confirmPassword: validateConfirm(newPassword, confirmPassword),
			};
			setErrors(next);
			if (next.currentPassword || next.newPassword || next.confirmPassword) return;
			setFeedback("Password details are valid. Changes are not saved in Phase 1.");
			return;
		}

		setErrors({ name: "", email: "", phone: "", currentPassword: "", newPassword: "", confirmPassword: "" });
		setFeedback("Notification preferences are ready. Changes are not saved in Phase 1.");
	};

	return (
		<section className="profile-page">
			<PageHeader title="Profile and settings" subtitle="Manage your personal details, security and notification preferences." />
			<div className="profile-tabs" role="tablist" aria-label="Profile settings sections">
				{tabs.map((item) => (
					<button
						key={item.id}
						type="button"
						role="tab"
						id={`profile-tab-${item.id}`}
						aria-selected={tab === item.id}
						aria-controls="profile-tab-panel"
						tabIndex={tab === item.id ? 0 : -1}
						className={tab === item.id ? "profile-tabs__tab is-active" : "profile-tabs__tab"}
						onClick={() => { setTab(item.id); setFeedback(""); }}
					>
						{item.label}
					</button>
				))}
			</div>

			<form className="profile-card" onSubmit={handleSubmit} noValidate>
				<div id="profile-tab-panel" role="tabpanel" aria-labelledby={`profile-tab-${tab}`}>
					{tab === "profile" && <>
						<h2>Personal details</h2>
						<p className="profile-description">Keep your contact details up to date.</p>
						<div className="profile-field">
							<label htmlFor="profile-name">Full name</label>
							<input id="profile-name" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setFeedback(""); }} aria-invalid={!!errors.name} aria-describedby={errors.name ? "profile-name-error" : undefined} />
							{errors.name && <p id="profile-name-error" className="profile-error" role="alert">{errors.name}</p>}
						</div>
						<div className="profile-field">
							<label htmlFor="profile-email">Email address</label>
							<input id="profile-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setFeedback(""); }} aria-invalid={!!errors.email} aria-describedby={errors.email ? "profile-email-error" : undefined} />
							{errors.email && <p id="profile-email-error" className="profile-error" role="alert">{errors.email}</p>}
						</div>
						<div className="profile-field">
							<label htmlFor="profile-phone">Phone number</label>
							<input id="profile-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => { setPhone(event.target.value); setFeedback(""); }} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "profile-phone-error" : undefined} />
							{errors.phone && <p id="profile-phone-error" className="profile-error" role="alert">{errors.phone}</p>}
						</div>
					</>}

					{tab === "security" && <>
						<h2>Change password</h2>
						<p className="profile-description">Use at least 8 characters for your new password.</p>
						{([
							["current-password", "Current password", currentPassword, setCurrentPassword, errors.currentPassword],
							["new-password", "New password", newPassword, setNewPassword, errors.newPassword],
							["confirm-password", "Confirm new password", confirmPassword, setConfirmPassword, errors.confirmPassword],
						] as const).map(([id, label, value, setter, error]) => (
							<div className="profile-field" key={id}>
								<label htmlFor={id}>{label}</label>
								<input id={id} type="password" autoComplete={id === "current-password" ? "current-password" : "new-password"} value={value} onChange={(event) => { setter(event.target.value); setFeedback(""); }} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
								{error && <p id={`${id}-error`} className="profile-error" role="alert">{error}</p>}
							</div>
						))}
					</>}

					{tab === "notifications" && <>
						<h2>Notification preferences</h2>
						<p className="profile-description">Choose how you want to hear about account activity.</p>
						<label className="profile-toggle"><span><strong>Email alerts</strong><small>Important meter and account updates</small></span><input type="checkbox" checked={emailAlerts} onChange={(event) => { setEmailAlerts(event.target.checked); setFeedback(""); }} /><span className="profile-toggle__track" aria-hidden="true" /></label>
						<label className="profile-toggle"><span><strong>Bill reminders</strong><small>Due dates and payment confirmations</small></span><input type="checkbox" checked={billReminders} onChange={(event) => { setBillReminders(event.target.checked); setFeedback(""); }} /><span className="profile-toggle__track" aria-hidden="true" /></label>
						<label className="profile-toggle"><span><strong>SMS notifications</strong><small>Time-sensitive alerts by text message</small></span><input type="checkbox" checked={smsAlerts} onChange={(event) => { setSmsAlerts(event.target.checked); setFeedback(""); }} /><span className="profile-toggle__track" aria-hidden="true" /></label>
					</>}
				</div>

				{feedback && <p className="profile-success" role="status">{feedback}</p>}
				<button type="submit" className="profile-save">{tab === "notifications" ? "Save preferences" : "Save changes"}</button>
			</form>
		</section>
	);
}

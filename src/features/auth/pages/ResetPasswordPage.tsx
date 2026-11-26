import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import { validateConfirm, validatePassword } from "../utils/validators";
import "./AuthPages.css";

export default function ResetPasswordPage() {
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [errors, setErrors] = useState({ password: "", confirm: "" });
	const [done, setDone] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const next = {
			password: validatePassword(password),
			confirm: validateConfirm(password, confirm),
		};
		setErrors(next);
		if (next.password || next.confirm) return;
		setDone(true); // Temporary: the token is not checked in Phase 1
	};

	if (done) {
		return (
			<div className="auth-page">
				<div className="auth-card">
					<h1>Password updated</h1>
					<div className="auth-success">
						Your password has been reset. You can sign in now.
					</div>
					<p className="auth-links">
						<Link to="/login">Go to sign in</Link>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-page">
			<form className="auth-card" onSubmit={handleSubmit} noValidate>
				<h1>Reset password</h1>
				<p className="auth-card__subtitle">Choose a new password.</p>

				<PasswordField
					id="new-password"
					label="New password"
					value={password}
					onChange={setPassword}
					error={errors.password}
					autoComplete="new-password"
				/>
				<PasswordField
					id="confirm-password"
					label="Confirm password"
					value={confirm}
					onChange={setConfirm}
					error={errors.confirm}
					autoComplete="new-password"
				/>

				<button type="submit" className="auth-submit">
					Reset password
				</button>

				<p className="auth-links">
					<Link to="/login">Back to sign in</Link>
				</p>
			</form>
		</div>
	);
}

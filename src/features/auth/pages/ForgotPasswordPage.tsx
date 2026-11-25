import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { validateEmail } from "../utils/validators";
import "./AuthPages.css";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [sent, setSent] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const message = validateEmail(email);
		setError(message);
		if (message) return;
		setSent(true); // Temporary: no email is actually sent in Phase 1
	};

	return (
		<div className="auth-page">
			<form className="auth-card" onSubmit={handleSubmit} noValidate>
				<h1>Forgot password</h1>
				<p className="auth-card__subtitle">
					Enter your email and we will send you a reset link.
				</p>

				{sent && (
					<div className="auth-success">
						If an account exists for {email}, a reset link has been sent.
						<br />
						Demo:{" "}
						<Link to="/reset-password/demo-token">open the reset page</Link>
					</div>
				)}

				<div className="auth-field">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						aria-invalid={!!error}
					/>
					{error && (
						<p className="auth-error" role="alert">
							{error}
						</p>
					)}
				</div>

				<button type="submit" className="auth-submit">
					Send reset link
				</button>

				<p className="auth-links">
					<Link to="/login">Back to sign in</Link>
				</p>
			</form>
		</div>
	);
}

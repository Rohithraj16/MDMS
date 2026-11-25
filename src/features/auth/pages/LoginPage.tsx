import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import { validateEmail, validatePassword } from "../utils/validators";
import "./AuthPages.css";

const REMEMBER_KEY = "mdms_remembered_email";

function getRememberedEmail(): string {
	try {
		return localStorage.getItem(REMEMBER_KEY) ?? "";
	} catch {
		return "";
	}
}

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState(getRememberedEmail);
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(() => getRememberedEmail() !== "");
	const [errors, setErrors] = useState({ email: "", password: "" });

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const next = {
			email: validateEmail(email),
			password: validatePassword(password),
		};
		setErrors(next);
		if (next.email || next.password) return;

		// Only the email is remembered, never the password
		try {
			if (remember) localStorage.setItem(REMEMBER_KEY, email);
			else localStorage.removeItem(REMEMBER_KEY);
		} catch {
			// storage unavailable, ignore
		}

		// Temporary: real authentication comes later
		navigate("/user/dashboard");
	};

	return (
		<div className="auth-page">
			<form className="auth-card" onSubmit={handleSubmit} noValidate>
				<h1>Sign in</h1>
				<p className="auth-card__subtitle">Meter Data Management System</p>

				<div className="auth-field">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						aria-invalid={!!errors.email}
					/>
					{errors.email && (
						<p className="auth-error" role="alert">
							{errors.email}
						</p>
					)}
				</div>

				<PasswordField
					id="password"
					label="Password"
					value={password}
					onChange={setPassword}
					error={errors.password}
					autoComplete="current-password"
				/>

				<div className="auth-row">
					<label>
						<input
							type="checkbox"
							checked={remember}
							onChange={(e) => setRemember(e.target.checked)}
						/>
						Remember me
					</label>
					<Link to="/forgot-password">Forgot password?</Link>
				</div>

				<button type="submit" className="auth-submit">
					Sign in
				</button>

				<div className="auth-temp">
					<p>Temporary: jump to a role</p>
					<Link to="/user/dashboard">End user</Link>
					<Link to="/zone/dashboard">Zone</Link>
					<Link to="/enterprise/dashboard">Enterprise</Link>
				</div>
			</form>
		</div>
	);
}

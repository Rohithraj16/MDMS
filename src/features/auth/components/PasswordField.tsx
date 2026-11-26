import { useState } from "react";

interface PasswordFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	autoComplete?: string;
}

export default function PasswordField({
	id,
	label,
	value,
	onChange,
	error,
	autoComplete,
}: PasswordFieldProps) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="auth-field">
			<label htmlFor={id}>{label}</label>
			<div className="auth-password">
				<input
					id={id}
					type={visible ? "text" : "password"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					autoComplete={autoComplete}
					aria-invalid={!!error}
				/>
				<button
					type="button"
					className="auth-password__toggle"
					onClick={() => setVisible((v) => !v)}
					aria-label={visible ? "Hide password" : "Show password"}
				>
					{visible ? "Hide" : "Show"}
				</button>
			</div>
			{error && (
				<p className="auth-error" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}

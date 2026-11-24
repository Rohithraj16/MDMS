import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import "./FormFields.css";

interface PasswordProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type"
> {
	label: string;
	error?: string;
}

export default function Password({
	label,
	error,
	id,
	...props
}: PasswordProps) {
	const [showPassword, setShowPassword] = useState(false);

	const inputId = id ?? props.name;

	return (
		<div className="form-field">
			<label htmlFor={inputId} className="form-field__label">
				{label}
			</label>

			<div className="password-field">
				<input
					id={inputId}
					type={showPassword ? "text" : "password"}
					className={`form-field__input ${
						error ? "form-field__input--error" : ""
					}`}
					{...props}
				/>

				<button
					type="button"
					className="password-field__button"
					onClick={() => setShowPassword((previous) => !previous)}
				>
					{showPassword ? "Hide" : "Show"}
				</button>
			</div>

			{error && <p className="form-field__error">{error}</p>}
		</div>
	);
}

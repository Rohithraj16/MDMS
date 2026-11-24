import type { InputHTMLAttributes } from "react";
import "./FormFields.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
	const inputId = id ?? props.name;

	return (
		<div className="form-field">
			<label htmlFor={inputId} className="form-field__label">
				{label}
			</label>

			<input
				id={inputId}
				className={`form-field__input ${error ? "form-field__input--error" : ""}`}
				{...props}
			/>

			{error && <p className="form-field__error">{error}</p>}
		</div>
	);
}

import type { SelectHTMLAttributes } from "react";
import "./FormFields.css";

export interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	options: SelectOption[];
	error?: string;
}

export default function Select({
	label,
	options,
	error,
	id,
	...props
}: SelectProps) {
	const selectId = id ?? props.name;

	return (
		<div className="form-field">
			<label htmlFor={selectId} className="form-field__label">
				{label}
			</label>

			<select
				id={selectId}
				className={`form-field__select ${error ? "form-field__input--error" : ""}`}
				{...props}
			>
				<option value="">Select {label}</option>

				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{error && <p className="form-field__error">{error}</p>}
		</div>
	);
}

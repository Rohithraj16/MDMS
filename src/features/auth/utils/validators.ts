export function validateEmail(value: string): string {
	if (!value.trim()) return "Email is required";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
		return "Enter a valid email address";
	return "";
}

export function validatePassword(value: string): string {
	if (!value) return "Password is required";
	if (value.length < 8) return "Password must be at least 8 characters";
	return "";
}

export function validateConfirm(password: string, confirm: string): string {
	if (!confirm) return "Please confirm your password";
	if (password !== confirm) return "Passwords do not match";
	return "";
}

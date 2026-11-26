import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5247";

const http = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Turns any error into a readable message that pages can show in a toast or error state
export function getErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		if (error.code === "ECONNABORTED")
			return "The request timed out. Please try again.";
		if (!error.response)
			return "Cannot reach the API server. Is the ASP.NET Core API running?";
		if (error.response.status === 404)
			return "The requested data was not found.";
		if (error.response.status >= 500)
			return "Server error. Please try again later.";
	}
	return "Something went wrong. Please try again.";
}

http.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (!axios.isCancel(error)) {
			console.error("API error:", error.message);
		}
		return Promise.reject(error);
	},
);

export default http;

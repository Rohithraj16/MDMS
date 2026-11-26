import { Link } from "react-router-dom";

function ErrorLayout({
  code,
  title,
  message,
}: {
  code: string;
  title: string;
  message: string;
}) {
  return (
    <div className="error-page">
      <h1>{code}</h1>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorLayout
      code="404"
      title="Page Not Found"
      message="The page you are looking for does not exist."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorLayout
      code="500"
      title="Internal Server Error"
      message="Something went wrong on our side. Please try again later."
    />
  );
}

export function MaintenancePage() {
  return (
    <ErrorLayout
      code="503"
      title="Under Maintenance"
      message="We are improving the system. Please try again later."
    />
  );
}

export function AccessDeniedPage() {
  return (
    <ErrorLayout
      code="403"
      title="Access Denied"
      message="You do not have permission to access this page."
    />
  );
}
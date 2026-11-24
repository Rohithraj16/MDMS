interface PlaceholderPageProps {
	title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
	return (
		<div>
			<h2>{title}</h2>
			<p>This page is under construction.</p>
		</div>
	);
}

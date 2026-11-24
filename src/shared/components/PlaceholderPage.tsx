import PageHeader from "./PageHeader";

interface PlaceholderPageProps {
	title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
	return (
		<PageHeader
			title={title}
			subtitle="This page is under construction."
			actions={<button>Add</button>}
		/>
	);
}

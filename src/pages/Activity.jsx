import ActivityManager from "../components/FormAct.jsx";

export default function ActivityPage() {
	return (
		<div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
			<h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
				Mes Activités
			</h1>
			<ActivityManager />
		</div>
	);
}

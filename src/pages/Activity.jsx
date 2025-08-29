import ActivityManager from "../components/FormAct.jsx";
import "../styles/Activity.scss";
export default function ActivityPage() {
	return (
		<div className="activity-page">
			<h1>Mes Activités</h1>
			<ActivityManager />
		</div>
	);
}

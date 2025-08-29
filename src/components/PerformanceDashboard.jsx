import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PerformanceDashboard.scss";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const metrics = [
	{ label: "Durée (min)", key: "duration", color: "#007bff" },
	{ label: "Distance (km)", key: "distance", color: "#28a745" },
	{ label: "Calories", key: "calories", color: "#dc3545" },
];

export default function PerformanceDashboard({ goals }) {
	const [activities, setActivities] = useState([]);
	const [metric, setMetric] = useState("duration");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [period, setPeriod] = useState("all"); // "all", "week", "month", "days3"

	const token = localStorage.getItem("token");

	// Charger les activités
	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const res = await axios.get(
					"http://localhost:5000/api/activities",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const sorted = res.data.sort(
					(a, b) => new Date(a.date) - new Date(b.date)
				);
				setActivities(sorted);
			} catch (err) {
				console.error(err);
			}
		};
		fetchActivities();
	}, [token]);

	// Filtrer par catégorie
	const filteredByCategory = categoryFilter
		? activities.filter((act) => act.category === categoryFilter)
		: activities;

	// Filtrer par période
	const now = new Date();
	const filteredByPeriod = filteredByCategory.filter((act) => {
		if (!act.date) return false;
		const actDate = new Date(act.date);
		if (period === "days3")
			return actDate >= new Date(now - 3 * 24 * 60 * 60 * 1000);
		if (period === "week")
			return actDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
		if (period === "month")
			return actDate >= new Date(now - 30 * 24 * 60 * 60 * 1000);
		return true; // "all"
	});

	// Préparer les données pour le graphique
	const chartData = filteredByPeriod.map((act) => ({
		date: act.date ? act.date.split("T")[0] : "",
		duration: act.duration || 0,
		distance: act.distance || 0,
		calories: act.calories || 0,
	}));

	// Moyenne période précédente
	const prevWeekActivities = activities.filter((act) => {
		const actDate = new Date(act.date);
		return (
			actDate >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
			actDate < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
		);
	});
	const prevAvg =
		prevWeekActivities.reduce((sum, a) => sum + (a[metric] || 0), 0) /
		(prevWeekActivities.length || 1);

	const currentTotal = filteredByPeriod.reduce(
		(sum, a) => sum + (a[metric] || 0),
		0
	);

	// Catégories uniques
	const categories = [...new Set(activities.map((act) => act.category))];

	return (
		<div className="performance-dashboard">
			<div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
				<h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
					Performance Dashboard
				</h2>

				{/* Filtres */}
				<div
					className="filters"
					style={{
						display: "flex",
						gap: "1rem",
						flexWrap: "wrap",
						marginBottom: "1rem",
					}}
				>
					<select
						value={metric}
						onChange={(e) => setMetric(e.target.value)}
					>
						{metrics.map((m) => (
							<option key={m.key} value={m.key}>
								{m.label}
							</option>
						))}
					</select>

					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
					>
						<option value="">Toutes catégories</option>
						{categories.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				{/* Boutons période */}
				<div
					className="period-buttons"
					style={{
						display: "flex",
						gap: "0.5rem",
						marginBottom: "1rem",
					}}
				>
					<button onClick={() => setPeriod("days3")}>
						3 derniers jours
					</button>
					<button onClick={() => setPeriod("week")}>
						Dernière semaine
					</button>
					<button onClick={() => setPeriod("month")}>
						Dernier mois
					</button>
					<button onClick={() => setPeriod("all")}>Tout</button>
				</div>

				{/* Statistiques rapides */}
				<div className="stats">
					<p>
						Total {metric}: {currentTotal.toFixed(1)}
					</p>
					<p>Moyenne semaine précédente: {prevAvg.toFixed(1)}</p>
					{goals && goals[metric] && (
						<p>
							Objectif {metric}: {goals[metric]}
						</p>
					)}
				</div>
			</div>
			{/* Graphique */}
			<ResponsiveContainer width="100%" height={350}>
				<LineChart
					data={chartData}
					margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey={metric}
						stroke={metrics.find((m) => m.key === metric)?.color}
						strokeWidth={2}
						dot={{ r: 4 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

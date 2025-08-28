import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FormAct.scss";

const activityCategories = [
	{
		category: "Course & Endurance",
		subcategories: [
			"Course à pied",
			"Trail",
			"Marche sportive",
			"Triathlon",
		],
	},
	{
		category: "Sports de Raquette",
		subcategories: ["Tennis", "Badminton", "Ping-pong", "Squash"],
	},
	{
		category: "Sports Collectifs",
		subcategories: ["Football", "Basketball", "Handball", "Rugby"],
	},
	{
		category: "Cyclisme & Mobilité",
		subcategories: ["Vélo route", "VTT / Trail vélo", "BMX"],
	},
];

export default function ActivityManager() {
	const initialForm = {
		date: "",
		category: "",
		subCategory: "",
		duration: "",
		distance: "",
		intensity: "",
		calories: "",
		comment: "",
	};

	const [formData, setFormData] = useState(initialForm);
	const [subOptions, setSubOptions] = useState([]);
	const [activities, setActivities] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [showList, setShowList] = useState(false); // ✅ déplacer ici

	const token = localStorage.getItem("token");

	// Charger la liste des activités
	const fetchActivities = async () => {
		try {
			const res = await axios.get(
				"http://localhost:5000/api/activities",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setActivities(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (!token) {
			console.warn("⚠️ Aucun token trouvé, veuillez vous connecter.");
			return;
		}
		fetchActivities();
	}, [token]);

	// Changement catégorie → sous-catégories dynamiques
	const handleCategoryChange = (e) => {
		const category = e.target.value;
		setFormData({ ...formData, category, subCategory: "" });
		const categoryObj = activityCategories.find(
			(c) => c.category === category
		);
		setSubOptions(categoryObj ? categoryObj.subcategories : []);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingId) {
				await axios.put(
					`http://localhost:5000/api/activities/${editingId}`,
					formData,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setEditingId(null);
			} else {
				await axios.post(
					"http://localhost:5000/api/activities",
					formData,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			}

			alert("Activité enregistrée !");
			setFormData(initialForm);
			setSubOptions([]);
			fetchActivities(); // rafraîchir la liste
		} catch (err) {
			console.error(err);
			alert("Erreur lors de l'enregistrement");
		}
	};

	const handleEdit = (activity) => {
		setFormData({
			date: activity.date ? activity.date.split("T")[0] : "",
			category: activity.category || "",
			subCategory: activity.subCategory || "",
			duration: activity.duration || "",
			distance: activity.distance || "",
			intensity: activity.intensity || "",
			calories: activity.calories || "",
			comment: activity.comment || "",
		});
		const catObj = activityCategories.find(
			(c) => c.category === activity.category
		);
		setSubOptions(catObj ? catObj.subcategories : []);
		setEditingId(activity._id);
	};

	return (
		<div className="activity-manager">
			<form onSubmit={handleSubmit} className="formulaire">
				<div className="formulaire__group">
					<label>Date</label>
					<input
						type="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
					/>
				</div>

				<div className="formulaire__group">
					<label>Catégorie</label>
					<select
						name="category"
						value={formData.category}
						onChange={handleCategoryChange}
					>
						<option value="">Sélectionnez une catégorie</option>
						{activityCategories.map((c) => (
							<option key={c.category} value={c.category}>
								{c.category}
							</option>
						))}
					</select>
				</div>

				<div className="formulaire__group">
					<label>Sous-catégorie</label>
					<select
						name="subCategory"
						value={formData.subCategory}
						onChange={handleChange}
						disabled={!subOptions.length}
					>
						<option value="">
							Sélectionnez une sous-catégorie
						</option>
						{subOptions.map((sub) => (
							<option key={sub} value={sub}>
								{sub}
							</option>
						))}
					</select>
				</div>

				<div className="formulaire__group">
					<label>Durée (minutes)</label>
					<input
						type="number"
						name="duration"
						value={formData.duration}
						onChange={handleChange}
					/>
				</div>

				<div className="formulaire__group">
					<label>Distance (km)</label>
					<input
						type="number"
						name="distance"
						value={formData.distance}
						onChange={handleChange}
					/>
				</div>

				<div className="formulaire__group">
					<label>Intensité</label>
					<select
						name="intensity"
						value={formData.intensity}
						onChange={handleChange}
					>
						<option value="">Sélectionnez l'intensité</option>
						<option value="Facile">Facile</option>
						<option value="Modéré">Modéré</option>
						<option value="Difficile">Difficile</option>
					</select>
				</div>

				<div className="formulaire__group">
					<label>Calories brûlées</label>
					<input
						type="number"
						name="calories"
						value={formData.calories}
						onChange={handleChange}
					/>
				</div>

				<div className="formulaire__group">
					<label>Commentaire</label>
					<input
						type="text"
						name="comment"
						value={formData.comment}
						onChange={handleChange}
					/>
				</div>

				<button type="submit">
					{editingId ? "Modifier" : "Sauvegarder"}
				</button>
			</form>

			{/* Toggle liste */}
			<button type="button" onClick={() => setShowList(!showList)}>
				{showList ? "Masquer mes activités" : "Voir mes activités"}
			</button>

			{showList && (
				<div>
					<h3>Mes activités</h3>
					<ul>
						{activities.map((act) => (
							<li key={act._id} onClick={() => handleEdit(act)}>
								{act.date?.split("T")[0]} - {act.category} /{" "}
								{act.subCategory || "-"} : {act.duration || "-"}{" "}
								min
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

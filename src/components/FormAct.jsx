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
	const [showList, setShowList] = useState(false);

	const token = localStorage.getItem("token");

	// Charger les activités
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
		if (token) fetchActivities();
	}, [token]);

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
					{
						headers: { Authorization: `Bearer ${token}` },
					}
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
			fetchActivities();
		} catch (err) {
			console.error(err);
			alert("Erreur lors de l'enregistrement");
		}
	};

	const handleEdit = (activity) => {
		setFormData({
			date: activity.date?.split("T")[0] || "",
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

	const handleResetAll = async () => {
		const confirm = window.confirm(
			"⚠️ Voulez-vous vraiment supprimer toutes vos activités ?"
		);
		if (!confirm) return;

		try {
			await axios.delete("http://localhost:5000/api/activities", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setActivities([]);
			alert("Toutes vos activités ont été supprimées !");
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la suppression de vos activités");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Voulez-vous vraiment supprimer cette activité ?"))
			return;
		try {
			await axios.delete(`http://localhost:5000/api/activities/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setActivities(activities.filter((act) => act._id !== id));
			alert("Activité supprimée !");
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la suppression");
		}
	};

	return (
		<div className="activity-manager">
			<form onSubmit={handleSubmit} className="formulaire">
				{/* Formulaire */}
				{Object.keys(initialForm).map((key) => {
					if (key === "category") {
						return (
							<div className="formulaire__group" key={key}>
								<label>Catégorie</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleCategoryChange}
								>
									<option value="">
										Sélectionnez une catégorie
									</option>
									{activityCategories.map((c) => (
										<option
											key={c.category}
											value={c.category}
										>
											{c.category}
										</option>
									))}
								</select>
							</div>
						);
					} else if (key === "subCategory") {
						return (
							<div className="formulaire__group" key={key}>
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
						);
					} else if (key === "intensity") {
						return (
							<div className="formulaire__group" key={key}>
								<label>Intensité</label>
								<select
									name="intensity"
									value={formData.intensity}
									onChange={handleChange}
								>
									<option value="">
										Sélectionnez l'intensité
									</option>
									<option value="Facile">Facile</option>
									<option value="Modéré">Modéré</option>
									<option value="Difficile">Difficile</option>
								</select>
							</div>
						);
					} else {
						const type = key === "date" ? "date" : "text";
						return (
							<div className="formulaire__group" key={key}>
								<label>
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</label>
								<input
									type={type}
									name={key}
									value={formData[key]}
									onChange={handleChange}
								/>
							</div>
						);
					}
				})}

				<button type="submit">
					{editingId ? "Modifier" : "Sauvegarder"}
				</button>
			</form>

			{activities.length > 0 && (
				<button className="reset-all" onClick={handleResetAll}>
					Réinitialiser toutes les activités
				</button>
			)}
			{activities.length > 0 && (
				<div className="recent-activities">
					<h3>Dernières activités</h3>
					<div className="activity-buttons">
						{activities.slice(0, 5).map((act) => (
							<div key={act._id} className="activity-card">
								<button
									className="delete-btn"
									onClick={() => handleDelete(act._id)}
								>
									❌
								</button>
								<p>
									<strong>Sous-catégorie:</strong>{" "}
									{act.subCategory}
								</p>
								<button onClick={() => handleEdit(act)}>
									Modifier
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

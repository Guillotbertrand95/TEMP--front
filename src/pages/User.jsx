// src/pages/User.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormulaireR from "../animations/FormulaireR.jsx";

export default function User() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const [formData, setFormData] = useState({});

	const profileFields = [
		{ name: "name", label: "Nom", type: "text", required: true },
		{ name: "email", label: "Email", type: "email", required: true },
		{ name: "age", label: "Âge", type: "number" },
		{ name: "height", label: "Taille", type: "number" },
		{ name: "weight", label: "Poids", type: "number" },
		{ name: "goal", label: "Objectif", type: "text" },
	];

	// ⚡ Récupération des infos du profil
	useEffect(() => {
		const fetchProfile = async () => {
			if (!token) return;
			try {
				const res = await axios.get(
					"http://localhost:5000/api/profile",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const profile = res.data;

				setFormData({
					name: profile.user?.name || "",
					email: profile.user?.email || "",
					age: profile.age || "",
					height: profile.height || "",
					weight: profile.weight || "",
					goal: profile.goal || "",
				});
			} catch (err) {
				console.error(err);
			}
		};
		fetchProfile();
	}, [token]);

	const handleSubmit = async (data) => {
		try {
			await axios.put("http://localhost:5000/api/profile", data, {
				headers: { Authorization: `Bearer ${token}` },
			});
			alert("Profil mis à jour ✅");
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la mise à jour du profil");
		}
	};

	const handleDeleteAccount = async () => {
		if (!window.confirm("⚠️ Supprimer votre compte ?")) return;

		try {
			await axios.delete("http://localhost:5000/api/profile", {
				headers: { Authorization: `Bearer ${token}` },
			});
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			alert("Compte supprimé ✅");
			navigate("/register");
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la suppression du compte");
		}
	};

	return (
		<div style={{ maxWidth: "600px", margin: "0 auto" }}>
			<h2>Profil</h2>

			<FormulaireR
				fields={profileFields}
				defaultValues={formData}
				onSubmit={handleSubmit}
				onDelete={handleDeleteAccount}
			/>
		</div>
	);
}

// src/pages/User.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Formulaire from "../components/Formulaire.jsx";
import { useNavigate } from "react-router-dom";

export default function User() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const [formData, setFormData] = useState({
		name: "",
		age: "",
		height: "",
		weight: "",
		goal: "",
	});

	const fieldsProfil = [
		{
			name: "name",
			label: "Nom",
			type: "text",
			placeholder: "Entrez votre nom",
		},
		{
			name: "age",
			label: "Âge",
			type: "number",
			placeholder: "Entrez votre âge",
		},
		{
			name: "height",
			label: "Taille",
			type: "number",
			placeholder: "Entrez votre taille",
		},
		{
			name: "weight",
			label: "Poids",
			type: "number",
			placeholder: "Entrez votre poids",
		},
		{
			name: "goal",
			label: "Objectif",
			type: "text",
			placeholder: "Entrez votre objectif",
		},
	];

	// Récupérer le profil existant pour préremplir le formulaire
	useEffect(() => {
		if (!token) return;
		axios
			.get("http://localhost:5000/api/profile", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setFormData(res.data))
			.catch((err) => console.error(err));
	}, [token]);

	// Mettre à jour le profil
	const handleSubmit = (data) => {
		axios
			.put("http://localhost:5000/api/profile", data, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(() => alert("Profil mis à jour"))
			.catch(console.error);
	};

	// Supprimer le compte
	const handleDeleteAccount = async () => {
		const confirm = window.confirm(
			"⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
		);
		if (!confirm) return;

		try {
			await axios.delete("http://localhost:5000/api/profile", {
				headers: { Authorization: `Bearer ${token}` },
			});

			localStorage.removeItem("token");
			localStorage.removeItem("user");
			alert("Votre compte a été supprimé avec succès !");
			navigate("/register");
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la suppression du compte.");
		}
	};

	return (
		<div style={{ maxWidth: "600px", margin: "0 auto" }}>
			<h2>Profil</h2>

			<Formulaire
				fields={fieldsProfil}
				initialValues={formData}
				onSubmit={handleSubmit}
			/>

			<button
				onClick={handleDeleteAccount}
				style={{
					color: "red",
					background: "transparent",
					border: "1px solid red",
					marginTop: "1rem",
					padding: "0.5rem 1rem",
					cursor: "pointer",
				}}
			>
				Supprimer mon compte
			</button>
		</div>
	);
}

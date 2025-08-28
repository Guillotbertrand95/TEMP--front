import { useEffect, useState } from "react";
import axios from "axios";
import Formulaire from "../components/Formulaire.jsx";

export default function Profil() {
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

	useEffect(() => {
		// Récupérer le profil existant pour préremplir le formulaire
		axios
			.get("http://localhost:5000/api/profile", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((res) => setFormData(res.data))
			.catch((err) => console.error(err));
	}, []);
	console.log(localStorage.getItem("token")); // Vérifie que le token est bien stocké

	const handleSubmit = (data) => {
		axios
			.put("http://localhost:5000/api/profile", data, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then(() => alert("Profil mis à jour"))
			.catch(console.error);
	};

	return (
		<Formulaire
			fields={fieldsProfil}
			initialValues={formData}
			onSubmit={handleSubmit}
		/>
	);
}

import { useState } from "react";
import "../styles/Register.scss";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/register",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();
			console.log(data);

			if (response.ok) {
				alert(data.message); // "Utilisateur inscrit avec succès !"
				navigate("/login"); // Redirection vers la page de connexion
			} else {
				alert(data.message); // Affiche l’erreur (ex: email déjà utilisé)
			}
		} catch (error) {
			console.error(error);
			alert("Erreur serveur, réessayez plus tard.");
		}
	};

	return (
		<div className="register">
			<h2>Créer un compte</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="name"
					placeholder="Nom"
					value={formData.name}
					onChange={handleChange}
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Mot de passe"
					value={formData.password}
					onChange={handleChange}
					required
				/>
				<button type="submit">S'inscrire</button>
			</form>
		</div>
	);
}

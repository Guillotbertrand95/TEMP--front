import { useState } from "react";
import "../styles/Register.scss";

export default function Register() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch("http://localhost:5000/api/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await response.json();

		console.log(data); // feedback pour savoir si ça marche
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

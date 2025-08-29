import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";
export default function Login() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
				navigate("/activity"); // Redirection vers page protégée
			}
		} catch (error) {
			console.error(error);
			alert("Erreur serveur, réessayez plus tard.");
		}
	};

	return (
		<div className="login">
			<h2>Connexion</h2>
			<form onSubmit={handleSubmit}>
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
				<button type="submit">Se connecter</button>
			</form>
		</div>
	);
}

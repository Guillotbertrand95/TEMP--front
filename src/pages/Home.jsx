import React, { useState } from "react";
import Register from "../components/Register.jsx";
import Login from "../components/Login.jsx"; // 👈 import du composant login
import "../styles/Home.scss";

export default function Home() {
	const [formType, setFormType] = useState(null); // null | "register" | "login"

	return (
		<div className="home">
			<h1>Bienvenu sur TEMPØ</h1>
			<p>
				Suis tes performances sportives et calcul tes calories dépensées
			</p>

			{!formType ? (
				<div className="home__buttons">
					<button
						className="home__btn home__btn--register"
						onClick={() => setFormType("register")}
					>
						Inscription
					</button>
					<button
						className="home__btn home__btn--login"
						onClick={() => setFormType("login")}
					>
						Connexion
					</button>
				</div>
			) : formType === "register" ? (
				<Register />
			) : (
				<Login />
			)}
		</div>
	);
}

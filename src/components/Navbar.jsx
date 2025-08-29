// components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.scss";

export default function Navbar({ onLogout }) {
	const navigate = useNavigate();

	const handleLogout = () => {
		onLogout(); // Supprime token + user
		navigate("/"); // Redirection vers la page de connexion
	};

	return (
		<nav>
			<ul>
				<li>
					<Link to="/user">Profil</Link>
				</li>
				<li>
					<Link to="/activity">Activités</Link>
				</li>
				<li>
					<Link to="/dashboard">Dashboard</Link>
				</li>
				<li>
					<button onClick={handleLogout}>Déconnexion</button>
				</li>
			</ul>
		</nav>
	);
}

// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.scss"; // Assurez-vous d'avoir un fichier CSS pour le style

export default function Navbar({ onLogout }) {
	return (
		<nav>
			<ul>
				{" "}
				<li>
					<Link to="/user">Profil</Link>
				</li>
				<li>
					<Link to="/activity">Activity</Link>
				</li>
				<li>
					<Link to="/dashboard">Dashboard</Link>
				</li>
				<li>
					<button onClick={onLogout}>Déconnexion</button>
				</li>
			</ul>
		</nav>
	);
}

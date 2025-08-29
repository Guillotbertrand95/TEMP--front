// components/Layout.jsx
import React from "react";
import Navbar from "./Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout({ onLogout }) {
	return (
		<div>
			<Navbar onLogout={onLogout} />{" "}
			{/* Navbar avec bouton Déconnexion */}
			<main>
				<Outlet /> {/* Affiche Dashboard, User, ActivityPage */}
			</main>
		</div>
	);
}

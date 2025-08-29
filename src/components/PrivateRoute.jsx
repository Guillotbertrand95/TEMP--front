import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
	const token = localStorage.getItem("token"); // Lit directement depuis localStorage
	if (!token) return <Navigate to="/" />; // Redirection si pas connecté
	return children;
}

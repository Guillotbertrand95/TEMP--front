// components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ token, children }) {
	if (!token) {
		return <Navigate to="/" />; // redirige si pas connecté
	}
	return children;
}

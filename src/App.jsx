import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import User from "./pages/User.jsx";
import Activity from "./pages/Activity.jsx";
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
	const [token, setToken] = useState(localStorage.getItem("token") || null);

	const handleLogin = (token) => {
		localStorage.setItem("token", token);
		setToken(token);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		setToken(null);
	};

	return (
		<Routes>
			<Route path="/" element={<Home onLogin={handleLogin} />} />

			<Route
				element={
					<PrivateRoute token={token}>
						<Layout onLogout={handleLogout} />
					</PrivateRoute>
				}
			>
				<Route path="/dashboard" element={<DashBoard />} />
				<Route path="/user" element={<User />} />
				<Route path="/activity" element={<Activity />} />
			</Route>

			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

export default App;

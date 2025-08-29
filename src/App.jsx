import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import User from "./pages/User.jsx";
import ActivityPage from "./pages/Activity.jsx";
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	};

	return (
		<Routes>
			{/* Pages publiques */}
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* Pages protégées */}
			<Route
				element={
					<PrivateRoute>
						<Layout onLogout={handleLogout} />
					</PrivateRoute>
				}
			>
				<Route path="/dashboard" element={<DashBoard />} />
				<Route path="/user" element={<User />} />
				<Route path="/activity" element={<ActivityPage />} />
			</Route>

			{/* Redirection par défaut */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

export default App;

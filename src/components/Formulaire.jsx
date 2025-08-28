import { useState } from "react";
import "../styles/Formulaire.scss";
export default function Formulaire({ fields, initialValues, onSubmit }) {
	const [formData, setFormData] = useState(initialValues || {});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="formulaire">
			{fields.map((field, idx) => (
				<div key={idx} className="formulaire__group">
					<label className="formulaire__label">{field.label}</label>
					<input
						type={field.type}
						name={field.name}
						placeholder={field.placeholder}
						value={formData[field.name] || ""}
						onChange={handleChange}
						className="formulaire__input"
					/>
				</div>
			))}
			<button type="submit" className="formulaire__button">
				Sauvegarder
			</button>
		</form>
	);
}

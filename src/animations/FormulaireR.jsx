// src/animations/FormulaireR.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "../styles/FormulaireR.scss";

export default function FormulaireR({
	fields,
	defaultValues,
	onSubmit,
	onDelete,
}) {
	// Création dynamique du schema Yup
	const schema = Yup.object(
		fields.reduce((acc, f) => {
			if (f.required)
				acc[f.name] = Yup.string().required(`${f.label} requis`);
			return acc;
		}, {})
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues,
		resolver: yupResolver(schema),
	});

	// ⚡ Quand defaultValues change, on reset le formulaire
	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="dynamic-form">
			{fields.map((f) => (
				<div key={f.name} className="dynamic-form__group">
					<label>{f.label}</label>

					{f.type === "select" ? (
						<select {...register(f.name)}>
							<option value="">Sélectionnez...</option>
							{f.options?.map((o) => (
								<option key={o} value={o}>
									{o}
								</option>
							))}
						</select>
					) : (
						<input
							{...register(f.name)}
							type={f.type}
							placeholder={f.placeholder || ""}
						/>
					)}

					{errors[f.name] && (
						<span className="error">{errors[f.name].message}</span>
					)}
				</div>
			))}

			<div className="dynamic-form__buttons">
				<button type="submit">Sauvegarder</button>
				{onDelete && (
					<button
						type="button"
						onClick={onDelete}
						className="delete-button"
					>
						Supprimer
					</button>
				)}
			</div>
		</form>
	);
}

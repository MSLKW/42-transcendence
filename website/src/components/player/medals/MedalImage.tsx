import React from "react";

interface MedalImageProp {
	icon: React.ReactNode,
	title: string,
	subtitle: string,
}

export const MedalImage = ({ icon, title, subtitle }: MedalImageProp) => {
	return (
		<button
			data-tip-title={title}
			data-tip-subtitle={subtitle}
			type="button"
			aria-label={`${title}, ${subtitle}`}
			className="
				h-12.5 aspect-square
				btn-icon bg-dark rounded-full
				data-tip-medal
			"
		>
			{icon}
		</button>
	);
}
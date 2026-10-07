import { useState } from "react";
import { createPortal } from "react-dom";

type MedalTooltipProps = {
	text: string;
	description: string;
	date: string;
	children: React.ReactNode;
};

export function MedalTooltip({ text, date, description, children }: MedalTooltipProps) {
	const [visible, setVisible] = useState(false);
	const [pos, setPos] = useState({ top: 0, left: 0 });

	const showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setPos({
			top: rect.top - 8,
			left: rect.left + rect.width / 2,
		});

		setVisible(true);
	};

	return (
		<>
			<div
				onMouseEnter={showTooltip}
				onMouseLeave={() => setVisible(false)}
			>
				{children}
			</div>

			{visible && createPortal(
				<div
					style={{
						top: pos.top,
						left: pos.left,
					}}
					className="
						fixed z-9999
						-translate-y-full
						-translate-x-1/2
						bg-dark rounded-md px-2rem py-1rem
						text-1.25rem text-white shadow-lg
						pointer-events-none
						whitespace-nowrap
						flex flex-col place-content-center place-items-center
						gap-1rem
				">
					<div className="flex flex-col place-items-center">
						<h3>{text}</h3>
						<h3>{description}</h3>
					</div>
					<p>{date}</p>
				</div>,
				document.body
			)}
		</>
	);
}
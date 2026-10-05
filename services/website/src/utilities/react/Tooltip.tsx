import { useState } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
	text: string;
	position?: string;
	children: React.ReactNode;
};

export function Tooltip({ text, position = "top", children }: TooltipProps) {
	const [visible, setVisible] = useState(false);
	const [pos, setPos] = useState({ top: 0, left: 0 });

	const showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		if (position === "top") {
			setPos({
				top: rect.top - 8,
				left: rect.left + rect.width / 2,
			});
		} else if (position === "left") {
			setPos({
				top: rect.top + rect.height / 2,
				left: rect.left - rect.width / 2 - 16,
			});
		} else if (position === "bottom") {
			setPos({
				top: rect.bottom + rect.height,
				left: rect.left + rect.width / 2,
			});
		}

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
					className={`
						fixed z-9999
						${
							position === "left" ? "-translate-y-1/2" :
							"-translate-y-full"
						}
						-translate-x-1/2
						bg-dark rounded-full px-3 py-2
						text-1.25rem text-white shadow-lg
						pointer-events-none
						whitespace-nowrap relative
				`}>
					{text}
				</div>,
				document.body
			)}
		</>
	);
}
interface DevButtonProps {
	label: string;
	call: () => void;
}

export const DevButton = ({ label, call }: DevButtonProps) => {
	return (
		<li>
			<button
				type="button"
				tabIndex={-1}
				onClick={call}
				className="
					hover:scale-105
					cursor-pointer
				"
			>
				{label}
			</button>
		</li>
	);
}
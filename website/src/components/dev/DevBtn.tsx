interface DevButtonProps {
	label: string,
	call: () => void,
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
					text-r4 hover:text-r5
					cursor-pointer
				"
			>
				{label}
			</button>
		</li>
	);
}
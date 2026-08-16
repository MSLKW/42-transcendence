interface GameActionButtonProps {
	label: string,
	call: () => void,
	isDisabled: boolean,
}
export const GameActionButton = ({ label, call, isDisabled }: GameActionButtonProps) => {
	return (
		<button
			onClick={call}
			disabled={isDisabled}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
			"
		>
			{label}
		</button>
	);
}
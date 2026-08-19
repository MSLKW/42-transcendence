interface RadioButtonProps {
	name: string,
	value: string,
	onChange: () => void,
	checked: boolean,
	disabled?: boolean,
}

export const RadioButton = ({ name, value, onChange, checked, disabled }: RadioButtonProps) => {
	return (
		<>
			<input
				type="radio"
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				className="sr-only peer"
			/>
			<div className="
				h-6 aspect-square
				border border-n6 rounded-full
				p-1.25
				peer-focus-visible:border-b5
				outline-b5 peer-focus-visible:outline-1
			">
				<div className={`
					h-full w-full rounded-full bg-b5
					transition-all duration-200 ease-in-out
					${checked ? "scale-100" : "scale-0"}
				`}/>
			</div>
		</>
	);
}
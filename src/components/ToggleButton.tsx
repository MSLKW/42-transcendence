interface ToggleButtonProps {
	checked: boolean,
	onChange: () => void,
}

export const ToggleButton = ({checked, onChange}: ToggleButtonProps) => {
	return (
		<>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="sr-only peer"
			/>
			<div className={`
				h-6 aspect-5/3
				p-1 rounded-full
				bg-n6 peer-checked:bg-b5 
				peer-focus-visible:outline-2 outline-b5 outline-offset-5
				grid ${checked ? "grid-cols-[1fr_auto_0fr]" : "grid-cols-[0fr_auto_1fr]"}
				transition-all duration-200 ease-in-out
			`}>
				<div className="overflow-hidden"/>
				<div className={`
					h-full aspect-square
					rounded-full
					${checked ? "bg-n0" : "bg-n1"}
				`}/>
				<div className="overflow-hidden"/>
			</div>
		</>
	);
}
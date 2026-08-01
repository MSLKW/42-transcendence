import { useState, useRef, useEffect } from "react";
import { ShowPasswordIcon } from "./password/ShowPasswordIcon";
import { HidePasswordIcon } from "./password/HidePasswordIcon";

interface FormInputModuleProps {
	label: string;
	value: string;
	placeholder?: string;
	inputFor: string;
	hasFocusRef?: boolean;
	isPassword?: boolean;
	call: (value: string) => void;
}

export const FormInputModule = ({
	label,
	value,
	placeholder,
	inputFor,
	isPassword = false,
	hasFocusRef = false,
	call
}: FormInputModuleProps) => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (hasFocusRef && focusRef.current)
			focusRef.current.focus();
	}, [hasFocusRef]);

	const [showValue, setShowValue] = useState(!isPassword);
	
	return (
		<label
			htmlFor={inputFor}
			className="
				flex gap-2rem
				relative
			"
		>
			<h2 className="text-right w-[25%]">{label}</h2>
			<input
				ref={hasFocusRef ? focusRef : undefined}
				id={inputFor}
				type={showValue ? "text" : "password"}
				value={value}
				placeholder={placeholder}
				onChange={(e) => call(e.target.value)}
				className="
					w-[70%]
					bg-n6
					border border-n5 rounded-full
					py-0.5rem px-1.5rem
					text-n0 placeholder:text-n4 placeholder:italic
					pointer-events-auto
					focus:outline-2 outline-b5 outline-offset-5
					placeholder:text-1rem
				"
			/>
			{ isPassword &&
				<button
					type="button"
					tabIndex={-1}
					onClick={() => setShowValue(!showValue)}
					className="
						absolute right-1 top-1/2 -translate-y-1/2
						h-[80%] aspect-square
						text-n0
						btn-icon
						rounded-full
				">
					{ showValue ? <ShowPasswordIcon /> : <HidePasswordIcon /> }
				</button>
			}
		</label>
	);
}
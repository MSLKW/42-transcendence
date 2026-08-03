import { useProfileStore } from "../../store/ProfileStore";
import { AvatarImage } from "./AvatarImage";

interface AvatarInputModuleProps {
	setIsValid?: (isValid: boolean) => void;
	inputRef?: React.RefObject<HTMLInputElement | null>;
	submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
}
export const AvatarInputModule = ({ setIsValid, inputRef, submitButtonRef }: AvatarInputModuleProps) => {
	const { data, setProfileDataValue } = useProfileStore();

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setProfileDataValue("name", value);
		setIsValid?.(value.trim().length > 0);
	}

	return (
		<div className="
			flex place-content-evenly place-items-center
			py-2rem px-4rem
			gap-2rem
		">
			<div className="
				flex flex-col
				place-content-center place-items-center
				gap-3
			">
				<AvatarImage />
				<input
					ref={inputRef}
					id="name"
					type="text"
					value={data.name ?? ""}
					placeholder="Name"
					onChange={handleInput}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							e.currentTarget.blur();
							if (data.name?.trim())
								submitButtonRef?.current?.focus();
						} else if (e.key === "Escape")
							e.currentTarget.blur();
					}}
					className="
						bg-n6 h-2.5 w-42.5
						border border-n5 rounded-full
						p-4
						text-n0 text-center
						pointer-events-auto
						focus:outline-2 outline-b5 outline-offset-5
				"/>
			</div>
		</div>
	);
}
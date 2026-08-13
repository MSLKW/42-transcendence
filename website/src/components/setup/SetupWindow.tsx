import { useState } from "react";
import { Window } from "../window/Window";
import { AvatarInputModule } from "../avatar/AvatarInputModule";
import { AvatarSelectModule } from "../avatar/AvatarSelectModule";
import { SetupValidationModule } from "./SetupValidationModule";

export const SetupWindow = () => {
	const [name, setName] = useState("");
	const [avatar, setAvatar] = useState("");

	return (
		<>
			<button
				className="
					fixed z-1 top-0 left-0
					h-screen w-screen
					backdrop-blur-xs
					pointer-events-none
				"
			/>
			<Window
				title="Setup"
				dismissKey="setup"
				hasHeader={false}
			>
				<div className="
					h-fit w-140
					bg-linear-to-b from-n0 to-n1
					border border-n1 rounded-xl
					divide-y divide-n2/40
					py-1rem px-3rem
				">
					<AvatarInputModule
						name={name}
						setName={setName}
					/>
					<AvatarSelectModule
						avatar={avatar}
						setAvatar={setAvatar}
					/>
					<SetupValidationModule
						name={name}
						avatar={avatar}
					/>
				</div>
			</Window>
		</>
	);
}
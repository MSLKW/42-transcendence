import { useState } from "react";
import { useProfileStore } from "../../store/ProfileStore";
import { Window } from "../window/Window";
import { AvatarSetNameModule } from "../avatar/name/AvatarSetNameModule";
import { AvatarSelectModule } from "../avatar/image/AvatarSetImageModule";
import { SetupValidationModule } from "./SetupValidationModule";

export const SetupWindow = () => {
	const { clientUuid } = useProfileStore();
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
				headerType="None"
			>
				<div className="
					max-h-[85vh] w-[80vw] max-w-215
					bg-linear-to-b from-n0 to-n1
					border border-n1 rounded-xl
					divide-y divide-n2/40
					py-1rem px-3rem
				">
					<AvatarSetNameModule
						name={name}
						setName={setName}
						avatar={avatar}
						uuid={clientUuid ?? undefined}
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
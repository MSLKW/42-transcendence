import { useSceneStore } from "../../store/SceneStore";
import { BigLogo } from "./logo/BigLogo";
import { CreateAccountButton } from "./create_account/CreateAccountButton";
import { SignInButton } from "./sign_in/SignInButton";

export const LoginScene = () => {
	const { setCurrentScene } = useSceneStore();

	return (
		<>
			<main
				className="
					h-full w-full
					flex flex-col place-content-center
					pointer-events-none
					pt-[clamp(5rem,15.385vmin+0.385rem,10rem)]
				"
			>
				<BigLogo />
			</main>
			<footer
				className="
					flex flex-col place-content-center place-items-center
					gap-2rem
					mb-[clamp(2.5rem,7.692vmin+0.192rem,5rem)]
				"
			>
				<div
					className="
						flex place-content-center place-items-center
						gap-2rem
						flex-wrap
					"
				>
					<CreateAccountButton />
					<SignInButton />
				</div>
				<button
					onClick={() => setCurrentScene("Home")}
					className="
						btn-text bg-clear
						h-3rem aspect-6/1
						text-1.25rem text-n6 hover:not-disabled:text-b5 focus-visible:text-b5
					"
				>
					<u>PLAY AS GUEST</u>
				</button>
			</footer>
		</>
	);
}
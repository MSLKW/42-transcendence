import { useSceneStore } from "../store/SceneStore";
import { BigLogo } from "../modules/Logo";
import { CreateAccountButton } from "../components/button/CreateAccount";
import { SignInButton } from "../components/button/SignIn";

export const Login = () => {
	const { setCurrentScene } = useSceneStore();
	
	return (
		<>
			<main className="
				h-full w-full
				flex flex-col place-content-center
				pointer-events-none
			">
				<div className="w-full h-37.5" />
				<BigLogo />
			</main>
			<footer className="
				flex flex-col place-content-center place-items-center
				gap-[clamp(0.75rem,2.308vh+0.058rem,1.5rem)]
			">
				<div className="
					flex place-content-center place-items-center
					gap-[clamp(0.75rem,2.308vh+0.058rem,1.5rem)]
					flex-wrap
				">
					<SignInButton />
					<button onClick={() => setCurrentScene("HOME")} className="btn-white hw-5/1">PLAY AS GUEST</button>
				</div>
				<CreateAccountButton />
			</footer>
			<div className="h-[clamp(0rem,30.769vh-9.231rem,10rem)]"/>
		</>
	);
}
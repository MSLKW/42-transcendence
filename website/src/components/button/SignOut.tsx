import { useSceneStore } from "../../store/SceneStore";
import { SignOutIcon } from "../icons/SignOutIcon";

export const SignOutButton = () => {
    const setCurrentScene = useSceneStore((state) => state.setCurrentScene);

    return (
        <button
            data-tip="Sign Out"
            onClick={() => setCurrentScene("LOGIN")}
            className="btn-icon btn-tip-down"
        >
                <SignOutIcon />
        </button>
    );
}
import { NextGameIcon } from "../icon/NextGame";
import { useSceneStore } from "../../store/SceneStore";

export const NextGameButton = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);

    return (
        <button
            data-tip="Next Game"
            className="btn-icon btn-icon-border btn-tip-down"
            onClick={() => setCurrentScene("R3F")} 
        >
            <NextGameIcon />
        </button>
    );
}
import { NextGameIcon } from "../icons/NextGameIcon";
import { useGameStore } from "../store/useGameStore";

export const NextGameButton = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);

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
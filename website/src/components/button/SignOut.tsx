import { useDevStore } from "../../store/DevStore";
import { SignOutIcon } from "../icon/SignOut";

export const SignOutButton = () => {
    const { resetGame } = useDevStore();

    return (
        <button
            data-tip="Sign Out"
            onClick={() => resetGame()}
            className="btn-icon btn-tip-down"
        >
                <SignOutIcon />
        </button>
    );
}
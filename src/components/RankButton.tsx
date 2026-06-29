import { useSceneStore } from "../store/useSceneStore";
import { RankIcon } from "../icons/RankIcon";
import { PinButton } from "./PinButton";

interface RankProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
}

export const RankButton = ({ call }: RankProps) => {
    return (
        <button
            data-tip="Rank List"
			onClick={call}
            className="btn-icon btn-tip-down"
        >
            <RankIcon />
        </button>
    );
}

export const RankLightbox = ({ dismiss }: RankProps) => {
    const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
    const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);

    return (
        <section className="
            absolute z-1 top-0 left-0
            w-screen h-screen
            flex place-content-center place-items-center
        ">
            <button tabIndex={-1} className='btn-lightbox-no-blur' onClick={dismiss}/>
            <div style={{ width: contAreaWidth, height: contAreaHeight }}
                className="
                    z-0
                    flex place-content-center place-items-center
                    pointer-events-none
            ">
                <div className="
                    w-[80%] h-[80%]
                    relative
                ">
                    <div tabIndex={-1}
                        className="
                            border border-n2 rounded-[clamp(0px,2vh,24px)]
                            w-full h-full
                            overflow-scroll
                            pointer-events-auto
                    ">
                        <div className="
                            w-full h-[2000px]
                            bg-linear-to-b from-a2 to-b2 
                            p-10
                            text-n6
                            flex flex-col justify-between
                        ">
                            <p>Start of rank section</p>
                            <p>End of rank section</p>
                        </div>
                    </div>
                    <div className="
                        absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
                        z-1
                        w-12.5 h-12.5
                    ">
                        <PinButton />
                    </div>
                </div>
            </div>
        </section>
    );
}
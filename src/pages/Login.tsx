import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";
import { Info } from "../icons/Info";
import { Close } from "../icons/Close";

export const Login = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	const showStats = useDevStore((state) => state.showStats);
	const [contAreaWidth, setContAreaWidth] = useState(0);
	const [contAreaHeight, setContAreaHeight] = useState(0);
	const containerRef = useRef(null);
	const [showPopWindow, setShowPopWindow] = useState({
		info: true,
		signIn: false,
		createAccount: false,
	});

	const togglePopWindow = (key: keyof typeof showPopWindow, value: boolean) => {
		setShowPopWindow(() => ({
			...showPopWindow,
			[key]: value,
		}));
	}

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, []);
	
	useEffect(() => {
		if (!containerRef.current)
			return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setContAreaWidth(entry.target.scrollWidth);
				setContAreaHeight(entry.target.scrollHeight);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);
	
	return (
		<section ref={containerRef} className={`cont-area ${showFrame ? "border" : ""}`}>
			{showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div>}
			<div className="z-0 flex flex-col w-full h-full">
				<div className={`
					cont-row basis-12.5 shrink ${showFrame ? "border" : ""}
					justify-end
				`}>
					<button className="btn-icon" data-tip="Info" onClick={() => togglePopWindow('info', true)}><Info /></button>
				</div>
				<div className={`cont-row min-h-10 flex-3 ${showFrame ? "border" : ""}`}/>
				<div className={`cont-row basis-17.5 shrink flex flex-wrap justify-center items-center gap-5 ${showFrame ? "border" : ""}`}>
					<button className="btn-text">SIGN IN</button>
					<button className="btn-text">PLAY AS GUEST</button>
				</div>
				<div className={`cont-row basis-17.5 shrink flex justify-center items-center ${showFrame ? "border" : ""}`}>
					<button className={`btn-clear ${showFrame ? "border" : ""}`}><u>CREATE ACCOUNT</u></button>
				</div>
				<div className={`cont-row min-h-5 flex-1 ${showFrame ? "border" : ""}`} />
			</div>
			{showPopWindow["info"] &&
				<div style={{ width: contAreaWidth, height: contAreaHeight }}
					className={`
						absolute z-1 inset-0 left-0
						w-full h-full
						border-a4 ${showFrame ? "border" : ""}
						flex place-content-center place-items-center
				`}>
					<button className='btn-lightbox' onClick={() => togglePopWindow('info', false)}/>
					<div className="
						z-0
						w-[calc(100%-130px)] h-[calc(100%-130px)]
						border border-n2 rounded-3xl
						overflow-scroll
						relative
					">
						<div className="
							w-full h-[2000px]
							bg-linear-to-b from-a2 to-b2 
							p-10
							text-n6
							flex flex-col justify-between
						">
							<p>Start of info section</p>
							<p>End of info section</p>
						</div>
					</div>
					<button data-tip="Close"
						className="btn-icon
							absolute z-1 top-0 right-0 translate-x-[-39px] translate-y-[41px]"
						onClick={() => togglePopWindow('info', false)}>
							<Close />
					</button>
				</div>
			}
		</section>
	);
}
import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";

function RotatingSphere() {
	const sphereRef = useRef<Mesh | null>(null);

	useFrame((_state, delta) => {
		if (!sphereRef.current)
			return;
		sphereRef.current.rotation.y += 0.2 * delta;
		sphereRef.current.rotation.x += 0.1 * delta;
	});

	return (
		<mesh ref={sphereRef}>
			<sphereGeometry args={[1,16,16]} />
			<meshStandardMaterial color="gold" wireframe />
		</mesh>
	);
}
function UIButton() {
	return (
		<button className="
			h-full min-h-0 max-h-12.5
			aspect-square
			bg-n1
			border border-n2 rounded-3xl
			hover:scale-150
			pointer-events-auto
		"/>
	);
}

export const R3F = () => {
	const showStats = useDevStore((state) => state.showStats);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})}
	, []);

	return (
		<>
			<section className="cont-bg">
				<svg
					width="100vw"
					height="100vh"
					viewBox="0 0 100 100"
					preserveAspectRatio="xMidYMid slice"
				>
					<polygon
						points="50,0 100,0 50,100, 0,100"
						fill="var(--color-a1)"
						stroke="var(--color-a2)"
						strokeWidth="0.1"
					/>
				</svg>
			</section>
			<main className="cont-main">
				<Canvas className="cont-main-canvas">
					{showStats && <Stats />}
					<ambientLight intensity={0.5}/>
					<RotatingSphere />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
				<div className="cont-main-body flex place-content-evenly place-items-center">
					<div className="w-full h-full flex flex-col place-content-between place-items-center">
						<UIButton />
						<UIButton />
					</div>
					<div className="w-full h-full flex flex-col place-content-between place-items-center">
						<UIButton />
						<UIButton />
					</div>
				</div>
			</main>
			<section className="cont-overlay">
				<header className="cont-overlay-header flex justify-end">
					<UIButton />
				</header>
				<div className="cont-overlay-body flex flex-col place-content-center place-items-center">
					<UIButton />
					<UIButton />
					<UIButton />
					<UIButton />
				</div>
				<footer className="cont-overlay-footer flex place-items-center">
					<UIButton />
				</footer>
			</section>
		</>
	);
}
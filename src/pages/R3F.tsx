import { useState, useEffect, useRef } from "react";
import type { Mesh } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { StripeBg } from "../components/StripeBg";
import { AvatarPlayer } from "../components/Avatar";
import { InfoButton, InfoLightbox } from "../components/Info";

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

export const R3F = () => {
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const [showLightbox, setShowLightbox] = useState({
		info: false,
	});
	const toggleLightbox = (key: keyof typeof showLightbox, value: boolean) => {
		setShowLightbox(() => ({
			...showLightbox,
			[key]: value,
		}));
	}

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})}
	, []);

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
		<>
		<div className="cont">
			<StripeBg />
			<section ref={containerRef} className="cont-main">
				<Canvas className="cont-main-canvas">
					{showStats && <Stats />}
					<AdaptiveDpr />
					<ambientLight intensity={0.5}/>
					<RotatingSphere />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
				<div className="cont-main-body" />
			</section>
			<section className="cont-overlay">
				<header className="cont-overlay-header flex justify-end">
					<InfoButton call={() => toggleLightbox("info", true)}/>
				</header>
				<main className="cont-overlay-body flex">
					<div className="w-full h-full">
					</div>
				</main>
				<footer className="cont-overlay-footer flex place-items-center">
					<AvatarPlayer />
				</footer>
			</section>
		</div>
		{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
		</>
	);
}
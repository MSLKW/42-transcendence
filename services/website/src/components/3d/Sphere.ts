// import { useRef } from "react";
// import type { Mesh } from "three";
// import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

// export const SphereBg = () => {
// 	const sphereRef = useRef<Mesh | null>(null);

// 	useFrame((_state, delta) => {
// 		if (!sphereRef.current)
// 			return;
// 		sphereRef.current.rotation.y += 0.025 * delta;
// 		sphereRef.current.rotation.x += 0.0125 * delta;
// 	});

// 	return (
// 		<mesh ref={sphereRef}>
// 			<sphereGeometry args={[1,16,16]} />
// 			<meshStandardMaterial color="gold" wireframe />
// 		</mesh>
// 	);
// }

export function SphereBg(): THREE.Mesh {
	const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
	const sphereMaterial = new THREE.MeshStandardMaterial({color: "gold", wireframe: true});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	// animation
	// 	sphereRef.current.rotation.y += 0.025 * delta;
	// 	sphereRef.current.rotation.x += 0.0125 * delta;
	return (sphere);
}
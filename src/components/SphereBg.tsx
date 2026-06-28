import { useRef } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

export const SphereBg = () => {
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
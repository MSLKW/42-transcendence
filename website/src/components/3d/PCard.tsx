// import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

const createCardShape = (width: number, height: number, radius: number): THREE.Shape => {
	const shape = new THREE.Shape();
	const x = -width / 2;
	const y = -height / 2;
	shape.moveTo(x, y + radius);
	shape.lineTo(x, y + height - radius);
	shape.quadraticCurveTo(x, y + height, x + radius, y + height);
	shape.lineTo(x + width - radius, y + height);
	shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	shape.lineTo(x + width, y + radius);
	shape.quadraticCurveTo(x + width, y, x + width - radius, y);
	shape.lineTo(x + radius, y);
	shape.quadraticCurveTo(x, y, x, y + radius);
	return shape;
}
const borderGeometry = new THREE.ExtrudeGeometry(createCardShape(1, 1.5, 0.15), {
	depth: 0.005,
	bevelEnabled: false,
});
const faceGeometry = new THREE.ExtrudeGeometry(createCardShape(0.92, 1.32, 0.04), {
	depth: 0.005,
	bevelEnabled: false,
});

interface CardProps {
	position?: [number, number, number],
	rotation?: [number, number, number],
	color?: string,
}

export const Card = ({ position = [0,0,0], rotation = [0,0,0], color = "gold" }: CardProps) => {
	return (
		// <mesh>
		// 	<boxGeometry />
		// 	<meshBasicMaterial visible={false} />
		// </mesh>
		
		<mesh
			geometry={borderGeometry}
			position={position}
			rotation={rotation}
		>
			<meshStandardMaterial
				color={color}
				roughness={0.2}
				metalness={0.2}
			/>
		</mesh>
	);
}

// export const Card = ({ children, ...props }: CardProps) => {
	// const visualMeshRef = useRef<THREE.Group>(null);
	// const velocity = useRef({ x: 0, y: 0 });
	// const prevMouse = useRef({ x: 0, y: 0 });

	// const colors = useThemeStore((state) => state.colors);
	// const fetchTailwindColors = useThemeStore((state) => state.fetchTailwindColors);

	// useEffect(() => {
	// 	fetchTailwindColors()
	// }, [fetchTailwindColors])

	// const faceUniforms = useMemo<CustomUniforms>(() => ({
	// 	colorTop: { value: new THREE.Color(colors.faceStart) },
	// 	colorBottom: { value: new THREE.Color(colors.faceEnd) }
	// }), []);

	// return (
	// 	<group ref={visualMeshRef} {...props}>
	// 		<mesh>
	// 			<boxGeometry args={[1, 1, 0.05]} />
	// 			<shaderMaterial
	// 				uniforms={faceUniforms}
	// 				vertexShader={vertexShader}
	// 				fragmentShader={fragmentShader}
	// 			/>
	// 		</mesh>
	// 		{children}
	// 	</group>
	// );
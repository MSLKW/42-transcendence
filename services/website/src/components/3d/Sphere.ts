import * as THREE from 'three';

export function SphereBg(): THREE.Mesh {
	const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
	const sphereMaterial = new THREE.MeshStandardMaterial({color: "gold", wireframe: true});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	// animation
	// 	sphereRef.current.rotation.y += 0.025 * delta;
	// 	sphereRef.current.rotation.x += 0.0125 * delta;
	return (sphere);
}
import { useRef, useState } from "react";
import { BoxBufferGeometryProps, BoxGeometryProps, useFrame } from "@react-three/fiber";
import { BoxGeometry, Mesh } from "three";

function Box(props: BoxBufferGeometryProps) {
	const mesh = useRef<Mesh>(null);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	useFrame((state, delta) => {
		if (mesh.current) mesh.current.rotation.x += 0.01;
	});
	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}
export default Box;

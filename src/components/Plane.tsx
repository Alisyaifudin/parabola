import { PlaneProps, usePlane } from "@react-three/cannon";
import { Mesh } from "three";

function Plane(props: PlaneProps) {
	const [ref] = usePlane<Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
	return (
		<mesh receiveShadow ref={ref}>
			<planeGeometry args={[1000, 1000]} />
			<meshStandardMaterial color="whitesmoke" />
		</mesh>
	);
}
export default Plane;

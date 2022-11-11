import { useRef, useState } from "react";
import { CylinderBufferGeometryProps } from "@react-three/fiber";
import { Mesh } from "three";

type Size = [radiusTop?: number | undefined, radiusBottom?: number | undefined, height?: number | undefined, radialSegments?: number | undefined, heightSegments?: number | undefined, openEnded?: boolean | undefined, thetaStart?: number | undefined, thetaLength?: number | undefined] | undefined

type ConeProps = CylinderBufferGeometryProps & {color?: string, size?: Size}

function Cone({color = "green", size = [0,0.3,1], ...props}: ConeProps) {
	const ref = useRef<Mesh>(null);
	return (
		<mesh {...props} ref={ref}>
			<cylinderGeometry args={size} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
}
export default Cone;

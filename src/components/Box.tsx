import { useRef, useState } from "react";
import { BoxBufferGeometryProps } from "@react-three/fiber";
import { Mesh } from "three";

type Size = [width?: number | undefined, height?: number | undefined, depth?: number | undefined, widthSegments?: number | undefined, heightSegments?: number | undefined, depthSegments?: number | undefined] | undefined

type BoxProps = BoxBufferGeometryProps & {color?: string, size?: Size}

function Box({color = "gray", size = [1,1,1], ...props}: BoxProps) {
	const ref = useRef<Mesh>(null);
	return (
		<mesh {...props} ref={ref}>
			<boxGeometry args={size} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
}
export default Box;

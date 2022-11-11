import { useEffect, useRef, useState } from "react";
import { SphereBufferGeometryProps, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

type Size =
	| [
			radius?: number | undefined,
			widthSegments?: number | undefined,
			heightSegments?: number | undefined,
			phiStart?: number | undefined,
			phiLength?: number | undefined,
			thetaStart?: number | undefined,
			thetaLength?: number | undefined
	  ]
	| undefined;

type SphereProps = SphereBufferGeometryProps & {
	paused: boolean;
	size?: Size;
	position: number[];
	velocity: number[];
	restitution: number;
	wall: number[];
	airResistance: number;
	noise: number;
};

const g = 9.8; // m/s^2

function Sphere({
	paused,
	size = [1, 1, 1],
	position,
	velocity,
	restitution,
	wall,
	airResistance,
	noise,
	...props
}: SphereProps) {
	const randomNoiseX = (Math.random() * noise) / 50;
	const randomNoiseY = (Math.random() * noise) / 50;
	const ref = useRef<Mesh>(null);
	useFrame((state, delta) => {
		if (!ref.current) return;
		if (paused) {
			// console.log("HAH?", position)
			ref.current.position.x = position[0];
			ref.current.position.y = position[1];
			ref.current.position.z = position[2];
			ref.current.userData = position;
			ref.current.userData.velocity = velocity;
			return;
		}
		const { position: pos, velocity: vel, below } = ref.current.userData;
		const [x, y, z] = pos;
		const [vx, vy, vz] = vel;
		const [ax, ay, az] = [
			-1 * vx * airResistance,
			-g - 1 * vy * airResistance,
			-1 * vz * airResistance,
		];
		const [dvx, dvy, dvz] = [ax * delta, ay * delta, az * delta];
		const [dx, dy, dz] = [vx * delta, vy * delta, vz * delta];
		const radius = size[0] || 1;
		if (y + dy - radius < 0 && vy + dvy < 0) {
			let damp = 1;
			if (vy + dvy > -0.6) damp = 0.1;

			ref.current.userData.velocity = [vx + dvx, -1 * vy * restitution * damp, vz + dvz];
			ref.current.position.set(x + dx, radius, z + dz);
			ref.current.userData.position = [x + dx, radius, z + dz];
		} else if (x + dx - radius < wall[0] && vx + dvx < 0) {
			ref.current.userData.velocity = [-1 * vx * restitution, vy + dvy, vz + dvz];
			ref.current.position.set(wall[0] + radius, y + dy, z + dz);
			ref.current.userData.position = [wall[0] + radius, y + dy, z + dz];
		} else if (x + dx + radius > wall[1] && vx + dvx > 0) {
			ref.current.userData.velocity = [-1 * vx * restitution, vy + dvy, vz + dvz];
			ref.current.position.set(wall[1] - radius, y + dy, z + dz);
			ref.current.userData.position = [wall[1] - radius, y + dy, z + dz];
		} else {
			ref.current.userData.velocity = [vx + dvx, vy + dvy, vz + dvz];
			ref.current.position.set(x + dx, y + dy, z + dz);
			ref.current.userData.position = [x + dx, y + dy, z + dz];
		}
		// console.log(x)
	});
	return (
		<mesh
			{...props}
			position={new Vector3(position[0], position[1], position[2])}
			userData={{
				velocity: [velocity[0] + randomNoiseX, velocity[1] + randomNoiseY, velocity[2]],
				position,
				below: false,
			}}
			ref={ref}
		>
			<sphereGeometry args={size} />
			<meshStandardMaterial color="magenta" />
		</mesh>
	);
}
export default Sphere;

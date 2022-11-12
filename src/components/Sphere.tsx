import { useEffect, useRef, useState } from "react";
import { SphereBufferGeometryProps, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { randn_bm } from "../utils/convenience";
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
	onCollision?: (sphere?: SphereProps) => void;
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
	onCollision,
	...props
}: SphereProps) {
	const randomNoiseX = randn_bm(0, noise / 100);
	const randomNoiseY = randn_bm(0, noise / 100);
	const ref = useRef<Mesh>(null);
	console.log(ref?.current?.userData.velocity);

	useFrame((state, delta) => {
		if (!ref.current) return;
		if (paused) {
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
		const [dx, dy, dz] = [(vx + dvx) * delta, (vy + dvy) * delta, (vz + dvz) * delta];
		const radius = size[0] || 1;
		const hitLeft = x + dx - radius < wall[0] && vx + dvx < 0;
		const hitRight = x + dx + radius > wall[1] && vx + dvx > 0;
		const hitBottom = y + dy - radius < 0 && vy + dvy < 0;
		if (hitLeft || hitRight || hitBottom) {
			if (hitBottom) {
				ref.current.userData.velocity = [vx + dvx, -1 * (vy + dvy) * restitution, vz + dvz];

				ref.current.position.set(x + dx, y, z + dz);
				ref.current.userData.position = [x + dx, y, z + dz];
			}
			if (hitLeft) {
				const newVx = -1 * (vx + dvx) * restitution;
				ref.current.userData.velocity = [newVx, vy + dvy, vz + dvz];

				const dt1 = (wall[0] - x + radius) / (vx + dvx);
				const dt2 = delta - dt1;
				const dx2 = newVx * dt2 + radius;

				ref.current.position.set(wall[0] + dx2, y + dy, z + dz);
				ref.current.userData.position = [wall[0] + dx2, y + dy, z + dz];
				return;
			} else if (hitRight) {
				const newVx = -1 * (vx + dvx) * restitution;
				ref.current.userData.velocity = [newVx, vy + dvy, vz + dvz];

				const dt1 = (wall[1] - radius - x) / (vx + dvx);
				const dt2 = delta - dt1;
				const dx2 = newVx * dt2 + radius;

				ref.current.position.set(wall[1] - dx2, y + dy, z + dz);
				ref.current.userData.position = [wall[1] - dx2, y + dy, z + dz];
			}
		} else {
			ref.current.userData.velocity = [vx + dvx, vy + dvy, vz + dvz];
			ref.current.position.set(x + dx, y + dy, z + dz);
			ref.current.userData.position = [x + dx, y + dy, z + dz];
		}
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

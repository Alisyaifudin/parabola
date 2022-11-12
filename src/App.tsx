import React, { useMemo, useRef, useState } from "react";
import { BoxGeometryProps, Canvas, useFrame, useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

import Box from "./components/Box";
import Plane from "./components/Plane";
import { Physics } from "@react-three/cannon";
import Sphere from "./components/Sphere";
import Slider from "./components/Slider";
import Cone from "./components/Cone";
import Clock from "./components/Clock";

// const initial = {
// 	ball: { position: [5, 4, 0], velocity: [-5, 5, 0] },
// };

function App() {
	const [paused, setPaused] = useState(true);
	const [power, setPower] = useState(10);
	const [angle, setAngle] = useState(45);
	const [horizontal, setHorizontal] = useState(5);
	const [vertical, setVertical] = useState(4);
	const [target, setTarget] = useState(7);
	const [isGraph, setIsGraph] = useState(false);
	const [airResistance, setAirResistance] = useState<number | "">(10);
	const [restitution, setRestitution] = useState<number | "">(80);
	const [noise, setNoise] = useState<number | "">(50);
	const ball = {
		position: [horizontal, vertical, 0],
		velocity: [
			-(power + 1) * Math.cos((angle * Math.PI) / 180),
			(power + 1) * Math.sin((angle * Math.PI) / 180),
			0,
		],
	};
	const handleSelect = (option: "graph" | "experiment") => () => {
		setIsGraph(option === "graph");
	};
	const start = () => {
		setPaused(false);
	};
	const reset = () => {
		setPaused(true);
	};
	const handlePowerChange = (value: number) => setPower(value / 10);
	const handleAngleChange = (value: number) => setAngle(value);
	const handleHorizontalChange = (value: number) => setHorizontal(value);
	const handleVerticalChange = (value: number) => setVertical(value);
	const handleTargetChange = (value: number) => setTarget(value);
	const handleAirResistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			setAirResistance("");
			return;
		}
		const value = Number(e.target.value);
		if (value < 0 || value > 100) return;
		setAirResistance(value);
	};
	const handleRestitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			setRestitution("");
			return;
		}
		const value = Number(e.target.value);
		if (value < 0 || value > 100) return;
		setRestitution(value);
	};
	const handleNoiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			setNoise("");
			return;
		}
		const value = Number(e.target.value);
		if (value < 0 || value > 100) return;
		setNoise(value);
	};
	return (
		<div>
			<div className="max-w-xs mx-auto flex justify-around items-center h-[10vh]">
				<button
					onClick={handleSelect("experiment")}
					className={`rounded-md p-2 ${
						isGraph ? "bg-blue-300 text-black/50" : "bg-blue-500  text-white"
					}`}
				>
					Experiment
				</button>
				<button
					onClick={handleSelect("graph")}
					className={`rounded-md p-2 ${
						!isGraph ? "bg-blue-300 text-black/50" : "bg-blue-500  text-white"
					}`}
				>
					Graph
				</button>
			</div>
			{isGraph ? (
				<div className="w-full h-[70vh]">
					<Canvas camera={{ position: [0, 1, 5], rotation: [0, 0, 0] }}>
						<ambientLight />
						<pointLight position={[10, 10, 10]} />
						<Box position={[2, 1, 0]} />
					</Canvas>
				</div>
			) : (
				<div className="w-full h-[70vh]">
					<Canvas
						orthographic
						camera={{
							rotation: [0, 0, 0],
							position: [0, 5, 10],
							zoom: 50,
							left: -1,
							right: 1,
							bottom: -1,
							top: 1,
						}}
					>
						<ambientLight />
						<directionalLight position={[0, 10, 0]} intensity={1.5} />
						<Sphere
							paused={paused}
							size={[0.3, 50, 50]}
							position={ball.position}
							velocity={ball.velocity}
							noise={noise !== "" ? noise : 0}
							restitution={restitution !== "" ? restitution / 100  : 0}
							wall={[-5, 13.5]}
							airResistance={airResistance !== "" ? airResistance / 100 : 0}
						/>
						<Box position={[-30, -0.5, 0]} size={[50, 1, 1]} color="whitesmoke" />
						<Box position={[0, -0.5, 0]} size={[10, 1, 1]} color="black" />
						<Box position={[30, -0.5, 0]} size={[50, 1, 1]} color="whitesmoke" />
						<Box position={[-5.5, 15, 0]} size={[1, 30, 1]} color="whitesmoke" />
						<Box position={[14, 15, 0]} size={[1, 30, 1]} color="whitesmoke" />
						<Box position={[-5.5, target, 0]} size={[1, 0.3, 1]} color="red" />
						{paused && (
							<Cone
								position={[
									ball.position[0] - (1 + power / 30) * Math.cos((angle * Math.PI) / 180),
									ball.position[1] + (1 + power / 30) * Math.sin((angle * Math.PI) / 180),
									-1,
								]}
								rotation={[0, 0, (-angle * Math.PI) / 180 + Math.PI / 2]}
								scale={power / 30 + 1}
							/>
						)}
					</Canvas>
				</div>
			)}
			<div className="outline h-[18vh] m-1 rounded-md p-2 flex gap-2 items-start flex-wrap">
				<button className="bg-blue-500 text-white p-1 rounded-md active:shadow-lg" onClick={start}>
					Start
				</button>
				<button className="bg-blue-500 text-white p-1 rounded-md active:shadow-lg" onClick={reset}>
					Reset
				</button>
				<div className="flex flex-col gap-2 w-72">
					<label htmlFor="power">Power</label>
					<Slider
						disabled={!paused}
						min={0}
						name="power"
						max={300}
						value={power * 10}
						onChange={handlePowerChange}
					/>
				</div>
				<div className="flex flex-col gap-2 w-72">
					<label htmlFor="angle">Elevation Angle</label>
					<Slider
						disabled={!paused}
						min={-90}
						name="angle"
						max={90}
						value={angle}
						onChange={handleAngleChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="horizontal">Horizontal Distance</label>
					<Slider
						min={-4.5}
						disabled={!paused}
						name="horizontal"
						max={10}
						value={horizontal}
						onChange={handleHorizontalChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="height">Height</label>
					<Slider
						disabled={!paused}
						name="height"
						min={1}
						max={10}
						value={vertical}
						onChange={handleVerticalChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="target">Target</label>
					<Slider
						disabled={!paused}
						name="target"
						min={1}
						max={10}
						value={target}
						onChange={handleTargetChange}
					/>
				</div>
				<div className="flex flex-col gap-2 items-center">
					<label htmlFor="restitution">Restitution coefficient %</label>
					<input
						disabled={!paused}
						name="restitution"
						value={restitution}
						onChange={handleRestitutionChange}
						type="number"
						className="outline rounded-md py-1 px-2 w-16 disabled:opacity-50"
					/>
				</div>
				<div className="flex flex-col items-center gap-2">
					<label htmlFor="airresistance">Air Resistance %</label>
					<input
						disabled={!paused}
						name="airresistance"
						value={airResistance}
						onChange={handleAirResistanceChange}
						type="number"
						className="outline rounded-md py-1 px-2 w-16 disabled:opacity-50"
					/>
				</div>
				<div className="flex flex-col items-center gap-2">
					<label htmlFor="noise">Noise %</label>
					<input
						disabled={!paused}
						name="noise"
						value={noise}
						onChange={handleNoiseChange}
						type="number"
						className="outline rounded-md py-1 px-2 w-16 disabled:opacity-50"
					/>
				</div>
			</div>
		</div>
	);
}

export default App;

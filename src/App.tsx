import React, { useRef, useState } from "react";
import { BoxGeometryProps, Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import Box from "./components/Box";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="w-full h-[80vh]">
			<Canvas>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
			</Canvas>
      <div className="outline h-[18vh] m-1 rounded-md">
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
		</div>
	);
}

export default App;

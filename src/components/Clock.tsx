import React from "react";

function Clock() {
	const [time, setTime] = React.useState(0);
	React.useEffect(() => {
		const interval = setInterval(() => {
			setTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<div>
			<p className="text-3xl">{time}</p>
		</div>
	);
}

export default Clock;

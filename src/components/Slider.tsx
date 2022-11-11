interface SliderProps {
	min?: number;
	max?: number;
	value: number;
	onChange: (value: number) => void;
	name?: string;
	disabled?: boolean;
}

const Slider = ({ min = 1, max = 100, value, onChange, name, disabled }: SliderProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(Number(e.target.value));
	};
	return (
		<div className="w-full">
			<input
				disabled={disabled}
				name={name}
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={handleChange}
				className="w-full"
			/>
		</div>
	);
};

export default Slider;

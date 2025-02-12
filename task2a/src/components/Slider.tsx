import { FC, PropsWithChildren } from 'react';

type TSliderProps = {
	label: string;
	unit?: string;
	minRange: string;
	maxRange: string;
	value: number;
	setValue: (value: number) => void;
};

const Slider: FC<PropsWithChildren<TSliderProps>> = ({
	label,
	value,
	minRange,
	maxRange,
	unit,
	setValue,
}) => {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-gray-700">{label}</label>
			<input
				type="range"
				min={minRange}
				max={maxRange}
				value={value}
				onChange={(e) => setValue(parseInt(e.target.value))}
				className="w-full cursor-grabbing"
			/>
			<div className="flex justify-between text-sm text-gray-600">
				<span>
					{minRange}
					{unit}
				</span>
				<span className="font-medium">
					{value}
					{unit}
				</span>
				<span>
					{maxRange}
					{unit}
				</span>
			</div>
		</div>
	);
};

export default Slider;

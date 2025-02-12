import { FC, PropsWithChildren, useMemo } from 'react';
import {
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Scatter,
	ComposedChart,
	ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

type TConcurrencyAnalysisProps = {
	chargePoints: number;
};

const generateConcurrencyData = () => {
	// should be between 35-55% as per the requirements
	return Array.from({ length: 30 }, (_, i) => {
		const chargepoints = i + 1;
		// Add some random variation but keep within expected range
		const baseRate = 45; // Center of 35-55 range
		const variation = Math.sin(chargepoints * 0.2) * 10;
		const random = (Math.random() - 0.5) * 5;
		const factor = baseRate + variation + random;

		return {
			chargepoints: chargepoints,
			factor: Math.min(Math.max(factor, 35), 55), // Clamp between 35-55
		};
	});
};

const ConcurrencyAnalysis: FC<PropsWithChildren<TConcurrencyAnalysisProps>> = ({
	chargePoints,
}) => {
	const concurrencyData = useMemo(() => {
		if (chargePoints) {
			return generateConcurrencyData();
		}
	}, [chargePoints]);

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
			<div className="p-4 border-b border-gray-200">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<TrendingUp className="w-5 h-5" />
					Concurrency Factor Analysis
				</h2>
				<p className="text-sm text-gray-600 mt-1">
					How the concurrency factor changes with number of charging points
				</p>
			</div>
			<div className="p-4">
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<ComposedChart data={concurrencyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="chargepoints"
								label={{
									value: 'Number of Charging Points',
									position: 'bottom',
									offset: -5,
								}}
							/>
							<YAxis
								domain={[30, 60]}
								label={{
									value: 'Concurrency Factor (%)',
									angle: -90,
									position: 'insideLeft',
									offset: 10,
								}}
							/>
							<Tooltip
								formatter={(value) => [`${value}%`, 'Concurrency Factor']}
								labelFormatter={(value) => `${value} Charging Points`}
							/>
							<Line
								type="monotone"
								dataKey="factor"
								stroke="#3b82f6"
								strokeWidth={2}
								dot={false}
							/>
							{/* Reference lines for expected range */}
							<ReferenceLine y={35} stroke="#cbd5e1" strokeDasharray="3 3" />
							<ReferenceLine y={55} stroke="#cbd5e1" strokeDasharray="3 3" />
							{/* Scatter points for actual values */}
							<Scatter
								dataKey="factor"
								fill="#3b82f6"
								name="Concurrency Factor"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default ConcurrencyAnalysis;

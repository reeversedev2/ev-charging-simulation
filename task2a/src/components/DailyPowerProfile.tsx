import { Zap } from 'lucide-react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const generateMockDailyData = () => {
	return Array.from({ length: 24 }, (_, hour) => {
		const baseLoad = 20 + Math.sin((hour * Math.PI) / 12) * 15;
		const randomVariation = Math.random() * 10;
		return {
			hour: `${hour.toString().padStart(2, '0')}:00`,
			power: Math.max(0, Math.min(baseLoad + randomVariation, 100)),
			efficiency: Math.random() * 30 + 60,
		};
	});
};

const DailyPowerProfile = () => {
	const mockDailyData = generateMockDailyData();

	return (
		<div
			className="bg-white rounded-lg shadow-sm border border-gray-200 w-full"
			data-testid="daily-power-profile"
		>
			<div className="p-4 border-b border-gray-200">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<Zap className="w-5 h-5" /> Daily Power Profile
				</h2>
			</div>
			<div className="p-4">
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={mockDailyData}>
							<defs>
								<linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="hour" />
							<YAxis yAxisId="left" />
							<YAxis yAxisId="right" orientation="right" />
							<Tooltip />
							<Legend />
							<Area
								yAxisId="left"
								type="monotone"
								dataKey="power"
								stroke="#3b82f6"
								fill="url(#powerGradient)"
								name="Power (kW)"
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="efficiency"
								stroke="#10b981"
								name="Efficiency (%)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default DailyPowerProfile;

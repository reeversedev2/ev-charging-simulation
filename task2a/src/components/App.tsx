import { useMemo, useState } from 'react';
import { ArrowUp, Equal, PersonStanding, Settings, Zap } from 'lucide-react';
import ConcurrencyAnalysis from './ConcurrencyAnalysis';
import DailyPowerProfile from './DailyPowerProfile';
import Slider from './Slider';
import Card from './Card';

const EVChargingMockup = () => {
	const [params, setParams] = useState({
		chargePoints: 20,
		arrivalRate: 100,
		consumption: 18,
		chargePower: 11,
	});

	const generateDayData = useMemo(() => {
		return Array.from({ length: 96 }, (_, i) => {
			const hour = Math.floor(i / 4);
			const minute = (i % 4) * 15;
			const time = `${hour.toString().padStart(2, '0')}:${minute
				.toString()
				.padStart(2, '0')}`;

			// Base occupancy pattern
			let baseOccupancy;
			if (hour >= 7 && hour <= 9) {
				// Morning peak
				baseOccupancy = 0.8;
			} else if (hour >= 12 && hour <= 14) {
				// Lunch peak
				baseOccupancy = 0.7;
			} else if (hour >= 17 && hour <= 19) {
				// Evening peak
				baseOccupancy = 0.9;
			} else if (hour >= 23 || hour <= 5) {
				// Night
				baseOccupancy = 0.2;
			} else {
				// Normal hours
				baseOccupancy = 0.5;
			}

			// Adjust based on arrival rate
			baseOccupancy *= params.arrivalRate / 100;

			// Add randomness
			const occupancy = Math.min(
				1,
				Math.max(0, baseOccupancy + (Math.random() - 0.5) * 0.2)
			);

			// Calculate metrics based on parameters
			const activeChargers = Math.round(occupancy * params.chargePoints);
			const power =
				activeChargers * params.chargePower * (0.8 + Math.random() * 0.2);
			const energyDelivered = power * 0.25; // 15-min interval

			return {
				time,
				hour,
				minute,
				occupancy: Math.round(occupancy * 100),
				power: Math.round(power),
				activeChargers,
				maxPower: params.chargePoints * params.chargePower,
				energyDelivered,
				waitingVehicles:
					hour >= 7 && hour <= 19
						? Math.floor(Math.random() * Math.max(0, (occupancy - 0.8) * 10))
						: 0,
			};
		});
	}, [params]);

	const stats = useMemo(() => {
		const totalEnergy = generateDayData.reduce(
			(sum, d) => sum + d.energyDelivered,
			0
		);
		const peakPower = Math.max(...generateDayData.map((d) => d.power));
		const avgOccupancy =
			generateDayData.reduce((sum, d) => sum + d.occupancy, 0) /
			generateDayData.length;

		return {
			totalEnergy: Math.round(totalEnergy),
			peakPower: Math.round(peakPower),
			avgOccupancy: Math.round(avgOccupancy),
			theoreticalMax: params.chargePoints * params.chargePower,
			concurrencyFactor: Math.round(
				(peakPower / (params.chargePoints * params.chargePower)) * 100
			),
		};
	}, [generateDayData, params]);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-900">
						EV Charging Station Dashboard
					</h1>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-4 border-b border-gray-200">
						<h2 className="flex items-center gap-2 text-lg font-semibold">
							<Settings className="w-5 h-5" />
							Configuration
						</h2>
					</div>
					<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Slider
							label="Number of Charge Points"
							minRange="5"
							maxRange="50"
							value={params.chargePoints}
							setValue={(value) =>
								setParams((p) => ({
									...p,
									chargePoints: value,
								}))
							}
						/>

						<Slider
							label="Arrival Rate Multiplier"
							minRange="20"
							maxRange="200"
							value={params.arrivalRate}
							setValue={(value) =>
								setParams((p) => ({
									...p,
									arrivalRate: value,
								}))
							}
							unit="%"
						/>
						<Slider
							label="Vehicle Consumption (kWh/100km)"
							minRange="10"
							maxRange="30"
							value={params.consumption}
							setValue={(value) =>
								setParams((p) => ({
									...p,
									consumption: value,
								}))
							}
						/>
						<Slider
							unit="kW"
							label="Charging Power (kW)"
							minRange="3"
							maxRange="50"
							setValue={(value) =>
								setParams((p) => ({
									...p,
									chargePower: value,
								}))
							}
							value={params.chargePower}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card stats={stats.peakPower}>
						<Zap />
						Peak Power
					</Card>
					<Card stats={stats.avgOccupancy}>
						<PersonStanding />
						Avg. Occupancy
					</Card>
					<Card stats={stats.theoreticalMax}>
						<ArrowUp /> Theoretical Max Power
					</Card>
					<Card stats={stats.totalEnergy}>
						<Equal />
						Total Energy Delivered
					</Card>
				</div>
				<div className="flex flex-wrap justify-between gap-4">
					<DailyPowerProfile />
					<ConcurrencyAnalysis chargePoints={params.chargePoints} />
				</div>
			</div>
		</div>
	);
};

export default EVChargingMockup;

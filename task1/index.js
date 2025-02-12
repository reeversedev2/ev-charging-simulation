class ChargingEvent {
	constructor(startTime, durationIntervals, powerKw) {
		this.startTime = startTime;
		this.durationIntervals = durationIntervals;
		this.powerKw = powerKw;
	}
}

class ChargingPoint {
	constructor(powerKw = 11.0) {
		this.powerKw = powerKw;
		this.currentEvent = null; // Currently active charging event
		this.powerDemandHistory = []; // Historical power demand data
	}

	isAvailable() {
		return this.currentEvent === null;
	}

	startCharging(event) {
		this.currentEvent = event;
	}

	update(currentTime) {
		if (!this.currentEvent) {
			return 0.0;
		}

		// Check if the current charging event has finished
		if (
			currentTime >=
			this.currentEvent.startTime + this.currentEvent.durationIntervals
		) {
			this.currentEvent = null;
			return 0.0;
		}

		return this.currentEvent.powerKw;
	}
}

class ChargingSimulation {
	constructor(
		numChargepoints = 20,
		chargepointPowerKw = 11.0,
		evConsumptionKwhPer100km = 18.0
	) {
		this.numChargepoints = numChargepoints;
		this.chargepointPowerKw = chargepointPowerKw;
		this.evConsumptionKwhPer100km = evConsumptionKwhPer100km;

		// Create array of charging points
		this.chargepoints = Array.from(
			{ length: numChargepoints },
			() => new ChargingPoint(chargepointPowerKw)
		);

		// Probability of EV arrival for each hour of the day (00:00-23:00)
		this.arrivalProbs = {
			0: 0.0094,
			1: 0.0094,
			2: 0.0094,
			3: 0.0094,
			4: 0.0094,
			5: 0.0094,
			6: 0.0094,
			7: 0.0094,
			8: 0.0283,
			9: 0.0283,
			10: 0.0566,
			11: 0.0566,
			12: 0.0566,
			13: 0.0755,
			14: 0.0755,
			15: 0.0755,
			16: 0.1038,
			17: 0.1038,
			18: 0.1038,
			19: 0.0472,
			20: 0.0472,
			21: 0.0472,
			22: 0.0094,
			23: 0.0094,
		};

		// Probability distribution of charging demands in kilometers
		this.demandProbs = {
			0: 0.3431,
			5: 0.049,
			10: 0.098,
			20: 0.1176,
			30: 0.0882,
			50: 0.1176,
			100: 0.1078,
			200: 0.049,
			300: 0.0294,
		};

		// Initialize tracking variables
		this.totalEnergyConsumed = 0.0;
		this.maxPowerDemand = 0.0;
		this.powerDemandHistory = [];
	}

	getRandomChargingDemandKm() {
		const rand = Math.random();
		let cumulative = 0;
		// Use cumulative probability to select a demand value
		for (const [km, prob] of Object.entries(this.demandProbs)) {
			cumulative += prob;
			if (rand <= cumulative) {
				return parseFloat(km);
			}
		}
		return 0;
	}

	getChargingDurationIntervals(distanceKm) {
		if (distanceKm === 0) {
			return 0;
		}
		// Calculate energy needed based on consumption rate
		const energyRequired = (distanceKm * this.evConsumptionKwhPer100km) / 100;
		// Calculate hours needed based on charging power
		const hoursRequired = energyRequired / this.chargepointPowerKw;
		// Convert hours to 15-minute intervals
		return Math.floor(hoursRequired * 4);
	}

	simulateYear() {
		const intervalsPerDay = 96; // 24 hours * 4 (15-minute intervals)
		const daysInYear = 365;
		const totalIntervals = intervalsPerDay * daysInYear;

		for (let interval = 0; interval < totalIntervals; interval++) {
			// Calculate current hour (00:00-23:00) from interval
			const hour = Math.floor((interval / 4) % 24);
			const arrivalProb = this.arrivalProbs[hour];

			// Process each charging point
			for (const chargepoint of this.chargepoints) {
				// Check for new EV arrival
				if (chargepoint.isAvailable() && Math.random() < arrivalProb) {
					const distance = this.getRandomChargingDemandKm();
					if (distance > 0) {
						const duration = this.getChargingDurationIntervals(distance);
						const event = new ChargingEvent(
							interval,
							duration,
							this.chargepointPowerKw
						);
						chargepoint.startCharging(event);
					}
				}
			}

			// Calculate total power demand for this interval
			const intervalPowerDemand = this.chargepoints.reduce(
				(sum, cp) => sum + cp.update(interval),
				0
			);
			this.powerDemandHistory.push(intervalPowerDemand);

			// Update maximum power demand if current demand is higher
			this.maxPowerDemand = Math.max(this.maxPowerDemand, intervalPowerDemand);

			// Add energy consumed in this 15-minute interval
			this.totalEnergyConsumed += intervalPowerDemand * 0.25; // 15 minutes = 0.25 hours
		}
	}

	getResults() {
		const theoreticalMax = this.numChargepoints * this.chargepointPowerKw;
		const concurrencyFactor =
			theoreticalMax > 0 ? this.maxPowerDemand / theoreticalMax : 0;

		return {
			totalEnergyConsumedKwh: Math.round(this.totalEnergyConsumed * 100) / 100,
			theoreticalMaxPowerKw: theoreticalMax,
			actualMaxPowerKw: Math.round(this.maxPowerDemand * 100) / 100,
			concurrencyFactor: Math.round(concurrencyFactor * 10000) / 100,
			powerDemandHistory: this.powerDemandHistory,
		};
	}

	getDailyPowerProfile(dayIndex) {
		const startInterval = dayIndex * 96;
		return this.powerDemandHistory.slice(startInterval, startInterval + 96);
	}
}

console.log('Starting simulation...');
console.time('Simulation');

const sim = new ChargingSimulation(20);
sim.simulateYear();
const results = sim.getResults();
const {
	totalEnergyConsumedKwh,
	theoreticalMaxPowerKw,
	actualMaxPowerKw,
	concurrencyFactor,
} = results;

console.timeEnd('Simulation');
console.log('\nSimulation Results:');
console.log(`Total Energy Consumed: ${totalEnergyConsumedKwh} kWh`);
console.log(`Theoretical Maximum Power: ${theoreticalMaxPowerKw} kW`);
console.log(`Actual Maximum Power: ${actualMaxPowerKw} kW`);
console.log(`Concurrency Factor: ${concurrencyFactor}%`);

console.log('\nConcurrency Factors for 1-30 chargepoints:');
const concurrencyFactors = [];
for (let n = 1; n <= 30; n++) {
	const sim = new ChargingSimulation(n);
	sim.simulateYear();
	const results = sim.getResults();
	const { concurrencyFactor } = results;
	concurrencyFactors.push(concurrencyFactor);
	console.log(`${n} chargepoints: ${concurrencyFactor}%`);
}

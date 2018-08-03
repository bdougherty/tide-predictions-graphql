import suncalc from 'suncalc';

export function getObservations({ lat, lon }, date = new Date()) {
	const sun = suncalc.getTimes(date, lat, lon);
	const moon = suncalc.getMoonTimes(date, lat, lon);
	const moonIllumination = suncalc.getMoonIllumination(moon.rise);

	const data = {
		date,
		lat,
		lon
	};

	return {
		...data,
		sun: {
			...data,
			...sun
		},
		moon: {
			...data,
			...moon,
			...moonIllumination
		}
	};
}

export function getSunPosition(time, lat, lon) {
	return {
		time,
		...suncalc.getPosition(time, lat, lon)
	};
}

export function getMoonPosition(time, lat, lon) {
	return {
		time,
		...suncalc.getMoonPosition(time, lat, lon)
	};
}

export function convertMoonPhase(phase) {
	if (phase > 0 && phase < 0.25) {
		return 'waxingCrescent';
	}

	if (phase === 0.25) {
		return 'firstQuarter';
	}

	if (phase > 0.25 && phase < 0.5) {
		return 'waxingGibbous';
	}

	if (phase === 0.5) {
		return 'full';
	}

	if (phase > 0.5 && phase < 0.75) {
		return 'waningGibbous';
	}

	if (phase === 0.75) {
		return 'lastQuarter';
	}

	if (phase > 0.75 && phase < 1) {
		return 'waningCrescent';
	}

	return 'new';
}

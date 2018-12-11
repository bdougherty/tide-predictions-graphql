import suncalc from 'suncalc';
import { Calendar } from 'astronomia/src/julian';
import { newMoon, first, full, last } from 'astronomia/src/moonphase';

const moonPhases = ['new', 'firstQuarter', 'full', 'lastQuarter'];

const moonFuncs = new Map([
	['new', newMoon],
	['firstQuarter', first],
	['full', full],
	['lastQuarter', last]
]);

export function getMoonTimes(date, lat, lon) {
	const times = suncalc.getMoonTimes(date, lat, lon);

	if (!times.rise || !times.set) {
		const nextDay = new Date(date);
		nextDay.setDate(nextDay.getDate() + 1);

		const nextDayTimes = suncalc.getMoonTimes(nextDay, lat, lon);

		if (!times.rise) {
			times.rise = nextDayTimes.rise;
		}

		if (!times.set) {
			times.set = nextDayTimes.set;
		}
	}

	return times;
}

export function getObservations({ lat, lon }, date = new Date()) {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	const sun = suncalc.getTimes(date, lat, lon);
	const moon = getMoonTimes(date, lat, lon);
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

export function getNextMoonPhase(date) {
	const cal = new Calendar(date);
	const year = cal.toYear();
	const jde = cal.toJDE();

	const phases = [...moonFuncs].map(([name, func]) => {
		return {
			phase: name,
			date: func(year)
		};
	});

	phases.sort((a, b) => a.date > b.date);
	return phases.find(({ date }) => date > jde);
}

export function getUpcomingMoonPhases(date, num = 4) {
	num = Math.max(num, 1);

	if (num > 99) {
		throw new Error('Can only look up a maximum of 99 moon phases.');
	}

	const nextPhase = getNextMoonPhase(date);
	const phases = [nextPhase];
	let phaseIndex = moonPhases.indexOf(nextPhase.phase);

	for (let i = 1; i < num; i++) {
		const previousPhase = phases[i - 1];
		const phase = moonPhases[++phaseIndex % moonPhases.length];
		const func = moonFuncs.get(phase);
		const previousJde = previousPhase.date;
		const year = new Calendar().fromJDE(previousJde).toYear();

		phases.push({
			phase,
			date: func(year)
		});
	}

	return phases.map(({ date: jde, phase }) => {
		const date = new Calendar().fromJDE(jde).toDate();
		return {
			time: date.valueOf() / 1000,
			phase
		};
	});
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

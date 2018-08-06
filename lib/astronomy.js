import got from 'got';
import suncalc from 'suncalc';
import * as tc from 'timezonecomplete';

const navyPhaseMap = new Map([
	['New Moon', 'new'],
	['First Quarter', 'firstQuarter'],
	['Full Moon', 'full'],
	['Last Quarter', 'lastQuarter']
]);

export function getObservations({ lat, lon }, date = new Date()) {
	if (typeof date === 'string') {
		date = new Date(date);
	}

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

export async function getUpcomingMoonPhases(date, num = 4) {
	num = Math.max(num, 1);

	if (num > 99) {
		throw new Error('Can only look up a maximum of 99 moon phases.');
	}

	const dateTime = new tc.DateTime(date.toISOString());

	const url = new URL('http://api.usno.navy.mil/moon/phase');
	url.searchParams.set('date', dateTime.format('MM/dd/yyyy'));
	url.searchParams.set('time', dateTime.format('HH:mm:ss'));
	url.searchParams.set('nump', num);

	const { body } = await got(url, {
		json: true
	});

	if (body.error === true) {
		return [];
	}

	return body.phasedata.map(({ phase, date, time }) => {
		const dateTime = new tc.DateTime(`${date} ${time} UTC`, 'YYYY MMM dd HH:mm');
		return {
			time: dateTime.valueOf() / 1000,
			phase: navyPhaseMap.get(phase)
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

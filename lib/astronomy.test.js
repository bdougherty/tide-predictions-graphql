import test from 'ava';
import {
	convertMoonPhase,
	getSunPosition,
	getMoonPosition,
	getMoonTimes,
	getObservations,
	getNextMoonPhase,
	getUpcomingMoonPhases
} from './astronomy';

test('getObservations', (t) => {
	const date = new Date();
	const observations = getObservations({ lat: 0, lon: 0 }, date);

	t.is(observations.lat, 0);
	t.is(observations.lon, 0);
	t.is(observations.date, date);

	t.true('sun' in observations);
	const { sun } = observations;
	t.is(sun.date, date);
	t.true('nightEnd' in sun);
	t.true('nauticalDawn' in sun);
	t.true('dawn' in sun);
	t.true('sunrise' in sun);
	t.true('solarNoon' in sun);
	t.true('sunset' in sun);
	t.true('dusk' in sun);
	t.true('nauticalDusk' in sun);
	t.true('night' in sun);

	t.true('moon' in observations);
	const { moon } = observations;
	t.is(moon.date, date);
	t.true('fraction' in moon);
	t.true('phase' in moon);
	t.true('rise' in moon);
	t.true('set' in moon);
});

test('getObservations with string date', (t) => {
	const observations = getObservations({ lat: 0, lon: 0 }, '2019-01-14T03:16:07Z');
	t.snapshot(observations);
});

test('getSunPosition', (t) => {
	const date = new Date();
	const position = getSunPosition(date, 0, 0);
	t.is(position.time, date);
	t.true('altitude' in position);
	t.true('azimuth' in position);
});

test('getMoonPosition', (t) => {
	const date = new Date();
	const position = getMoonPosition(date, 0, 0);
	t.is(position.time, date);
	t.true('altitude' in position);
	t.true('azimuth' in position);
});

test('getMoonTimes always returns a rise and set', (t) => {
	const date = new Date(2018, 8, 18, 0, 0, 0, 0);
	const lat = 39.3142827;
	const lon = -74.5248756;

	const times = getMoonTimes(date, lat, lon);

	t.true('rise' in times);
	t.true('set' in times);
});

test('getNextMoonPhase', (t) => {
	const date = new Date(2018, 12, 10, 0, 0, 0, 0);
	const nextPhase = getNextMoonPhase(date);

	t.is(nextPhase.phase, 'firstQuarter');
});

test('getUpcomingMoonPhases', (t) => {
	const date = new Date(2018, 12, 10, 0, 0, 0, 0);
	const phases = getUpcomingMoonPhases(date);

	t.is(phases.length, 4);
	t.snapshot(phases);
});

test('getUpcomingMoonPhases number of phases', (t) => {
	const date = new Date();
	const phases = getUpcomingMoonPhases(date, 5);

	t.is(phases.length, 5);
});

test('getUpcomingMoonPhases too many phases', (t) => {
	const date = new Date();
	t.throws(() => getUpcomingMoonPhases(date, 100));
});

function moonPhase(t, input, expected) {
	t.is(convertMoonPhase(input), expected);
}

moonPhase.title = (providedTitle, input, expected) => `${input} is ${expected}`;

test(moonPhase, 0, 'new');
test(moonPhase, 0.01, 'waxingCrescent');
test(moonPhase, 0.1, 'waxingCrescent');
test(moonPhase, 0.24, 'waxingCrescent');
test(moonPhase, 0.25, 'firstQuarter');
test(moonPhase, 0.26, 'waxingGibbous');
test(moonPhase, 0.49, 'waxingGibbous');
test(moonPhase, 0.5, 'full');
test(moonPhase, 0.51, 'waningGibbous');
test(moonPhase, 0.6, 'waningGibbous');
test(moonPhase, 0.74, 'waningGibbous');
test(moonPhase, 0.75, 'lastQuarter');
test(moonPhase, 0.76, 'waningCrescent');
test(moonPhase, 0.8, 'waningCrescent');
test(moonPhase, 0.99, 'waningCrescent');
test(moonPhase, 1, 'new');

import { join } from 'path';
import test from 'ava';
import nock from 'nock';
import {
	NOAAWaterTemperatureStation,
	USGSWaterTemperatureStation
} from '../models/water-temperature-station';
import {
	convertCelsiusToFahrenheit,
	truncateFloat,
	getWaterTemperature
} from './water-temperature';

test('converts celsius to fahrenheit properly', (t) => {
	t.is(convertCelsiusToFahrenheit(100), 212);
	t.is(convertCelsiusToFahrenheit(0), 32);
	t.is(convertCelsiusToFahrenheit(-40), -40);
});

test('truncates floats properly', (t) => {
	t.is(truncateFloat(1.123456789), 1.1234568);
	t.is(truncateFloat(1.123456789, 2), 1.12);
	t.is(truncateFloat(1.12345), 1.12345);
	t.is(truncateFloat(1.12345, 10), 1.12345);
});

test('get invalid temperature site', async (t) => {
	await t.throwsAsync(() => getWaterTemperature('INVALID:0'), TypeError);
});

test('get usgs temperature site', async (t) => {
	const stationId = '01411330';
	const id = `USGS:${stationId}`;
	const fixture = join(__dirname, '..', 'fixtures', `usgs-waterservices-${stationId}.json`);

	nock('https://waterservices.usgs.gov')
		.get('/nwis/iv/')
		.query((query) => query.sites === stationId)
		.replyWithFile(200, fixture, {
			'Content-Type': 'application/json'
		});

	const station = await getWaterTemperature(id);
	t.true(station instanceof USGSWaterTemperatureStation);
	t.is(station.id, id);
});

test('get noaa temperature site', async (t) => {
	const stationId = '8534720';
	const id = `NOAA:${stationId}`;
	const fixture = join(__dirname, '..', 'fixtures', `noaa-water-${stationId}.json`);

	nock('https://tidesandcurrents.noaa.gov')
		.get('/api/datagetter')
		.query((query) => query.station === stationId)
		.replyWithFile(200, fixture, {
			// Emulate the incorrect content type
			'Content-Type': 'text/html;charset=ISO-8859-1'
		});

	const station = await getWaterTemperature(id);
	t.true(station instanceof NOAAWaterTemperatureStation);
	t.is(station.id, id);
});

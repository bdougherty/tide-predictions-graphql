import { URL } from 'url';
import distance from '@turf/distance';
import fetch from 'node-fetch';
import geoTz from 'geo-tz';
import moment from 'moment-timezone';
import stateNamesToAbbreviations from 'datasets-us-states-names-abbr';
import titleCase from 'better-title-case';

const replacements = new Map([
	['@', 'at'],
	['b.', 'Beach'],
	['br.', 'Branch'],
	['brdg.', 'Bridge'],
	['brg.', 'Bridge'],
	['cg', 'Coast Guard'],
	['cgs', 'Coast Guard Station'],
	['ch.', 'Channel'],
	['ches.', 'Chesapeake'],
	['ck.', 'Creek'],
	['ck', 'Creek'],
	['cr.', 'Creek'],
	['cr', 'Creek'],
	['d.c.', 'DC'],
	['del.', 'Delaware'],
	['e.', 'East'],
	['ent.', 'Entrance'],
	['entr.', 'Entrance'],
	['gr.', 'Great'],
	['hbr.', 'Harbor'],
	['hbr', 'Harbor'],
	['hvn', 'Haven'],
	['hwy.', 'Highway'],
	['i.', 'Inlet'],
	['inelt', 'Inlet'],
	['is.', 'Island'],
	['is', 'Island'],
	['j.f.k.', 'JFK'],
	['ldg.', 'Landing'],
	['li', 'Little'],
	['lt.', 'Light'],
	['mi.', 'mi'],
	['mt.', 'Mount'],
	['n.', 'North'],
	['n.e.', 'Northeast'],
	['n.mi.', 'nmi'],
	['n.w.', 'Northwest'],
	['nm', 'nmi'],
	['oreg.', 'Oregon'],
	['p.g.', 'Proving Ground'],
	['plant.', 'Plantation'],
	['pr', 'Prince'],
	['pt.', 'Point'],
	['pt', 'Point'],
	['r.', 'River'],
	['r', 'River'],
	['riv', 'River'],
	['rkun', 'Run'],
	['rr.', 'Railroad'],
	['rr', 'Railroad'],
	['s.', 'South'],
	['s.e.', 'Southeast'],
	['s.f.', 'San Francisco'],
	['s.f.bay', 'San Francisco Bay'],
	['s.w.', 'Southwest'],
	['sd', 'Sound'],
	['sl.', 'Slough'],
	['snd.', 'Sound'],
	['snd', 'Sound'],
	['st.', 'Street'],
	['sta.', 'Station'],
	['u.s.', 'US'],
	['uscg', 'USCG'],
	['v.', 'Vineyard'],
	['w.', 'West'],
	['wash.', 'Washington'],
	['wil', 'William'],
	['y.c.', 'Yacht Club']
]);

// Add variations of state abbreviations to the list
// p.a., pa. -> Pennsylvania
Object.keys(stateNamesToAbbreviations).forEach((state) => {
	const [firstLetter, secondLetter] = [...stateNamesToAbbreviations[state].toLowerCase()];
	const combinations = [
		`${firstLetter}${secondLetter}.`,
		`${firstLetter}.${secondLetter}.`
	];

	for (const combination of combinations) {
		if (!replacements.has(combination)) {
			replacements.set(combination, state);
		}
	}
});

export function calculateDistance([lat1, lon1], [lat2, lon2], units = 'miles') {
	const fromPoint = [
		parseFloat(lon1),
		parseFloat(lat1)
	];

	const toPoint = [
		parseFloat(lon2),
		parseFloat(lat2)
	];

	return distance(fromPoint, toPoint, { units });
}

export async function fetchPredictionsForTideStation(station, { days = 2, datum = 'MLLW', units = 'english', appName = process.env.APPLICATION }) {
	const url = new URL('https://tidesandcurrents.noaa.gov/api/datagetter');
	url.searchParams.set('station', station.stationId);
	url.searchParams.set('begin_date', moment().subtract(1, 'day').format('YYYYMMDD'));
	url.searchParams.set('range', 24 * (days + 2));
	url.searchParams.set('product', 'predictions');
	url.searchParams.set('application', appName);
	url.searchParams.set('datum', datum);
	url.searchParams.set('time_zone', 'lst_ldt');
	url.searchParams.set('units', units);
	url.searchParams.set('interval', 'hilo');
	url.searchParams.set('format', 'json');

	const response = await fetch(`${url}`);
	const json = await response.json();

	const lat = parseFloat(station.lat);
	const lon = parseFloat(station.lon);
	const tz = geoTz(lat, lon);

	return json.predictions.map((prediction) => {
		prediction.tz = tz;
		return prediction;
	});
}

export async function fetchTideStations() {
	const response = await fetch('https://tidesandcurrents.noaa.gov/mdapi/v0.6/webapi/tidepredstations.json');
	const json = await response.json();
	return new Map(json.stationList.map((station) => [station.stationId, station]));
}

export function formatTideStationName(name) {
	const normalized = `${name}`
		.trim()

		// Remove trailing comma
		.replace(/,$/, '')

		// Fix commas without a space after
		.replace(/,(?!\s)/g, ', ')

		// Remove periods from state names at the end
		.replace(/\s(\w)\.?(\w)\.$/, (_, first, second) => ` ${first}${second}`.toUpperCase())

		// Fix abbreviations without a space after
		.replace(/(\w{2,}\.)(?![\s,)])/g, '$1 ')

		// Fix some random things that are wrong
		.replace(/S\. F\./i, 'S.F.')
		.replace(/HIX BR\./i, 'HIX BRG.')
		.replace(/HWY\. BR\./i, 'HWY. BRG.')
		.replace(/U\.S\. Hwy\./i, 'U.S.')
		.replace(/DEOT/i, 'DEPOT)')

		// Proper apostrophes
		.replace(/(\S)'(\S)/g, '$1’$2');

	return titleCase(normalized).split(/\s+/).map((word, index, array) => {
		const prefix = word.replace(/^([^\w.@]+)?.*/, '$1');
		const suffix = word.replace(/.*?([^\w.@]+)?$/, '$1');
		const lowerCaseWord = word.replace(/[^\w.@]/g, '').toLowerCase();

		// Replace abbreviations and other single-word mistakes
		if (replacements.has(lowerCaseWord)) {
			word = `${prefix}${replacements.get(lowerCaseWord)}${suffix}`;
		}

		// Replace state names with abbreviations if it's the last word
		if (index === array.length - 1 && word in stateNamesToAbbreviations) {
			word = stateNamesToAbbreviations[word];
		}

		return word;
	}).join(' ');
}

export function formatTimeZone([lat, lon], format) {
	const zoneName = geoTz(parseFloat(lat), parseFloat(lon));

	switch (format) {
		case 'abbr':
			return moment.tz(zoneName).zoneAbbr();

		case 'offset':
			return moment.tz(zoneName).format('Z');

		default:
			return zoneName;
	}
}

export function getStationsByDistance(stations, { lat, lon }) {
	const stationsWithDistances = [...stations.values()].map((station) => ({
		...station,
		distance: calculateDistance([lat, lon], [station.lat, station.lon])
	}));

	stationsWithDistances.sort((a, b) => a.distance - b.distance);

	return stationsWithDistances;
}
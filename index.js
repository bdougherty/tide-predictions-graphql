const { URL } = require('url');
const { readFileSync } = require('fs');
const { get, post, router } = require('microrouter');
const { microGraphiql, microGraphql } = require('apollo-server-micro');
const { makeExecutableSchema } = require('graphql-tools');
const { toLaxTitleCase: titleCase } = require('titlecase');
const micro = require('micro');
const compress = require('micro-compress');
const microCors = require('micro-cors');
const distance = require('@turf/distance');
const fetch = require('node-fetch');
const geoTz = require('geo-tz');
const moment = require('moment-timezone');

const appName = process.env.APPLICATION;
const ONE_DAY = 1000 * 60 * 60 * 24;

if (!appName) {
	throw new Error('Please set your application name in the `APPLICATION` environment variable.');
}

let tideStations = new Map();

async function fetchTideStations() {
	const response = await fetch('https://tidesandcurrents.noaa.gov/mdapi/v0.6/webapi/tidepredstations.json');
	const json = await response.json();
	tideStations = new Map(json.stationList.map((station) => [station.stationId, station]));
}

async function fetchPredictionsForTideStation(station, { days = 2, datum = 'MLLW', units = 'english' }) {
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
	return json;
}

function formatTideStationName(name) {
	return titleCase(`${name}`.toLowerCase().replace(/(\w\.\w\.)/, (s) => s.toUpperCase()));
}

function calculateDistance([lat1, lon1], [lat2, lon2], units = 'miles') {
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

const resolvers = {
	Query: {
		station: (obj, { id }) => tideStations.get(id),
		stations: (obj, { near, limit }) => {
			if (!near) {
				return tideStations;
			}

			const stationsWithDistances = [...tideStations.values()].map((station) => ({
				...station,
				distance: calculateDistance([near.lat, near.lon], [station.lat, station.lon])
			}));

			stationsWithDistances.sort((a, b) => a.distance - b.distance);
			return stationsWithDistances.slice(0, limit);
		}
	},
	StationType: {
		harmonic: 'R',
		subordinate: 'S'
	},
	PredictionType: {
		high: 'H',
		low: 'L'
	},
	PredictionUnit: {
		ft: 'english',
		m: 'metric'
	},
	DistanceUnit: {
		mi: 'miles',
		km: 'kilometers'
	},
	TideStation: {
		id: (station) => station.stationId,
		name: (station) => formatTideStationName(station.etidesStnName),
		commonName: (station) => formatTideStationName(station.commonName),
		type: (station) => station.stationType,
		distance: (station, { from, units }) => {
			const fromPoint = [station.lat, station.lon];
			const toPoint = [from.lat, from.lon];

			return calculateDistance(fromPoint, toPoint, units);
		},
		timeZone: (station, { format = 'name' }) => {
			const lat = parseFloat(station.lat);
			const lon = parseFloat(station.lon);
			const zoneName = geoTz.tz(lat, lon);

			if (format === 'abbr') {
				return moment.tz(zoneName).zoneAbbr();
			}

			if (format === 'offset') {
				return moment.tz(zoneName).format('Z');
			}

			return zoneName;
		},
		predictions: async (station, { days = 2, datum, units }) => {
			const lat = parseFloat(station.lat);
			const lon = parseFloat(station.lon);
			const tz = geoTz.tz(lat, lon);

			const response = await fetchPredictionsForTideStation(station, { days, datum, units });
			return response.predictions.map((prediction) => {
				prediction.tz = tz;
				return prediction;
			});
		},
		url: (station) => `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.stationId}`,
		tidesUrl: (station) => `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${station.stationId}`
	},
	TidePrediction: {
		height: (prediction) => parseFloat(prediction.v),
		time: (prediction) => moment.tz(prediction.t, 'YYYY-MM-DD HH:mm', prediction.tz).format(),
		unixTime: (prediction) => moment.tz(prediction.t, 'YYYY-MM-DD HH:mm', prediction.tz).unix()
	}
};

const typeDefs = readFileSync('./type-defs.graphql', 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });
const graphqlHandler = microGraphql({ schema });
const graphiqlHandler = microGraphiql({ endpointURL: '/graphql' });

const cors = microCors({
	allowMethods: ['GET', 'POST'],
	allowHeaders: ['X-Requested-With', 'Content-Type', 'Accept']
});

fetchTideStations();
setInterval(fetchTideStations, ONE_DAY);

module.exports = cors(compress(router(
	get('/graphql', graphqlHandler),
	post('/graphql', graphqlHandler),
	get('/graphiql', graphiqlHandler),
	(req, res) => micro.send(res, 404, 'Not Found')
)));

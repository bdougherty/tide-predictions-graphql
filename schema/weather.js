import moment from 'moment-timezone';
import { formatTimeZoneName } from '../lib/time';
import {
	fetchWeatherForecast,
	getUvIndexColor,
	getUvIndexRisk,
	bearingToCardinalDirection
} from '../lib/weather';

const formatUnixTime = (unixTime, timeZone) => {
	return moment(unixTime * 1000).tz(timeZone).utc().format();
};

export default {
	WeatherIcon: {
		/* eslint-disable camelcase */
		clear_day: 'clear_day',
		clear_night: 'clear-night',
		rain: 'rain',
		snow: 'snow',
		sleet: 'sleet',
		wind: 'wind',
		fog: 'fog',
		cloudy: 'cloudy',
		partly_cloudy_day: 'partly-cloudy-day',
		partly_cloudy_night: 'partly-cloudy-night'
		/* eslint-enable camelcase */
	},
	Query: {
		weatherForecast: async (obj, { coordinate, units, extendedHourly }) => {
			return fetchWeatherForecast(coordinate, { units, extendedHourly });
		}
	},
	WeatherForecast: {
		lat: ({ latitude }) => latitude,
		lon: ({ longitude }) => longitude,
		time: (forecast) => formatUnixTime(forecast.currently.time, forecast.timezone),
		timeZone: ({ timezone }, { format = 'name' }) => formatTimeZoneName(timezone, format),
		units: (forecast) => forecast.flags.units,
		icon: (forecast) => forecast.currently.icon,
		summary: (forecast) => forecast.currently.summary,
		temperature: (forecast) => forecast.currently.temperature,
		apparentTemperature: (forecast) => forecast.currently.apparentTemperature,
		precipitation: ({ currently }) => currently,
		wind: ({ currently }) => currently,
		humidity: (forecast) => forecast.currently.humidity,
		dewPoint: (forecast) => forecast.currently.dewPoint,
		pressure: (forecast) => forecast.currently.pressure,
		visibility: (forecast) => forecast.currently.visibility,
		cloudCover: (forecast) => forecast.currently.cloudCover,
		uvIndex: ({ currently }) => currently,
		ozone: (forecast) => forecast.currently.ozone,
		hourly: (forecast) => forecast.hourly.data.map((hourlyForecast) => {
			return {
				timezone: forecast.timezone,
				...hourlyForecast
			};
		}),
		alerts: (forecast) => forecast.alerts.map((alert) => {
			return {
				timezone: forecast.timezone,
				...alert
			};
		})
	},
	Precipitation: {
		probability: ({ precipProbability = 0 }) => precipProbability,
		intensity: ({ precipIntensity = 0 }) => precipIntensity,
		type: ({ precipType }) => precipType
	},
	UvIndex: {
		index: ({ uvIndex }) => uvIndex,
		risk: ({ uvIndex }) => getUvIndexRisk(uvIndex),
		color: ({ uvIndex }) => getUvIndexColor(uvIndex)
	},
	Wind: {
		speed: ({ windSpeed }) => windSpeed,
		gust: ({ windGust }) => windGust,
		bearing: ({ windBearing }) => windBearing,
		direction: ({ windBearing }) => bearingToCardinalDirection(windBearing)
	},
	HourlyForecast: {
		time: ({ time, timezone }) => formatUnixTime(time, timezone),
		precipitation: (hourlyForecast) => hourlyForecast,
		wind: (hourlyForecast) => hourlyForecast,
		uvIndex: (hourlyForecast) => hourlyForecast
	},
	WeatherAlert: {
		time: ({ time, timezone }) => formatUnixTime(time, timezone),
		expires: ({ expires, timezone }) => formatUnixTime(expires, timezone),
		url: ({ uri }) => uri
	}
};

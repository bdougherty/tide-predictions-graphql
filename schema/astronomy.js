import moonmoji from 'moonmoji';
import { getSunPosition, getMoonPosition, convertMoonPhase, getObservations } from '../lib/astronomy';
import { convert } from '../lib/distance';

export default {
	Query: {
		astronomicalObservations: (obj, { coordinate }) => getObservations(coordinate)
	},
	AstronomicalObservations: {
		time: ({ date }) => date
	},
	SunObservations: {
		current: ({ lat, lon, date }) => getSunPosition(date, lat, lon),
		nightEnd: ({ lat, lon, nightEnd }) => getSunPosition(nightEnd, lat, lon),
		nauticalDawn: ({ lat, lon, nauticalDawn }) => getSunPosition(nauticalDawn, lat, lon),
		dawn: ({ lat, lon, dawn }) => getSunPosition(dawn, lat, lon),
		rise: ({ lat, lon, sunrise }) => getSunPosition(sunrise, lat, lon),
		maximumAltitude: ({ lat, lon, solarNoon }) => getSunPosition(solarNoon, lat, lon),
		set: ({ lat, lon, sunset }) => getSunPosition(sunset, lat, lon),
		dusk: ({ lat, lon, dusk }) => getSunPosition(dusk, lat, lon),
		nauticalDusk: ({ lat, lon, nauticalDusk }) => getSunPosition(nauticalDusk, lat, lon),
		night: ({ lat, lon, night }) => getSunPosition(night, lat, lon)
	},
	MoonObservations: {
		illumination: ({ fraction }) => fraction,
		phase: ({ phase }) => convertMoonPhase(phase),
		emoji: () => moonmoji().emoji,
		current: ({ lat, lon, date }) => getMoonPosition(date, lat, lon),
		rise: ({ lat, lon, rise: date }) => getMoonPosition(date, lat, lon),
		set: ({ lat, lon, set: date }) => getMoonPosition(date, lat, lon)
	},
	CelestialObjectObservation: {
		altitude: ({ altitude }) => altitude * (180 / Math.PI),
		azimuth: ({ azimuth }) => 180 + (azimuth * (180 / Math.PI)),
		distance: ({ distance }, { units }) => {
			if (units === 'AU') {
				return convert(distance, 'km', 'AU');
			}

			return distance;
		}
	}
};

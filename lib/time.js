import geoTz from 'geo-tz';
import moment from 'moment-timezone';

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

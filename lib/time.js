import geoTz from 'geo-tz';
import moment from 'moment-timezone';

export function formatTimeZone([lat, lon], format, date) {
	const zoneName = geoTz(parseFloat(lat), parseFloat(lon));
	return formatTimeZoneName(zoneName, format, date);
}

export function formatTimeZoneName(zoneName, format, date) {
	switch (format) {
		case 'abbr':
			return moment(date).tz(zoneName).zoneAbbr();

		case 'offset':
			return moment(date).tz(zoneName).format('Z');

		default:
			return zoneName;
	}
}

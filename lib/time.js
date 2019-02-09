import geoTz from 'geo-tz';
import * as tc from 'timezonecomplete';

export function formatTimeZone([lat, lon], format, date) {
	const timeZones = geoTz(parseFloat(lat), parseFloat(lon));
	return formatTimeZoneName(timeZones[0], format, date);
}

export function formatTimeZoneName(zoneName, format, date = new tc.DateTime()) {
	const dateTime = new tc.DateTime(`${date} ${zoneName}`);

	switch (format) {
		case 'abbr':
			return dateTime.zoneAbbreviation();

		case 'offset':
			return dateTime.format('xxx');

		default:
			return dateTime.zone().name();
	}
}

export function formatUnixTime(unixTime) {
	const date = new Date(unixTime * 1000);
	const dateTime = new tc.DateTime(date, tc.DateFunctions.Get, tc.local());
	return dateTime.toZone(tc.utc()).toIsoString();
}

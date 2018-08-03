import distance from '@turf/distance';
import convertUnit from 'convert-units';

export function calculateDistance([lat1, lon1], [lat2, lon2]) {
	const fromPoint = [
		parseFloat(lon1),
		parseFloat(lat1)
	];

	const toPoint = [
		parseFloat(lon2),
		parseFloat(lat2)
	];

	return distance(fromPoint, toPoint);
}

export function convert(value, fromUnit, toUnit) {
	if (toUnit === 'AU') {
		const meters = convertUnit(value).from(fromUnit).to('m');
		return meters / 149597870700;
	}

	if (fromUnit === 'AU') {
		const meters = value * 149597870700;
		return convertUnit(meters).from('m').to(toUnit);
	}

	if (fromUnit === 'nmi') {
		fromUnit = 'nMi';
	}

	if (toUnit === 'nmi') {
		toUnit = 'nMi';
	}

	return convertUnit(value).from(fromUnit).to(toUnit);
}

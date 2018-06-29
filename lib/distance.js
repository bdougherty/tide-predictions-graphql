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
	if (fromUnit === 'nmi') {
		fromUnit = 'nMi';
	}

	if (toUnit === 'nmi') {
		toUnit = 'nMi';
	}

	return convertUnit(value).from(fromUnit).to(toUnit);
}

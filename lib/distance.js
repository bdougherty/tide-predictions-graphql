import distance from '@turf/distance';

export default function calculateDistance([lat1, lon1], [lat2, lon2], units = 'miles') {
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

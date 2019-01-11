import { GraphQLScalarType } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

const validateCoordinate = (value, min, max, type) => {
	value = parseFloat(value);

	if (value > max || value < min) {
		throw new TypeError(`${type} must be between ${min} and ${max}`);
	}

	return value;
};

const validateLongitude = (value) => validateCoordinate(value, -180, 180, 'Longitude');
const validateLatitude = (value) => validateCoordinate(value, -90, 90, 'Latitude');

export default {
	DateTime: GraphQLDateTime,
	Longitude: new GraphQLScalarType({
		name: 'Longitude',
		description: 'Longitude is a geographic coordinate that specifies the east–west position of a point on the Earth’s surface. Meridians (lines running from the North Pole to the South Pole) connect points with the same longitude. By convention, one of these, the Prime Meridian, which passes through the Royal Observatory, Greenwich, England, was allocated the position of zero degrees longitude. The longitude of other places is measured as the angle east or west from the Prime Meridian, ranging from 0° at the Prime Meridian to +180° eastward and −180° westward. Must be a float between `-180` and `180`, inclusive.',
		serialize: validateLongitude,
		parseValue: validateLongitude,
		parseLiteral: ({ value }) => validateLongitude(value)
	}),
	Latitude: new GraphQLScalarType({
		name: 'Latitude',
		description: 'Latitude is a geographic coordinate that specifies the north–south position of a point on the Earth’s surface. Latitude is an angle which ranges from 0° at the Equator to 90° (North or South) at the poles. Must be a float between `-90` and `90`, inclusive.',
		serialize: validateLatitude,
		parseValue: validateLatitude,
		parseLiteral: ({ value }) => validateLatitude(value)
	})
};

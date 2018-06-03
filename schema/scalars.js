import { GraphQLScalarType } from 'graphql';

const validateLongitude = (value) => {
	value = parseFloat(value);

	if (value > 90 || value < -90) {
		throw new TypeError('Longitude must be between -90 and 90');
	}

	return value;
};

const validateLatitude = (value) => {
	value = parseFloat(value);

	if (value > 180 || value < -180) {
		throw new TypeError('Latitude must be between -180 and 180');
	}

	return value;
};

export default {
	Longitude: new GraphQLScalarType({
		name: 'Longitude',
		description: 'The longitude value of a geographic coordinate. Must be a float between `-90` and `90`, inclusive.',
		serialize: validateLongitude,
		parseValue: validateLongitude,
		parseLiteral: ({ value }) => validateLongitude(value)
	}),
	Latitude: new GraphQLScalarType({
		name: 'Latitude',
		description: 'The latitude value of a geographic coordinate. Must be a float between `-180` and `180`, inclusive.',
		serialize: validateLatitude,
		parseValue: validateLatitude,
		parseLiteral: ({ value }) => validateLatitude(value)
	})
};

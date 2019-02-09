import test from 'ava';
import scalars from './scalars.resolvers';

test('exports the proper scalars', (t) => {
	t.true('DateTime' in scalars);
	t.true('Latitude' in scalars);
	t.true('Longitude' in scalars);
});

test('Latitude', (t) => {
	const { Latitude } = scalars;

	t.is(Latitude.name, 'Latitude');

	t.is(Latitude.parseValue(-90), -90);
	t.is(Latitude.parseValue(0), 0);
	t.is(Latitude.parseValue(90), 90);
	t.throws(() => Latitude.parseValue(-91), TypeError, 'Latitude must be between -90 and 90');
	t.throws(() => Latitude.parseValue(91), TypeError, 'Latitude must be between -90 and 90');
	t.is(Latitude.parseLiteral({ value: 90 }), 90);
	t.is(Latitude.parseLiteral({ value: -90 }), -90);
});

test('Longitude', (t) => {
	const { Longitude } = scalars;

	t.is(Longitude.name, 'Longitude');

	t.is(Longitude.parseValue(-180), -180);
	t.is(Longitude.parseValue(0), 0);
	t.is(Longitude.parseValue(180), 180);
	t.throws(() => Longitude.parseValue(-181), TypeError, 'Longitude must be between -180 and 180');
	t.throws(() => Longitude.parseValue(181), TypeError, 'Longitude must be between -180 and 180');
	t.is(Longitude.parseLiteral({ value: 180 }), 180);
	t.is(Longitude.parseLiteral({ value: -180 }), -180);
});

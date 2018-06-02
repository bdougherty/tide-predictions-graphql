import test from 'ava';
import {
	convertCelsiusToFahrenheit,
	truncateFloat
} from './water-temperature';

test('converts celsius to fahrenheit properly', (t) => {
	t.is(convertCelsiusToFahrenheit(100), 212);
	t.is(convertCelsiusToFahrenheit(0), 31);
	t.is(convertCelsiusToFahrenheit(-40), -40);
});

test('truncates floats properly', (t) => {
	t.is(truncateFloat(1.123456789), 1.1234568);
	t.is(truncateFloat(1.123456789, 2), 1.12);
	t.is(truncateFloat(1.12345), 1.12345);
	t.is(truncateFloat(1.12345, 10), 1.12345);
});

import test from 'ava';
import { convert, calculateDistance } from './distance';

test('calculateDistance', (t) => {
	const fromPoint = ['0', '0'];
	const toPoint = ['-74', '39'];

	t.notThrows(() => {
		calculateDistance(fromPoint, toPoint);
	});
});

test('convert nmi', (t) => {
	t.is(convert(1, 'nmi', 'mi'), 1.150780303030303);
	t.is(convert(1, 'nMi', 'mi'), 1.150780303030303);
	t.is(convert(1, 'mi', 'nmi'), 0.8689755962686715);
	t.is(convert(1, 'mi', 'nMi'), 0.8689755962686715);
});

test('convert au', (t) => {
	t.is(convert(1, 'AU', 'm'), 149597870700);
	t.is(convert(1, 'AU', 'km'), 149597870.7);
	t.is(convert(149597870700, 'm', 'AU'), 1);
	t.is(convert(149597870.7, 'km', 'AU'), 1);
});

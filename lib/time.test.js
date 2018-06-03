import test from 'ava';
import { formatTimeZone, formatTimeZoneName } from './time';

test('formats time zone in name format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'name', '2018-06-01'), 'America/New_York');
});

test('formats time zone in abbr format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'abbr', '2018-06-01'), 'EDT');
});

test('formats time zone in offset format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'offset', '2018-06-01'), '-04:00');
});

test('formats time zone name in name format', (t) => {
	t.is(formatTimeZoneName('America/New_York', 'name', '2018-06-01'), 'America/New_York');
});

test('formats time zone name in abbr format', (t) => {
	t.is(formatTimeZoneName('America/New_York', 'abbr', '2018-06-01'), 'EDT');
});

test('formats time zone name in offset format', (t) => {
	t.is(formatTimeZoneName('America/New_York', 'offset', '2018-06-01'), '-04:00');
});

import test from 'ava';
import { formatTimeZone } from './time';

test('formats time zone in name format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'name'), 'America/New_York');
});

test('formats time zone in abbr format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'abbr'), 'EDT');
});

test('formats time zone in offset format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'offset'), '-04:00');
});

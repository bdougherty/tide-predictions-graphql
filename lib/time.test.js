import test from 'ava';
import { formatTimeZone, formatTimeZoneName, formatUnixTime } from './time';

test('formats time zone in name format without a date', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'name'), 'America/New_York');
});

test('formats time zone in name format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'name', '2018-06-01'), 'America/New_York');
});

test('formats time zone in abbr format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'abbr', '2018-06-01'), 'EDT');
});

test('formats time zone in offset format', (t) => {
	t.is(formatTimeZone([39.3426, -74.477], 'offset', '2018-06-01'), '-04:00');
});

test('formats time zone name in name format without a date', (t) => {
	t.is(formatTimeZoneName('America/New_York', 'name'), 'America/New_York');
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

test('formats unix time', (t) => {
	t.is(formatUnixTime(0), '1970-01-01T00:00:00.000+00:00');
	t.is(formatUnixTime(1547523715), '2019-01-15T03:41:55.000+00:00');
});

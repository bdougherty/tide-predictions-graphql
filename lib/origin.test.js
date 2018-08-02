import test from 'ava';
import { isAllowedOrigin } from './origin';

const allowedOrigins = [
	'tides.app',
	'https://thefuckingtide.com'
];

function allowedOrigin(t, input, expected) {
	t.is(isAllowedOrigin(input, allowedOrigins), expected);
}

allowedOrigin.title = (providedTitle, input, expected) => {
	if (expected) {
		return `${input} should be allowed`;
	}

	return `${input} should not be allowed`;
};

test(allowedOrigin, 'http://tides.app', true);
test(allowedOrigin, 'https://tides.app', true);
test(allowedOrigin, 'http://thefuckingtide.com', false);
test(allowedOrigin, 'https://thefuckingtide.com', true);
test(allowedOrigin, 'http://notallowed.com', false);
test(allowedOrigin, 'https://notallowed.com', false);

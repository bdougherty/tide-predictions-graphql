import test from 'ava';
import {
	bearingToCardinalDirection,
	getUvIndexRisk,
	getUvIndexColor
} from './weather';

function bearing(t, input, expected) {
	t.is(bearingToCardinalDirection(input), expected);
}

bearing.title = (providedTitle, input, expected) => `Properly converts bearing ${input} to ${expected}`;

test(bearing, 0, 'N');
test(bearing, 22.5, 'NNE');
test(bearing, 45, 'NE');
test(bearing, 67.5, 'ENE');
test(bearing, 90, 'E');
test(bearing, 112.5, 'ESE');
test(bearing, 135, 'SE');
test(bearing, 157.5, 'SSE');
test(bearing, 180, 'S');
test(bearing, 202.5, 'SSW');
test(bearing, 225, 'SW');
test(bearing, 247.5, 'WSW');
test(bearing, 270, 'W');
test(bearing, 292.5, 'WNW');
test(bearing, 315, 'NW');
test(bearing, 337.5, 'NNW');
test(bearing, 360, 'N');

function uvIndexRisk(t, input, expected) {
	t.is(getUvIndexRisk(input), expected);
}

uvIndexRisk.title = (providedTitle, input, expected) => `Properly returns ${expected} for UV Index ${input}`;

test(uvIndexRisk, 0, 'low');
test(uvIndexRisk, 1, 'low');
test(uvIndexRisk, 2, 'low');
test(uvIndexRisk, 2.9, 'low');
test(uvIndexRisk, 3, 'moderate');
test(uvIndexRisk, 4, 'moderate');
test(uvIndexRisk, 5, 'moderate');
test(uvIndexRisk, 5.9, 'moderate');
test(uvIndexRisk, 6, 'high');
test(uvIndexRisk, 7, 'high');
test(uvIndexRisk, 7.9, 'high');
test(uvIndexRisk, 8, 'veryhigh');
test(uvIndexRisk, 9, 'veryhigh');
test(uvIndexRisk, 10, 'veryhigh');
test(uvIndexRisk, 10.9, 'veryhigh');
test(uvIndexRisk, 11, 'extreme');
test(uvIndexRisk, 12, 'extreme');

function uvIndexColor(t, input, expected) {
	t.is(getUvIndexColor(input), expected);
}

uvIndexColor.title = (providedTitle, input, expected) => `Properly returns color ${expected} for UV Index ${input}`;

test(uvIndexColor, 0, 'green');
test(uvIndexColor, 1, 'green');
test(uvIndexColor, 2, 'green');
test(uvIndexColor, 2.9, 'green');
test(uvIndexColor, 3, 'yellow');
test(uvIndexColor, 4, 'yellow');
test(uvIndexColor, 5, 'yellow');
test(uvIndexColor, 5.9, 'yellow');
test(uvIndexColor, 6, 'orange');
test(uvIndexColor, 7, 'orange');
test(uvIndexColor, 7.9, 'orange');
test(uvIndexColor, 8, 'red');
test(uvIndexColor, 9, 'red');
test(uvIndexColor, 10, 'red');
test(uvIndexColor, 10.9, 'red');
test(uvIndexColor, 11, 'violet');
test(uvIndexColor, 12, 'violet');

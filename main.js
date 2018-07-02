import { send } from 'micro';
import route from 'micro-route';
import { microGraphiql, microGraphql } from 'apollo-server-micro';
import schema from './schema';

if (!process.env.APPLICATION) {
	throw new Error('Must provide APPLICATION environment variable.');
}

if (!process.env.ACCESS_CONTROL_ALLOW_ORIGIN) {
	throw new Error('Must set ACCESS_CONTROL_ALLOW_ORIGIN environment variable.');
}

const graphqlHandler = microGraphql({ schema });
const graphiqlHandler = microGraphiql({ endpointURL: '/graphql' });

const corsRoute = route('*', 'OPTIONS');
const graphqlRoute = route('/graphql', ['GET', 'POST']);
const graphiqlRoute = route('/graphiql', 'GET');

export default (req, res) => {
	if (corsRoute(req)) {
		const originEnv = process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
		const allowedOrigins = originEnv.split(',');
		const { origin } = req.headers;

		res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST'].join(','));
		res.setHeader('Access-Control-Allow-Headers', ['X-Requested-With', 'Content-Type', 'Accept'].join(','));

		if (originEnv === '*') {
			res.setHeader('Access-Control-Allow-Origin', '*');
		}

		if (allowedOrigins.indexOf(origin) !== -1) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}

		return '';
	}

	if (graphqlRoute(req)) {
		return graphqlHandler(req, res);
	}

	if (process.env.ENABLE_GRAPHIQL && graphiqlRoute(req)) {
		return graphiqlHandler(req, res);
	}

	send(res, 404, 'Not Found');
};

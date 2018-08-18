import { send } from 'micro';
import route from 'micro-route';
import { ApolloServer } from 'apollo-server-micro';
import * as Sentry from '@sentry/node';
import git from 'git-rev-sync';
import { typeDefs, resolvers } from './schema';
import { isAllowedOrigin } from './lib/origin';

if (process.env.SENTRY_DSN) {
	const gitRevision = git.long();
	const release = process.env.NODE_ENV === 'production' ? gitRevision : 'dev';

	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		release,
		environment: process.env.NODE_ENV
	});
}

if (!process.env.APPLICATION) {
	throw new Error('Must provide APPLICATION environment variable.');
}

if (!process.env.ACCESS_CONTROL_ALLOW_ORIGIN) {
	throw new Error('Must set ACCESS_CONTROL_ALLOW_ORIGIN environment variable.');
}

const originEnv = process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
const allowedOrigins = originEnv.split(',');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	playground: process.env.ENABLE_GRAPHQL_PLAYGROUND,
	engine: {
		apiKey: process.env.APOLLO_ENGINE
	},
	formatError(error) {
		Sentry.captureException(error);
		return error;
	}
});

const graphqlHandler = apolloServer.createHandler();

const corsRoute = route('*', 'OPTIONS');
const graphqlRoute = route('/graphql', ['GET', 'POST']);

const setCorsHeaders = (req, res) => {
	const { origin } = req.headers;

	res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST'].join(','));
	res.setHeader('Access-Control-Allow-Headers', ['X-Requested-With', 'Content-Type', 'Accept'].join(','));
	res.setHeader('Vary', 'Origin');

	if (originEnv === '*') {
		res.setHeader('Access-Control-Allow-Origin', '*');
	}
	else if (isAllowedOrigin(origin, allowedOrigins)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
};

export default (req, res) => {
	if (corsRoute(req)) {
		setCorsHeaders(req, res);
		return '';
	}

	if (graphqlRoute(req)) {
		setCorsHeaders(req, res);
		return graphqlHandler(req, res);
	}

	send(res, 404, 'Not Found');
};

import { send } from 'micro';
import compress from 'micro-compress';
import microCors from 'micro-cors';
import dispatch from 'micro-route/dispatch';
import { microGraphiql, microGraphql } from 'apollo-server-micro';
import schema from './schema';

if (!process.env.APPLICATION) {
	throw new Error('Must provide APPLICATION environment variable.');
}

if (!process.env.ACCESS_CONTROL_ALLOW_ORIGIN) {
	throw new Error('Must set ACCESS_CONTROL_ALLOW_ORIGIN environment variable.');
}

const cors = microCors({
	allowMethods: ['GET', 'POST'],
	allowHeaders: ['X-Requested-With', 'Content-Type', 'Accept'],
	origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN
});

const graphqlHandler = microGraphql({ schema });
let dispatcher = dispatch('/graphql', ['GET', 'POST'], graphqlHandler);

if (process.env.ENABLE_GRAPHIQL) {
	const graphiqlHandler = microGraphiql({ endpointURL: '/graphql' });
	dispatcher = dispatcher.dispatch('/graphiql', ['GET'], graphiqlHandler);
}

dispatcher = dispatcher.otherwise((req, res) => {
	send(res, 404, 'Not Found');
});

export default cors(compress(dispatcher));

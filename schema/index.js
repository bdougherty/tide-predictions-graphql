'use strict';
import { join } from 'path';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

const allTypes = fileLoader(join(__dirname, './**/*.graphql'));
const allResolvers = fileLoader(join(__dirname, './**/*.js'));

const typeDefs = mergeTypes(allTypes);
const resolvers = mergeResolvers(allResolvers);

export { typeDefs, resolvers };

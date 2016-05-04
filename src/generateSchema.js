import createTypes from './createTypes';
import createQueries from './createQueries';
import createMutations from './createMutations';

import {
	GraphQLObjectType,
	GraphQLSchema,
} from 'graphql';

/**
 * Generate GraphQLSchema for provided sails.models
 * @param {object} sailsModels sails.models object
 */
export function generateSchema(sailsModels) {
	const types = createTypes(sailsModels);
	const queries = createQueries(sailsModels, types);
	const mutations = createMutations(sailsModels, types);

	return new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'RootQueryType',
			fields: () => queries
		}),
		mutation: new GraphQLObjectType({
			name: 'RootMutationType',
			fields: () => mutations
		})
	});
}

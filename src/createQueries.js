import {
	getName,
	getSingleQueryArgs,
	getConnectionType,
	connectionArgs,
} from './helpers';

import {
	resolveGetSingle,
	resolveGetRange,
} from './resolvers';

const queries = {};
let objectTypes;

/**
 * Create a query object type
 * @param model
 */
function createSingleQuery(model) {

	const { queryName, queryTypeName, typeName } = getName(model);
	const args = getSingleQueryArgs(model._attributes);

	queries[queryName] = {
		name: queryTypeName,
		args,
		type: objectTypes[typeName],
		resolve: resolveGetSingle(model)
	};

}

/**
 * Create a query object type for multiple instances
 * @param model
 */
function createRangeQuery(model) {

	const {
		queryPluralName,
		queryPluralTypeName,
		typeName,
		connectionTypeName
	} = getName(model);

	queries[queryPluralName] = {
		name: queryPluralTypeName,
		type: getConnectionType(connectionTypeName, objectTypes[typeName]),
		args: connectionArgs,
		resolve: resolveGetRange(model)
	};

}

/**
 * Populate 'queries' object and return it
 * @param models
 * @param types
 * @returns {object}
 */
export default function createQueries(models, types) {
	objectTypes = types;

	Object.keys(models).forEach((modelName) => {
		createSingleQuery(models[modelName]);
		createRangeQuery(models[modelName]);
	});

	return queries;
}

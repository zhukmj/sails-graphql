'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createQueries;

var _helpers = require('./helpers');

var _resolvers = require('./resolvers');

var queries = {};
var objectTypes = void 0;

/**
 * Create a query object type
 * @param model
 */
function createSingleQuery(model) {
	var _getName = (0, _helpers.getName)(model),
	    queryName = _getName.queryName,
	    queryTypeName = _getName.queryTypeName,
	    typeName = _getName.typeName;

	var args = (0, _helpers.getSingleQueryArgs)(model.attributes);

	queries[queryName] = {
		name: queryTypeName,
		args: args,
		type: objectTypes[typeName],
		resolve: (0, _resolvers.resolveGetSingle)(model)
	};
}

/**
 * Create a query object type for multiple instances
 * @param model
 */
function createRangeQuery(model) {
	var _getName2 = (0, _helpers.getName)(model),
	    queryPluralName = _getName2.queryPluralName,
	    queryPluralTypeName = _getName2.queryPluralTypeName,
	    typeName = _getName2.typeName,
	    connectionTypeName = _getName2.connectionTypeName;

	queries[queryPluralName] = {
		name: queryPluralTypeName,
		type: (0, _helpers.getConnectionType)(connectionTypeName, objectTypes[typeName]),
		args: _helpers.connectionArgs,
		resolve: (0, _resolvers.resolveGetRange)(model)
	};
}

/**
 * Populate 'queries' object and return it
 * @param models
 * @param types
 * @returns {object}
 */
function createQueries(models, types) {
	objectTypes = types;

	Object.keys(models).forEach(function (modelName) {
		createSingleQuery(models[modelName]);
		createRangeQuery(models[modelName]);
	});

	return queries;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createMutation;

var _graphql = require('graphql');

var _helpers = require('./helpers');

var _resolvers = require('./resolvers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mutations = {};
var objectTypes = void 0;

/**
 * Create 'create' mutation type
 * @param {object} model sails model
 */
function createCreateMutation(model) {
	var _getName = (0, _helpers.getName)(model),
	    mutationCreateName = _getName.mutationCreateName,
	    mutationCreateTypeName = _getName.mutationCreateTypeName,
	    typeName = _getName.typeName,
	    inputTypeName = _getName.inputTypeName,
	    queryName = _getName.queryName;

	mutations[mutationCreateName] = {
		name: mutationCreateTypeName,
		type: objectTypes[typeName],
		args: _defineProperty({}, queryName, {
			type: new _graphql.GraphQLNonNull(objectTypes[inputTypeName])
		}),
		resolve: (0, _resolvers.resolveCreate)(model)
	};
}

/**
 * Create 'delete' mutation type
 * @param {object} model sails model
 */
function createDeleteMutation(model) {
	var _getName2 = (0, _helpers.getName)(model),
	    mutationDeleteName = _getName2.mutationDeleteName,
	    mutationDeleteTypeName = _getName2.mutationDeleteTypeName,
	    typeName = _getName2.typeName;

	mutations[mutationDeleteName] = {
		name: mutationDeleteTypeName,
		type: objectTypes[typeName],
		args: {
			id: {
				type: new _graphql.GraphQLNonNull(_helpers.dataTypes[model.attributes.id.type])
			}
		},
		resolve: (0, _resolvers.resolveDelete)(model)
	};
}

/**
 * Create 'update' mutation type
 * @param {object} model sails model
 */
function createUpdateMutation(model) {
	var _getName3 = (0, _helpers.getName)(model),
	    mutationUpdateName = _getName3.mutationUpdateName,
	    mutationUpdateTypeName = _getName3.mutationUpdateTypeName,
	    typeName = _getName3.typeName,
	    inputTypeName = _getName3.inputTypeName,
	    queryName = _getName3.queryName;

	mutations[mutationUpdateName] = {
		name: mutationUpdateTypeName,
		type: objectTypes[typeName],
		args: _defineProperty({
			id: {
				type: new _graphql.GraphQLNonNull(_helpers.dataTypes[model.attributes.id.type])
			}
		}, queryName, {
			type: new _graphql.GraphQLNonNull(objectTypes[inputTypeName])
		}),
		resolve: (0, _resolvers.resolveUpdate)(model)
	};
}

/**
 * Create fields for root mutation type
 * @param {object} models sails.models
 * @param {object} types predefined GraphQL object types
 * @returns {object} fields for root mutation type
 */
function createMutation(models, types) {

	objectTypes = types;

	Object.keys(models).forEach(function (modelName) {
		createCreateMutation(models[modelName]);
		createDeleteMutation(models[modelName]);
		createUpdateMutation(models[modelName]);
	});

	return mutations;
}
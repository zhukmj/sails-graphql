import {
	GraphQLNonNull,
} from 'graphql';

import {
	getName,
	dataTypes,
} from './helpers';

import {
	resolveCreate,
	resolveDelete,
	resolveUpdate,
} from './resolvers';

const mutations = {};
let objectTypes;

/**
 * Create 'create' mutation type
 * @param {object} model sails model
 */
function createCreateMutation(model) {

	const {
		mutationCreateName,
		mutationCreateTypeName,
		typeName,
		inputTypeName,
		queryName
	} = getName(model);

	mutations[mutationCreateName] = {
		name: mutationCreateTypeName,
		type: objectTypes[typeName],
		args: {
			[queryName]: {
				type: new GraphQLNonNull(objectTypes[inputTypeName])
			}
		},
		resolve: resolveCreate(model)
	};

}

/**
 * Create 'delete' mutation type
 * @param {object} model sails model
 */
function createDeleteMutation(model) {

	const {
		mutationDeleteName,
		mutationDeleteTypeName,
		typeName
	} = getName(model);

	mutations[mutationDeleteName] = {
		name: mutationDeleteTypeName,
		type: objectTypes[typeName],
		args: {
			id: {
				type: new GraphQLNonNull(dataTypes[model._attributes.id.type])
			}
		},
		resolve: resolveDelete(model)
	};

}

/**
 * Create 'update' mutation type
 * @param {object} model sails model
 */
function createUpdateMutation(model) {

	const {
		mutationUpdateName,
		mutationUpdateTypeName,
		typeName,
		inputTypeName,
		queryName,
	} = getName(model);

	mutations[mutationUpdateName] = {
		name: mutationUpdateTypeName,
		type: objectTypes[typeName],
		args: {
			id: {
				type: new GraphQLNonNull(dataTypes[model._attributes.id.type])
			},
			[queryName]: {
				type: new GraphQLNonNull(objectTypes[inputTypeName])
			}
		},
		resolve: resolveUpdate(model)
	};

}

/**
 * Create fields for root mutation type
 * @param {object} models sails.models
 * @param {object} types predefined GraphQL object types
 * @returns {object} fields for root mutation type
 */
export default function createMutation(models, types) {

	objectTypes = types;

	Object.keys(models).forEach((modelName) => {
		createCreateMutation(models[modelName]);
		createDeleteMutation(models[modelName]);
		createUpdateMutation(models[modelName]);
	});

	return mutations;

}

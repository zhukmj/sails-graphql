import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLList,
} from 'graphql';

import {
	getName,
	getConnectionType,
	supportedTypes,
	dataTypes,
	connectionArgs,
} from './helpers';

import {
	resolveGetRange,
} from './resolvers';

// Cache of generated Object Types
const objectTypes = {};
let models;

/**
 * Generate fields for GraphQLObjectType or GraphQLInputObjectType
 * for provided sails model's attributes
 * @param {object} modelObject Sails model
 * @param {boolean} isInputType
 * for GraphQLInputType or not
 */
function getObjectFields(modelObject, isInputType = false) {

	const { attributes } = modelObject;
	const { queryName } = getName(modelObject);

	// Go through all fields and return object of
	// converted sails types to GraphQL types
	return () => Object.keys(attributes).reduce((fields, fieldName) => {

		const { type, collection, model } = attributes[fieldName];

		// Field type must be either `type`, `collection` or `model`
		const attrType = type || collection || model;
		let fieldTypeName;
		let childModel;

		// Check whether fieldType was provided
		if (!attrType) {
			console.error(`
				Each field must have either 'type', 'collection' or 'model' 
				property defined. Field '${fieldName}' was omitted.
			`);
			return fields;
		}

		if (model || collection) {
			childModel = models[attrType.toLowerCase()];
			fieldTypeName = isInputType ?
				getName(childModel).inputTypeName :
				getName(childModel).typeName;
		}

		// Check whether field has supported type
		if (
			supportedTypes.indexOf(attrType) === -1 &&
			!objectTypes[fieldTypeName]
		) {
			console.error(`
				Field '${fieldName}' has unsupported type 
				'${attrType}' and was omitted.
			`);
			return fields;
		}

		const fieldType = dataTypes[attrType] || objectTypes[fieldTypeName];

		fields[fieldName] = {};

		if (type || model) {
			fields[fieldName].type = fieldType;
			return fields;
		}

		if (isInputType && collection) {
			fields[fieldName].type = new GraphQLList(fieldType);
			return fields;
		}

		const { fieldConnectionTypeName } = getName(modelObject, fieldName);

		fields[fieldName] = {
			type: getConnectionType(fieldConnectionTypeName, fieldType),
			args: connectionArgs,
			// Getting the field's model
			resolve: resolveGetRange(childModel, queryName)
		};

		return fields;

	}, {});
}

/**
 * Create a GraphQLObjectType for provided sails model
 * @param {object} model sails model
 */
function createOutputType(model) {

	// Define output type name
	const { typeName } = getName(model);

	objectTypes[typeName] = new GraphQLObjectType({
		name: typeName,
		fields: getObjectFields(model)
	});

}

/**
 * Create a GraphQLInputObjectType for sails model
 * @param {object} model sails model
 */
function createInputType(model) {

	// Define output type name
	const { inputTypeName } = getName(model);

	objectTypes[inputTypeName] = new GraphQLInputObjectType({
		name: inputTypeName,
		fields: getObjectFields(model, true)
	});

}

/**
 * Return an object of GraphQLObjectType and GraphQLInputObjectType
 * for each given sails model
 * @param {object} sailsModels sails.models
 * @returns {object} Output and Input object types
 */
export default function createTypes(sailsModels) {
	models = sailsModels;

	Object.keys(models).forEach((modelName) => {
		createOutputType(models[modelName]);
		createInputType(models[modelName]);
	});

	return objectTypes;
}

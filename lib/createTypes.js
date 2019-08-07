'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createTypes;

var _graphql = require('graphql');

var _helpers = require('./helpers');

var _resolvers = require('./resolvers');

// Cache of generated Object Types
var objectTypes = {};
var models = void 0;

/**
 * Generate fields for GraphQLObjectType or GraphQLInputObjectType
 * for provided sails model's attributes
 * @param {object} modelObject Sails model
 * @param {boolean} isInputType
 * for GraphQLInputType or not
 */
function getObjectFields(modelObject) {
	var isInputType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var attributes = modelObject.attributes;

	var _getName = (0, _helpers.getName)(modelObject),
	    queryName = _getName.queryName;

	// Go through all fields and return object of
	// converted sails types to GraphQL types


	return function () {
		return Object.keys(attributes).reduce(function (fields, fieldName) {
			var _attributes$fieldName = attributes[fieldName],
			    type = _attributes$fieldName.type,
			    collection = _attributes$fieldName.collection,
			    model = _attributes$fieldName.model;

			// Field type must be either `type`, `collection` or `model`

			var attrType = type || collection || model;
			var fieldTypeName = void 0;
			var childModel = void 0;

			// Check whether fieldType was provided
			if (!attrType) {
				console.error('\n\t\t\t\tEach field must have either \'type\', \'collection\' or \'model\' \n\t\t\t\tproperty defined. Field \'' + fieldName + '\' was omitted.\n\t\t\t');
				return fields;
			}

			if (model || collection) {
				childModel = models[attrType.toLowerCase()];
				fieldTypeName = isInputType ? (0, _helpers.getName)(childModel).inputTypeName : (0, _helpers.getName)(childModel).typeName;
			}

			// Check whether field has supported type
			if (_helpers.supportedTypes.indexOf(attrType) === -1 && !objectTypes[fieldTypeName]) {
				console.error('\n\t\t\t\tField \'' + fieldName + '\' has unsupported type \n\t\t\t\t\'' + attrType + '\' and was omitted.\n\t\t\t');
				return fields;
			}

			var fieldType = _helpers.dataTypes[attrType] || objectTypes[fieldTypeName];

			fields[fieldName] = {};

			if (type || model) {
				fields[fieldName].type = fieldType;
				return fields;
			}

			if (isInputType && collection) {
				fields[fieldName].type = new _graphql.GraphQLList(fieldType);
				return fields;
			}

			var _getName2 = (0, _helpers.getName)(modelObject, fieldName),
			    fieldConnectionTypeName = _getName2.fieldConnectionTypeName;

			fields[fieldName] = {
				type: (0, _helpers.getConnectionType)(fieldConnectionTypeName, fieldType),
				args: _helpers.connectionArgs,
				// Getting the field's model
				resolve: (0, _resolvers.resolveGetRange)(childModel, queryName)
			};

			return fields;
		}, {});
	};
}

/**
 * Create a GraphQLObjectType for provided sails model
 * @param {object} model sails model
 */
function createOutputType(model) {

	// Define output type name
	var _getName3 = (0, _helpers.getName)(model),
	    typeName = _getName3.typeName;

	objectTypes[typeName] = new _graphql.GraphQLObjectType({
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
	var _getName4 = (0, _helpers.getName)(model),
	    inputTypeName = _getName4.inputTypeName;

	objectTypes[inputTypeName] = new _graphql.GraphQLInputObjectType({
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
function createTypes(sailsModels) {
	models = sailsModels;

	Object.keys(models).forEach(function (modelName) {
		createOutputType(models[modelName]);
		createInputType(models[modelName]);
	});

	return objectTypes;
}
import pluralize from 'pluralize';

import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLID,
	GraphQLString,
} from 'graphql';

// Sails to GraphQL types conversion
export const dataTypes = {
	string: GraphQLString,
	text: GraphQLString,
	integer: GraphQLInt,
	float: GraphQLFloat,
	date: GraphQLString,
	datetime: GraphQLString,
	boolean: GraphQLBoolean,
	objectid: GraphQLID
};

export const supportedTypes = Object.keys(dataTypes);

// Defining query args
// Disabling max-len rule due to long docs link
/* eslint-disable max-len */
export const connectionArgs = {
	// `where` is JSON-like string
	// used for filtering data
	// where: "{
	//   \"someProp\": \"someValue\",
	//   \"otherProp\": {
	//     \"contains\": \"a\"
	//   }
	// }"
	// For full reference see
	// https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md
	where: { type: GraphQLString },
	limit: { type: GraphQLInt },
	skip: { type: GraphQLInt },
	sort: { type: GraphQLString }
};

/**
 * Make the first letter of the `string` upper cased
 * @param {string} string
 * @returns {string}
 */
export function firstLetterToUpperCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Make the first letter of the `string` lower cased
 * @param {string} string
 * @returns {string}
 */
export function firstLetterToLowerCase(string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Generate Type and Query names from a model name
 * @param {object} model Sails model object
 * @param {string} [fieldKey]
 * @returns {object}
 */
export function getName(model, fieldKey = '') {

	// Get model globalId to have original modal name (with correct case)
	// Basically it should start with upper cased letter
	const modelTypeName = model.globalId;

	// Make sure the first letter of field name is upper cased
	const fieldName = firstLetterToUpperCase(fieldKey);

	// Will be used as GraphQL query field identifier
	// Basically it should start with lower cased letter
	const modelName = firstLetterToLowerCase(modelTypeName);

	// TODO make an ability to customize this names
	// (for example from model definition file)
	return {
		typeName: `${modelTypeName}Type`,
		inputTypeName: `${modelTypeName}InputType`,
		connectionTypeName: `${modelTypeName}ConnectionType`,
		fieldConnectionTypeName: `${modelTypeName}${fieldName}ConnectionType`,
		fieldUnionTypeName: `${modelTypeName}${fieldName}UnionType`,
		queryName: `${modelName}`,
		queryPluralName: `${pluralize(modelName)}`,
		queryTypeName: `${modelTypeName}Query`,
		queryPluralTypeName: `${modelTypeName}RangeQuery`,
		mutationCreateName: `create${modelTypeName}Mutation`,
		mutationCreateTypeName: `Create${modelTypeName}Mutation`,
		mutationDeleteName: `delete${modelTypeName}Mutation`,
		mutationDeleteTypeName: `Delete${modelTypeName}Mutation`,
		mutationUpdateName: `update${modelTypeName}Mutation`,
		mutationUpdateTypeName: `Update${modelTypeName}Mutation`
	};
}

/**
 * Create connection type with predefined field
 * @param {string} name
 * @param {GraphQLObjectType} edgesType
 */
export function getConnectionType(name, edgesType) {
	return new GraphQLObjectType({
		name,
		fields: () => ({
			page: { type: GraphQLInt },
			pages: { type: GraphQLInt },
			perPage: { type: GraphQLInt },
			total: { type: GraphQLInt },
			edges: { type: new GraphQLList(edgesType) }
		})
	});
}

/**
 * Return an array of model unique fields' names
 * @param attributes
 * @returns {Array.<T>}
 */
export function getUniqueFields(attributes) {
	return Object.keys(attributes).filter((fieldName) => {
		return attributes[fieldName].unique === true;
	});
}

/**
 * Create an args object for sinqle query
 * @param attributes
 */
export function getSingleQueryArgs(attributes) {

	const uniqueFields = getUniqueFields(attributes);

	return uniqueFields.reduce((args, fieldName) => {
		args[fieldName] = {
			type: dataTypes[attributes[fieldName].type]
		};
		return args;
	}, {});
}

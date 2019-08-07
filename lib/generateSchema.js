'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.generateSchema = generateSchema;

var _createTypes = require('./createTypes');

var _createTypes2 = _interopRequireDefault(_createTypes);

var _createQueries = require('./createQueries');

var _createQueries2 = _interopRequireDefault(_createQueries);

var _createMutations = require('./createMutations');

var _createMutations2 = _interopRequireDefault(_createMutations);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate GraphQLSchema for provided sails.models
 * @param {object} sailsModels sails.models object
 */
function generateSchema(sailsModels) {
	var types = (0, _createTypes2.default)(sailsModels);
	var queries = (0, _createQueries2.default)(sailsModels, types);
	var mutations = (0, _createMutations2.default)(sailsModels, types);

	return new _graphql.GraphQLSchema({
		query: new _graphql.GraphQLObjectType({
			name: 'RootQueryType',
			fields: function fields() {
				return queries;
			}
		}),
		mutation: new _graphql.GraphQLObjectType({
			name: 'RootMutationType',
			fields: function fields() {
				return mutations;
			}
		})
	});
}
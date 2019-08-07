'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.resolveGetRange = resolveGetRange;
exports.resolveGetSingle = resolveGetSingle;
exports.resolveCreate = resolveCreate;
exports.resolveDelete = resolveDelete;
exports.resolveUpdate = resolveUpdate;

var _helpers = require('./helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function resolveGetRange(model) {
	var parentFieldName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


	var modelIdentity = model.identity;

	return function (rootValue, _ref, _ref2) {
		var _ref$where = _ref.where,
		    where = _ref$where === undefined ? '{}' : _ref$where,
		    _ref$limit = _ref.limit,
		    limit = _ref$limit === undefined ? 100 : _ref$limit,
		    _ref$skip = _ref.skip,
		    skip = _ref$skip === undefined ? 0 : _ref$skip,
		    _ref$sort = _ref.sort,
		    sort = _ref$sort === undefined ? '' : _ref$sort;
		var request = _ref2.request,
		    _ref2$reqData = _ref2.reqData,
		    reqData = _ref2$reqData === undefined ? {} : _ref2$reqData;
		return new Promise(function (resolve, reject) {

			var whereWithParentId = void 0;

			if (rootValue && rootValue.id) {

				whereWithParentId = Object.assign(JSON.parse(where), _defineProperty({}, parentFieldName, rootValue.id));

				whereWithParentId = JSON.stringify(whereWithParentId);
			}

			request(_extends({
				method: 'GET',
				url: '/' + modelIdentity + '/find'
			}, reqData), {
				where: whereWithParentId || where,
				limit: limit,
				skip: skip,
				sort: sort
			}, function (err1, res) {
				if (err1) {
					return reject(err1);
				}

				model.count(JSON.parse(where), function (err2, count) {
					if (err2) {
						return reject(err2);
					}

					resolve({
						page: skip / limit + 1,
						pages: Math.ceil(count / limit),
						perPage: limit,
						total: count,
						edges: res.body
					});
				});
			});
		});
	};
}

function resolveGetSingle(model) {

	var modelIdentity = model.identity;

	return function (rootValue, args, _ref3) {
		var request = _ref3.request,
		    _ref3$reqData = _ref3.reqData,
		    reqData = _ref3$reqData === undefined ? {} : _ref3$reqData;
		return new Promise(function (resolve, reject) {
			request(_extends({
				method: 'GET',
				url: '/' + modelIdentity + '/find'
			}, reqData), args, function (err, res) {
				if (err) {
					return reject(err);
				}
				if (res.body instanceof Array) {
					res.body = res[0];
				}
				resolve(res.body);
			});
		});
	};
}

function resolveCreate(model) {

	var modelIdentity = model.identity;

	var _getName = (0, _helpers.getName)(model),
	    queryName = _getName.queryName;

	return function (rootValue, args, _ref4) {
		var request = _ref4.request,
		    _ref4$reqData = _ref4.reqData,
		    reqData = _ref4$reqData === undefined ? {} : _ref4$reqData;
		return new Promise(function (resolve, reject) {
			request(_extends({
				method: 'POST',
				url: '/' + modelIdentity + '/create'
			}, reqData), args[queryName], function (err, res) {
				if (err) {
					return reject(err);
				}
				resolve(res.body);
			});
		});
	};
}

function resolveDelete(model) {

	var modelIdentity = model.identity;

	return function (rootValue, _ref5, _ref6) {
		var id = _ref5.id;
		var request = _ref6.request,
		    _ref6$reqData = _ref6.reqData,
		    reqData = _ref6$reqData === undefined ? {} : _ref6$reqData;
		return new Promise(function (resolve, reject) {
			request(_extends({
				method: 'DELETE',
				url: '/' + modelIdentity + '/' + id
			}, reqData), function (err, res) {
				if (err) {
					return reject(err);
				}
				resolve(res.body);
			});
		});
	};
}

function resolveUpdate(model) {

	var modelIdentity = model.identity;

	var _getName2 = (0, _helpers.getName)(model),
	    queryName = _getName2.queryName;

	return function (rootValue, args, _ref7) {
		var request = _ref7.request,
		    _ref7$reqData = _ref7.reqData,
		    reqData = _ref7$reqData === undefined ? {} : _ref7$reqData;
		return new Promise(function (resolve, reject) {
			request(_extends({
				method: 'PUT',
				url: '/' + modelIdentity + '/' + args.id
			}, reqData), args[queryName], function (err, res) {
				if (err) {
					return reject(err);
				}
				resolve(res.body);
			});
		});
	};
}
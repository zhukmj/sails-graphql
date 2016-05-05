import {
	getName,
} from './helpers';

export function resolveGetRange(model, parentFieldName = '') {

	const modelIdentity = model.identity;

	return (
		rootValue,
		{ where = '{}', limit = 100, skip = 0, sort = '' },
		{ request, reqData = {} }
	) => new Promise((resolve, reject) => {

		let whereWithParentId;

		if (rootValue && rootValue.id) {

			whereWithParentId = Object.assign(JSON.parse(where), {
				[parentFieldName]: rootValue.id
			});

			whereWithParentId = JSON.stringify(whereWithParentId);

		}

		request({
			method: 'GET',
			url: `/${modelIdentity}/find`,
			...reqData
		}, {
			where: whereWithParentId || where,
			limit,
			skip,
			sort
		}, (err1, res) => {
			if (err1) {
				return reject(err1);
			}

			model.count(JSON.parse(where), (err2, count) => {
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

}

export function resolveGetSingle(model) {

	const modelIdentity = model.identity;

	return (
		rootValue,
		args,
		{ request, reqData = {} }
	) => new Promise((resolve, reject) => {
		request({
			method: 'GET',
			url: `/${modelIdentity}/find`,
			...reqData
		}, args, (err, res) => {
			if (err) {
				return reject(err);
			}
			if (res.body instanceof Array) {
				res.body = res[0];
			}
			resolve(res.body);
		});
	});

}

export function resolveCreate(model) {

	const modelIdentity = model.identity;
	const { queryName } = getName(model);

	return (
		rootValue,
		args,
		{ request, reqData = {} }
	) => new Promise((resolve, reject) => {
		request({
			method: 'POST',
			url: `/${modelIdentity}/create`,
			...reqData
		}, args[queryName], (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve(res.body);
		});
	});

}

export function resolveDelete(model) {

	const modelIdentity = model.identity;

	return (
		rootValue,
		{ id },
		{ request, reqData = {} }
	) => new Promise((resolve, reject) => {
		request({
			method: 'DELETE',
			url: `/${modelIdentity}/${id}`,
			...reqData
		}, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve(res.body);
		});
	});

}

export function resolveUpdate(model) {

	const modelIdentity = model.identity;
	const { queryName } = getName(model);

	return (
		rootValue,
		args,
		{ request, reqData = {} }
	) => new Promise((resolve, reject) => {
		request({
			method: 'PUT',
			url: `/${modelIdentity}/${args.id}`,
			...reqData
		}, args[queryName] , (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve(res.body);
		});
	});

}

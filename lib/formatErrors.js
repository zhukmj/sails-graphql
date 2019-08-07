'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = formatError;
function formatError(defaultErrors) {

	return defaultErrors.reduce(function (formattedErrors, _ref) {
		var originalError = _ref.originalError;
		var body = originalError.body;
		var code = body.code,
		    status = body.status,
		    message = body.reason,
		    model = body.model,
		    errors = body.invalidAttributes;


		var processedError = {
			code: code,
			status: code === 'E_VALIDATION' ? 422 : status,
			message: message,
			model: model,
			validationErrors: {}
		};

		if (errors) {
			processedError.validationErrors = Object.keys(errors).reduce(function (validationErrors, fieldName) {

				if (!validationErrors[fieldName]) {
					validationErrors[fieldName] = [];
				}

				errors[fieldName].forEach(function (field) {
					var rule = field.rule;

					validationErrors[fieldName].push(model + '.' + rule);
				});

				return validationErrors;
			}, {});
		}

		formattedErrors.push(processedError);

		return formattedErrors;
	}, []);
}
export default function formatError(defaultErrors) {

	return defaultErrors.reduce((formattedErrors, { originalError }) => {

		const { body } = originalError;
		const {
			code,
			status,
			reason: message,
			model,
			invalidAttributes: errors
		} = body;

		const processedError = {
			code,
			status: (code === 'E_VALIDATION' ? 422 : status),
			message,
			model,
			validationErrors: {}
		};

		if (errors) {
			processedError.validationErrors = Object.keys(errors).reduce((
				validationErrors,
				fieldName
			) => {

				if (!validationErrors[fieldName]) {
					validationErrors[fieldName] = [];
				}

				errors[fieldName].forEach((field) => {
					const { rule } = field;
					validationErrors[fieldName].push(`${model}.${rule}`);
				});

				return validationErrors;

			}, {});

		}

		formattedErrors.push(processedError);

		return formattedErrors;

	}, []);

}

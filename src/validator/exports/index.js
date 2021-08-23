const ExportSongPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/invariant-error');

const ExportsValidator = {
    validateExportSongsPayload: (payload) => {
        const validationResult = ExportSongPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;

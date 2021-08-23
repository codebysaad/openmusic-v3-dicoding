const { PostAuthenticationPayloadSchema, UpdateAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariant-error');
   
const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
      const validationResult = PostAuthenticationPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
    validatePutAuthenticationPayload: (payload) => {
      const validationResult = UpdateAuthenticationPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
    validateDeleteAuthenticationPayload: (payload) => {
      const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
};
   
module.exports = AuthenticationsValidator;

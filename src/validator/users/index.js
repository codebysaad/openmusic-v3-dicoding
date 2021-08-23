const InvariantError = require('../../exceptions/invariant-error');
const { UsersPayloadSchema } = require('./schema');
 
const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UsersPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;

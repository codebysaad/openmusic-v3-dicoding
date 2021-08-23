const ClientError = require('./client-error');
const { statusCode } = require('../helpers/constanta');

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, statusCode.forbidden);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;

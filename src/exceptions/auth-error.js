const ClientError = require('./client-error');
const { statusCode } = require('../helpers/constanta');
 
class AuthenticationsError extends ClientError {
  constructor(message) {
    super(message, statusCode.unauthorized);
    this.name = 'AuthenticationsError';
  }
}
 
module.exports = AuthenticationsError;

/* eslint-disable no-unused-vars */
const { success, statusCode, statusMessage, errorVar } = require('../../helpers/constanta');
const ClientError = require('../../exceptions/client-error');

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;
        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.updateAuthenticationHandler = this.updateAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }
  
    async postAuthenticationHandler({ payload }, h) {
        try {
            this._validator.validatePostAuthenticationPayload(payload);
            const { username, password } = payload;
            const id = await this._usersService.verifyUserCredential(username, password);
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });
        
            await this._authenticationsService.addRefreshToken(refreshToken);
        
            const response = h.response({
                status: success,
                message: statusMessage.authSuccess,
                data: {
                    accessToken,
                    refreshToken,
                },
            });
            response.code(statusCode.saved);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Fail
            const response = h.response({
                status: errorVar,
                message: statusMessage.serverFail,
            });
            response.code(statusCode.error);
            console.error(error);
            return response;
        }
    }
  
    async updateAuthenticationHandler(request, h) {
        try {
            this._validator.validatePutAuthenticationPayload(request.payload);
            const { refreshToken } = request.payload;
        
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
        
            const accessToken = this._tokenManager.generateAccessToken({ id });
            return {
                status: success,
                message: statusMessage.tokenUpdated,
                data: {
                    accessToken,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Fail
            const response = h.response({
                status: errorVar,
                message: statusMessage.serverFail,
            });
            response.code(statusCode.error);
            console.error(error);
            return response;
        }
    }
  
    async deleteAuthenticationHandler(request, h) {
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload);
        
            const { refreshToken } = request.payload;
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            await this._authenticationsService.deleteRefreshToken(refreshToken);
        
            return {
                status: success,
                message: statusMessage.refreshTokenDeleted,
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Fail
            const response = h.response({
                status: errorVar,
                message: statusMessage.serverFail,
            });
            response.code(statusCode.error);
            console.error(error);
            return response;
        }
    }
}
  
module.exports = AuthenticationsHandler;

const ClientError = require('../../exceptions/client-error');
const { success, statusCode, statusMessage, errorVar, fail } = require('../../helpers/constanta');

class UploadsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        try {
            const { data } = request.payload;
            this._validator.validateImageHeaders(data.hapi.headers);

            const fileName = await this._service.writeFile(data, data.hapi);

            const response = h.response({
                status: success,
                message: statusMessage.pictureUploadedSuccess,
                data: {
                    pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${fileName}`,
                },
            });

            response.code(statusCode.saved);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: fail,
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

module.exports = UploadsHandler;

const ClientError = require('../../exceptions/client-error');
const { success, statusCode, statusMessage, errorVar, fail } = require('../../helpers/constanta');

class ExportsHandler {
    constructor(service, validator, playlistService) {
        this._service = service;
        this._validator = validator;
        this._playlistService = playlistService;

        this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
    }

    async postExportSongsHandler(request, h) { 
        try {
            this._validator.validateExportSongsPayload(request.payload);
            const { playlistId } = request.params;
            const { id: userId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistAccess(playlistId, userId);

            const message = {
                playlistId,
                targetEmail: request.payload.targetEmail,
            };

            await this._service.sendMessage('export:playlists', JSON.stringify(message));

            const response = h.response({
                status: success,
                message: statusMessage.reqInQueue,
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

module.exports = ExportsHandler;

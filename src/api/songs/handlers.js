const ClientError = require('../../exceptions/client-error');
const { success, fail, errorVar, statusCode, statusMessage } = require('../../helpers/constanta');

class SongsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
  
      this.postSongHandler = this.postSongHandler.bind(this);
      this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
          this._validator.validateSongPayload(request.payload);
    
          const songId = await this._service.addSong(request.payload);
    
          const response = h.response({
            status: success,
            message: statusMessage.saveSuccessful,
            data: {
                songId,
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
     
          const response = h.response({
            status: errorVar,
            message: statusMessage.serverFail,
          });
          response.code(statusCode.error);
          console.error(error);
          return response;
        }
      }

    async getAllSongsHandler() {
        const songs = await this._service.getAllSongs();
        return {
          status: success,
          data: {
            songs,
          },
        };
      }

    async getSongByIdHandler(request, h) {
        try {
          const { id } = request.params;
          const song = await this._service.getSongById(id);
          return {
            status: success,
            data: {
                song,
            },
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: fail,
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
     
          const response = h.response({
            status: errorVar,
            message: statusMessage.serverFail,
          });
          response.code(statusCode.error);
          console.error(error);
          return response;
        }
      }

    async putSongByIdHandler(request, h) {
        try {
          this._validator.validateSongPayload(request.payload);
          const { title, year, performer, genre, duration } = request.payload;
          const { id } = request.params;
     
          await this._service.updateSongById(id, { title, year, performer, genre, duration });
     
          return {
            status: success,
            message: statusMessage.updateSuccessful,
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: fail,
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
     
          const response = h.response({
            status: errorVar,
            message: statusMessage.serverFail,
          });
          response.code(statusCode.error);
          console.error(error);
          return response;
        }
      }

    async deleteSongByIdHandler(request, h) {
        try {
          const { id } = request.params;
          await this._service.deleteSongById(id);
          return {
            status: success,
            message: statusMessage.deleteSuccessful,
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: fail,
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
          
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
module.exports = SongsHandler;

/* eslint-disable no-unused-vars */
const { success, statusCode, statusMessage, errorVar } = require('../../helpers/constanta');
const ClientError = require('../../exceptions/client-error');

class CollaborationsHandler {
    constructor(collaborationsService, playlistService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistService = playlistService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }
    
    async postCollaborationHandler(request, h) {
      try {
        this._validator.validateCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;
        this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
        
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);
        
        const response = h.response({
            status: success,
            message: statusMessage.addCollaborationsSuccess,
            data: {
                collaborationId,
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
  
    async deleteCollaborationHandler(request, h) { 
      try {
        this._validator.validateCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;
  
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);
  
        return {
          status: success,
          message: statusMessage.collaborationsDeleted,
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
  
module.exports = CollaborationsHandler;

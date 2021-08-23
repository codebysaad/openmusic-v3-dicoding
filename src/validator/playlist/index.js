const { PostPlaylistPayloadSchema, PostSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariant-error');
  
const PlaylistValidator = {
    validatePostPlaylistPayload: (payload) => {
      const validationResult = PostPlaylistPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },

    validatePostSongPayload: (payload) => {
      const validationResult = PostSongPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
  };
  
module.exports = PlaylistValidator;

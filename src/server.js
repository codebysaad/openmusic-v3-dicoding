require('dotenv').config();

// Import External Plugin
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Client Error
const ClientError = require('./exceptions/client-error');

// Import Plugin Songs
const songs = require('./api/songs');
const SongsServices = require('./services/postgres/song-services');
const SongsValidator = require('./validator/songs');

// Import Plugin Users
const users = require('./api/user');
const UsersService = require('./services/postgres/users-service');
const UsersValidator = require('./validator/users');

// Import Plugin Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/auths-service');
const TokenManager = require('./tokenize/token-manager');
const AuthenticationsValidator = require('./validator/authentications');

// Import Plugin Playlists
const playlist = require('./api/playlist');
const PlaylistService = require('./services/postgres/playlist-service');
const PlaylistValidator = require('./validator/playlist');

// Import Plugin Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/collaborations-service');
const CollaborationsValidator = require('./validator/collaborations');

// Import Plugin Export
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/producer-service');
const ExportsValidator = require('./validator/exports');

// Import Plugin Uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/storage-service');
const UploadsValidator = require('./validator/uploads');

// Import CacheService
const CacheService = require('./services/redis/cache-service');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsServices();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistService = new PlaylistService(collaborationsService, cacheService); 
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/pictures'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // External plugin
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // JWT auth strategy
  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },

    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },

    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },

    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },

    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },

    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistService,
        validator: CollaborationsValidator,
      },
    },

    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistService,
      },
    },

    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
  
    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
  
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

const success = 'success';
const fail = 'fail';
const errorVar = 'error';
const untitled = 'untitled';
const song = 'song-';
const statusCode = {
    success: 200,
    error: 500,
    notfound: 404,
    unauthorized: 401,
    conflict: 409,
    saved: 201,
    badRequest: 400,
    nocontent: 204,
    forbidden: 403,
};
const statusMessage = {
    saveSuccessful: 'Lagu berhasil ditambahkan',
    saveUnsuccessful: 'Lagu gagal ditambahkan',
    songNotFound: 'Lagu tidak ditemukan',
    serverFail: 'Maaf, terjadi kegagalan pada server kami.',
    updateSuccessful: 'Lagu berhasil diperbarui',
    updateIdNotFound: 'Gagal memperbarui lagu. Id lagu tidak ditemukan',
    deleteSuccessful: 'Lagu berhasil dihapus',
    deleteIdNotFound: 'Lagu gagal dihapus. Id tidak ditemukan',
    authSuccess: 'Authentication berhasil ditambahkan',
    tokenUpdated: 'Access Token berhasil diperbarui',
    refreshTokenDeleted: 'Refresh token berhasil dihapus',
    addCollaborationsSuccess: 'Kolaborasi berhasil ditambahkan',
    collaborationsDeleted: 'Kolaborasi berhasil dihapus',
    addPlaylistSuccess: 'Playlist berhasil ditambahkan',
    playlistDeleted: 'Playlist berhasil dihapus',
    songAddPlaylistSuccess: 'Lagu berhasil ditambahkan ke playlist',
    songDeletedFromPlaylist: 'Lagu berhasil dihapus dari playlist',
    addUserSuccess: 'User berhasil ditambahkan',
    refreshTokenInvalid: 'Refresh token tidak valid',
    pictureUploadedSuccess: 'Gambar berhasil diunggah',
    reqInQueue: 'Permintaan Anda dalam antrean',
};

module.exports = { success, fail, errorVar, untitled, statusCode, statusMessage, song };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeTokens = exports.deleteRefreshToken = exports.findRefreshTokenById = exports.addRefreshTokenToWhitelist = void 0;
var database_1 = require("../app/database");
var hashToken_1 = require("../app/hashToken");
var addRefreshTokenToWhitelist = function (_a) {
    var jti = _a.jti, refreshToken = _a.refreshToken, userId = _a.userId;
    return database_1.db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: (0, hashToken_1.hashToken)(refreshToken),
            userId: userId,
        },
    });
};
exports.addRefreshTokenToWhitelist = addRefreshTokenToWhitelist;
// used to check if the token sent by the client is in the database.
var findRefreshTokenById = function (id) {
    return database_1.db.refreshToken.findUnique({
        where: {
            id: id,
        },
    });
};
exports.findRefreshTokenById = findRefreshTokenById;
// soft delete tokens after usage.
var deleteRefreshToken = function (id) {
    return database_1.db.refreshToken.update({
        where: {
            id: id,
        },
        data: {
            revoked: true,
        },
    });
};
exports.deleteRefreshToken = deleteRefreshToken;
var revokeTokens = function (userId) {
    return database_1.db.refreshToken.updateMany({
        where: {
            userId: userId,
        },
        data: {
            revoked: true,
        },
    });
};
exports.revokeTokens = revokeTokens;

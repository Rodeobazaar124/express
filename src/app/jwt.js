"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateAccessToken = function (user) {
    return jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '5m',
    });
};
exports.generateAccessToken = generateAccessToken;
var generateRefreshToken = function (user, jti) {
    return jsonwebtoken_1.default.sign({ userId: user.id, jti: jti }, process.env.JWT_REFRESH_SECRET, { expiresIn: '8h' });
};
exports.generateRefreshToken = generateRefreshToken;
var generateTokens = function (user, jti) {
    var accessToken = (0, exports.generateAccessToken)(user);
    var refreshToken = (0, exports.generateRefreshToken)(user, jti);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};
exports.generateTokens = generateTokens;

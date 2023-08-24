"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = void 0;
var crypto_1 = require("crypto");
var hashToken = function (token) {
    return crypto_1.default.createHash("sha512").update(token).digest("hex");
};
exports.hashToken = hashToken;

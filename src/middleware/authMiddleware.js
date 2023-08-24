"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var isAuthenticated = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401);
        throw new Error("🚫 Un-Authorized 🚫");
    }
    try {
        var token = authorization.split(" ")[1];
        var payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req.payload = payload;
    }
    catch (err) {
        res.status(401);
        if (err.name === "TokenExpiredError") {
            throw new Error(err.name);
        }
        throw new Error("🚫 Un-Authorized 🚫");
    }
    return next();
};
exports.isAuthenticated = isAuthenticated;

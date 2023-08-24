"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.createUserByEmailAndPassword = exports.findUserByEmail = void 0;
var bcrypt_1 = require("bcrypt");
var database_1 = require("../app/database");
var findUserByEmail = function (email) {
    return database_1.db.user.findUnique({
        where: {
            email: email,
        },
    });
};
exports.findUserByEmail = findUserByEmail;
var createUserByEmailAndPassword = function (user) {
    user.password = bcrypt_1.default.hashSync(user.password, 12);
    return database_1.db.user.create({
        data: user,
    });
};
exports.createUserByEmailAndPassword = createUserByEmailAndPassword;
var findUserById = function (id) {
    return database_1.db.user.findUnique({
        where: {
            id: id,
        },
    });
};
exports.findUserById = findUserById;

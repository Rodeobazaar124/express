"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonyValidation = void 0;
var joi_1 = require("joi");
exports.TestimonyValidation = joi_1.default.object({
    username: joi_1.default.string().max(64).required(),
    location: joi_1.default.string().max(64).required(),
    comment: joi_1.default.string().max(255).required(),
    rating: joi_1.default.number().required(),
});

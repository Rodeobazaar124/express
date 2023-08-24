"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidation = void 0;
var joi_1 = require("joi");
exports.ServiceValidation = joi_1.default.object({
    title: joi_1.default.string().max(50).required(),
    desc: joi_1.default.string().min(10).optional(),
    link: joi_1.default.string().required(),
});

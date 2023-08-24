"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroValidation = void 0;
var joi_1 = require("joi");
exports.HeroValidation = joi_1.default.object({
    number: joi_1.default.number().positive().optional(),
    position: joi_1.default.string().max(5).min(4).lowercase().optional(),
    text: joi_1.default.string().lowercase().required(),
    hText: joi_1.default.string().optional(),
    desc: joi_1.default.string().min(10).required().optional(),
});

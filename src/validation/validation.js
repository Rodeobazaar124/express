"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.IdValidation = void 0;
var joi_1 = require("joi");
exports.IdValidation = joi_1.default.number().min(1).positive().required();
var validate = function (schema, request, res) {
    var result = schema.validate(request, {
        abortEarly: false,
    });
    if (result.error) {
        var errorMessage = result.error.details
            .map(function (detail) { return detail.message; })
            .join(", ");
        res.status(400).json({ error: errorMessage });
        return null;
    }
    else {
        return result.value;
    }
};
exports.validate = validate;

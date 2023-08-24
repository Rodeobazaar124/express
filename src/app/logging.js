"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var winston_1 = require("winston");
exports.logger = winston_1.default.createLogger({
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console({})],
});

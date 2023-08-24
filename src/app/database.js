"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var client_1 = require("@prisma/client");
var logging_1 = require("./logging");
exports.db = new client_1.PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
    errorFormat: "minimal",
});
exports.db.$on("error", function (e) {
    logging_1.logger.error(e);
});
exports.db.$on("warn", function (w) {
    logging_1.logger.warn(w);
});
exports.db.$on("info", function (i) {
    logging_1.logger.info(i);
});
exports.db.$on("query", function (q) {
    logging_1.logger.info(q);
});

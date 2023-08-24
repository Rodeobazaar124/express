"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrCreateFolder = void 0;
var server_1 = require("./app/server");
var server_2 = require("./app/server");
var fs_1 = require("fs");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var logging_1 = require("./app/logging");
var checkOrCreateFolder = function (folder) {
    if (!fs_1.default.existsSync(folder)) {
        promises_1.default.mkdir(path_1.default.join(folder));
    }
};
exports.checkOrCreateFolder = checkOrCreateFolder;
try {
    var publicdir = path_1.default.join(__dirname, "..", "public");
    (0, exports.checkOrCreateFolder)(publicdir);
    (0, exports.checkOrCreateFolder)(path_1.default.join(publicdir, "images"));
    (0, exports.checkOrCreateFolder)(path_1.default.join(publicdir, "images", "avatars"));
    (0, exports.checkOrCreateFolder)(path_1.default.join(publicdir, "images", "partners"));
    (0, exports.checkOrCreateFolder)(path_1.default.join(publicdir, "images", "products"));
    (0, exports.checkOrCreateFolder)(path_1.default.join(publicdir, "images", "services"));
    (0, exports.checkOrCreateFolder)(path_1.default.join(publicdir, "images", "portofolios"));
}
catch (error) {
    logging_1.logger.error(error);
}
server_1.app.listen(server_2.PORT, function () {
    console.log("[Server] We're up on http://localhost:".concat(server_2.PORT, " sir!"));
});

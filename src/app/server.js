"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.app = void 0;
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
var express_fileupload_1 = require("express-fileupload");
var path_1 = require("path");
// require("./passport");
var AuthRoutes_1 = require("../routes/AuthRoutes");
var error_middleware_1 = require("../middleware/error-middleware");
var public_api_1 = require("../routes/public-api");
var api_1 = require("../routes/api");
exports.app = (0, express_1.default)();
exports.PORT = process.env.PORT || 8080 || 3000;
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
exports.app.use((0, cors_1.default)()
//   {
//   origin: "http://localhost:8000",
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true,
// }
);
exports.app.use(express_1.default.json());
exports.app.use((0, express_fileupload_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "public")));
// app.use("/Testimonies", TestimoniesRoutes);
exports.app.use("/api", api_1.default);
exports.app.use("/api", public_api_1.default);
exports.app.use("/api/auth", AuthRoutes_1.AuthRoutes);
exports.app.use(error_middleware_1.errorMiddleware);
exports.app.get("/*", function (req, res) {
    res.status(404).sendFile(path_1.default.join(__dirname, "..", "views", "404.html"));
});

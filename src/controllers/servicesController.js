"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.get = void 0;
var path_1 = require("path");
var moment_1 = require("moment");
var promises_1 = require("fs/promises");
var fs_1 = require("fs");
var database_1 = require("../app/database");
var validation_1 = require("../validation/validation");
var ServiceValidation_1 = require("../validation/ServiceValidation");
var service = database_1.db.service;
var dirname = "services";
var get = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var results_1, results, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.params.id) return [3 /*break*/, 2];
                return [4 /*yield*/, service.findMany()];
            case 1:
                results_1 = _a.sent();
                return [2 /*return*/, res.status(200).json({ data: results_1 })];
            case 2: return [4 /*yield*/, service.findFirst({
                    where: {
                        id: parseInt(req.params.id),
                    },
                })];
            case 3:
                results = _a.sent();
                if (results === null) {
                    return [2 /*return*/, res.status(404).json({ errors: "Data Not Found" })];
                }
                return [2 /*return*/, res.status(200).json({ data: results })];
            case 4:
                e_1 = _a.sent();
                next(e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get = get;
var create = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var valbody, ProductExist, file, filesize, ext, filename, url, allowedType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valbody = (0, validation_1.validate)(ServiceValidation_1.ServiceValidation, req.body, res);
                if (valbody === null) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, service.count({
                        where: {
                            title: { contains: valbody.title },
                        },
                    })];
            case 1:
                ProductExist = _a.sent();
                if (ProductExist > 1)
                    return [2 /*return*/, res.status(409).json({ error: "Product already exist" })];
                if (req.files === null) {
                    return [2 /*return*/, res.status(400).json({
                            error: {
                                code: "MISSING_LOGO",
                                message: "Bad Request: An image file is required for this operation.",
                                details: "Please make sure to include a valid image file in the 'logo' field.",
                            },
                        })];
                }
                file = req.files.logo;
                filesize = file.data.length;
                ext = path_1.default.extname(file.name);
                filename = file.md5 + (0, moment_1.default)().format("DDMMYYY-h_mm_ss") + ext;
                url = "".concat(process.env.PROTOCOL).concat(process.env.HOST, "/images/").concat(dirname, "/").concat(filename);
                allowedType = [".png", ".jpg", ".svg"];
                if (!allowedType.includes(ext.toLowerCase()))
                    return [2 /*return*/, res.status(422).json({ message: "File Type Unsupported" })];
                // Validasi ukuran file
                if (filesize > 5000000)
                    return [2 /*return*/, res.status(422).json({ message: "File too big" })];
                // Menyimpan file
                file.mv(path_1.default.join(__dirname, "..", "..", "public", "images", dirname, filename), function (err) { return __awaiter(void 0, void 0, void 0, function () {
                    var e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err)
                                    return [2 /*return*/, res.status(500).json({ messages: "".concat(err.message) })];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, service.create({
                                        data: {
                                            title: req.body.title,
                                            logo: url,
                                            desc: req.body.desc,
                                            link: req.body.link,
                                            filename: filename,
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                res.status(201).json({ message: "Created successfully" });
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                next(e_2);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var update = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var valbody, theServices, newfile, filesize, ext, filename, newurl, allowedType, filename_fromdb, filepath, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                valbody = (0, validation_1.validate)(ServiceValidation_1.ServiceValidation, req.body, res);
                if (valbody === null) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, service.findFirst({
                        where: { id: parseInt(req.params.id) },
                    })];
            case 1:
                theServices = _a.sent();
                if (theServices === null) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Data ".concat(req.params.id, " Not exist!") })];
                }
                // Validate files
                if (req.files == null)
                    return [2 /*return*/, res.status(400).json({
                            error: true,
                            message: "Image upload required",
                            details: "Image must be uploaded in the 'logo' property",
                        })];
                newfile = req.files.logo;
                filesize = newfile.data.length;
                ext = path_1.default.extname(newfile.name);
                filename = newfile.md5 + (0, moment_1.default)().format("DDMMYYY-h_mm_ss") + ext;
                newurl = "".concat(process.env.PROTOCOL).concat(process.env.HOST, "/images/").concat(dirname, "/").concat(filename);
                allowedType = [".png", ".jpg", ".svg"];
                if (!allowedType.includes(ext.toLowerCase()))
                    return [2 /*return*/, res.status(422).json({ message: "File Type Unsupported" })];
                if (filesize > 5000000)
                    return [2 /*return*/, res.status(422).json({ message: "File too big" })];
                newfile.mv(path_1.default.join(__dirname, "..", "..", "public", "images", dirname, filename));
                // set the data
                return [4 /*yield*/, service.update({
                        data: {
                            desc: req.body.desc,
                            title: req.body.title,
                            logo: newurl,
                            link: req.body.link,
                        },
                        where: { id: parseInt(req.params.id) },
                    })];
            case 2:
                // set the data
                _a.sent();
                filename_fromdb = theServices.filename;
                filepath = path_1.default.join(__dirname, "..", "..", "public", "images", dirname, filename_fromdb);
                if (!fs_1.default.existsSync(filepath)) return [3 /*break*/, 4];
                return [4 /*yield*/, promises_1.default.unlink(filepath)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, res.status(200).json({ message: "Data Updated Succesfully" })];
            case 5:
                e_3 = _a.sent();
                next(e_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var remove = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedIds, Service, filename, filepath, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                validatedIds = (0, validation_1.validate)(validation_1.IdValidation, req.params.id, res);
                if (validatedIds === null) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, service.findFirst({
                        where: { id: validatedIds },
                    })];
            case 1:
                Service = _a.sent();
                if (Service === null) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Data ".concat(req.params.id, " Not exist!") })];
                }
                return [4 /*yield*/, service.delete({ where: { id: parseInt(req.params.id) } })];
            case 2:
                _a.sent();
                filename = Service.filename;
                filepath = path_1.default.join(__dirname, "..", "..", "public", "images", dirname, filename);
                if (!fs_1.default.existsSync(filepath)) return [3 /*break*/, 4];
                return [4 /*yield*/, promises_1.default.unlink(filepath)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.status(200).json({ message: "Deleted Successfully" });
                return [3 /*break*/, 6];
            case 5:
                e_4 = _a.sent();
                next(e_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.remove = remove;

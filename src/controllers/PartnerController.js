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
var partner = database_1.db.partnership;
var name = "partners";
var get = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var results, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.params.id) return [3 /*break*/, 2];
                return [4 /*yield*/, partner.findMany()];
            case 1:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json({ data: results })];
            case 2: return [4 /*yield*/, partner.findFirst({
                    where: {
                        id: parseInt(req.params.id),
                    },
                })];
            case 3:
                result = _a.sent();
                if (result === null) {
                    return [2 /*return*/, res.status(404).json({ errors: "Data Not Found" })];
                }
                return [2 /*return*/, res.status(200).json({ data: result })];
            case 4:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get = get;
var create = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var ProductExist, file, filesize, ext, filename, url, allowedType, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!req.body.name) {
                    return [2 /*return*/, res.status(400).json({ errors: "Field `name` must defined" })];
                }
                return [4 /*yield*/, partner.count({
                        where: {
                            name: { contains: req.body.name },
                        },
                    })];
            case 1:
                ProductExist = _a.sent();
                if (ProductExist > 1)
                    return [2 /*return*/, res.status(409).json({ error: "Partner already exist" })];
                if (req.files === null) {
                    return [2 /*return*/, res.status(400).json({
                            error: {
                                code: "MISSING_IMAGE",
                                message: "Bad Request: An image file is required for this operation.",
                                details: "Please make sure to include a valid image file in the 'image' field.",
                            },
                        })];
                }
                file = req.files.image;
                filesize = file.data.length;
                ext = path_1.default.extname(file.name);
                filename = req.body.name.replace(" ", "_") +
                    (0, moment_1.default)().format("DDMMYYY-h_mm_ss") +
                    ext;
                url = "".concat(process.env.PROTOCOL).concat(process.env.HOST, "/images/").concat(name, "/").concat(filename);
                allowedType = [".png", ".jpg", ".svg"];
                if (!allowedType.includes(ext.toLowerCase()))
                    return [2 /*return*/, res.status(422).json({ message: "File Type Unsupported" })];
                // Validasi ukuran file
                if (filesize > 5000000)
                    return [2 /*return*/, res.status(422).json({ message: "File too big" })];
                // Menyimpan file
                file.mv(path_1.default.join(__dirname, "..", "..", "public", "images", name, filename));
                return [4 /*yield*/, partner.create({
                        data: {
                            name: req.body.name,
                            image: url,
                            filename: filename,
                        },
                    })];
            case 2:
                _a.sent();
                res.status(201).json({ message: "Created successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var update = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var thatOnePartner, newfile, filesize, ext, filename, newurl, allowedType, filename_fromdb, filepath, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!req.body.name) {
                    return [2 /*return*/, res.status(400).json({ errors: "Field `name` must defined" })];
                }
                return [4 /*yield*/, partner.findFirst({
                        where: { id: parseInt(req.params.id) },
                    })];
            case 1:
                thatOnePartner = _a.sent();
                if (thatOnePartner === null) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Partner ".concat(req.params.id, " Not exist!") })];
                }
                // Validate files
                if (req.files === null)
                    return [2 /*return*/, res.status(400).json({
                            error: true,
                            message: "Image upload required",
                            details: "Image must be uploaded in the 'image' property",
                        })];
                newfile = req.files.image;
                filesize = newfile.data.length;
                ext = path_1.default.extname(newfile.name);
                filename = req.body.name.replace(" ", "_") +
                    (0, moment_1.default)().format("DDMMYYY-h_mm_ss") +
                    ext;
                newurl = "".concat(process.env.PROTOCOL).concat(process.env.HOST, "/images/").concat(name, "/").concat(filename);
                allowedType = [".png", ".jpg", ".svg"];
                if (!allowedType.includes(ext.toLowerCase()))
                    return [2 /*return*/, res.status(422).json({ message: "File Type Unsupported" })];
                if (filesize > 5000000)
                    return [2 /*return*/, res.status(422).json({ message: "File too big" })];
                newfile.mv(path_1.default.join(__dirname, "..", "..", "public", "images", name, filename), function (err) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (err)
                            return [2 /*return*/, res.status(500).json({ messages: "Can't save file" })];
                        return [2 /*return*/];
                    });
                }); });
                // set the data
                return [4 /*yield*/, partner.update({
                        data: {
                            name: req.body.name,
                            image: newurl,
                        },
                        where: {
                            id: parseInt(req.params.id),
                        },
                    })];
            case 2:
                // set the data
                _a.sent();
                filename_fromdb = thatOnePartner.filename;
                filepath = path_1.default.join(__dirname, "..", "..", "public", "images", name, filename_fromdb);
                if (!fs_1.default.existsSync(filepath)) return [3 /*break*/, 4];
                return [4 /*yield*/, promises_1.default.unlink(filepath)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, res.status(200).json({ message: "Data Updated Succesfully" })];
            case 5:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var remove = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedIds, thatOneParner, filename, filepath, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                validatedIds = (0, validation_1.validate)(validation_1.IdValidation, req.params.id, res);
                if (validatedIds === null) {
                    return [2 /*return*/];
                }
                if (validatedIds === null) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, partner.findFirst({
                        where: { id: validatedIds },
                    })];
            case 1:
                thatOneParner = _a.sent();
                if (thatOneParner === null) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Data ".concat(req.params.id, " Not exist!") })];
                }
                return [4 /*yield*/, partner.delete({ where: { id: parseInt(req.params.id) } })];
            case 2:
                _a.sent();
                filename = thatOneParner.filename;
                filepath = path_1.default.join(__dirname, "..", "..", "public", "images", name, filename);
                if (!fs_1.default.existsSync(filepath)) return [3 /*break*/, 4];
                return [4 /*yield*/, promises_1.default.unlink(filepath)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.status(200).json({ message: "Deleted Successfully" });
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                next(e_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.remove = remove;

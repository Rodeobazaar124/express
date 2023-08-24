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
var database_1 = require("../app/database");
var validation_1 = require("../validation/validation");
var HeroValidation_1 = require("../validation/HeroValidation");
var hero = database_1.db.hero;
var get = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var left, right, _a, hasilLeft, hasilRight, parsedId, hasilId, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                if (!!req.params.id) return [3 /*break*/, 3];
                return [4 /*yield*/, hero.findMany({ where: { position: "Left" } })];
            case 1:
                left = _b.sent();
                return [4 /*yield*/, hero.findMany({ where: { position: "Right" } })];
            case 2:
                right = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        data: {
                            left: left,
                            right: right,
                        },
                    })];
            case 3:
                _a = req.params.id.toLowerCase();
                switch (_a) {
                    case "left": return [3 /*break*/, 4];
                    case "right": return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, hero.findMany({
                    where: { position: "Left" },
                })];
            case 5:
                hasilLeft = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: hasilLeft })];
            case 6: return [4 /*yield*/, hero.findMany({
                    where: { position: "Right" },
                })];
            case 7:
                hasilRight = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: hasilRight })];
            case 8:
                parsedId = parseInt(req.params.id);
                if (!!isNaN(parsedId)) return [3 /*break*/, 10];
                return [4 /*yield*/, hero.findMany({
                        where: { id: parsedId },
                    })];
            case 9:
                hasilId = _b.sent();
                if (hasilId === null) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ errors: "Hero with ID ".concat(parsedId, " does not found") })];
                }
                return [2 /*return*/, res.status(200).json({ data: hasilId })];
            case 10: return [2 /*return*/, res.status(400).json({ error: "Invalid ID format" })];
            case 11: return [3 /*break*/, 13];
            case 12:
                error_1 = _b.sent();
                return [2 /*return*/, next(error_1)];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.get = get;
var create = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var valbody, _a, result, error_2, result, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                valbody = (0, validation_1.validate)(HeroValidation_1.HeroValidation, req.body, res);
                if (valbody === null) {
                    return [2 /*return*/];
                }
                _a = req.params.id.toLowerCase();
                switch (_a) {
                    case "left": return [3 /*break*/, 1];
                    case "right": return [3 /*break*/, 5];
                }
                return [3 /*break*/, 9];
            case 1:
                valbody.position = "left";
                if (!valbody.hText || !valbody.desc) {
                    return [2 /*return*/, res.status(400).json({
                            error: "'desc' and `hText` field must exist for left hero",
                        })];
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, hero.create({
                        data: valbody,
                    })];
            case 3:
                result = _b.sent();
                // Handle successful creation
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: "Hero created successfully", data: result })];
            case 4:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5:
                valbody.position = "right";
                if (!valbody.number) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Number should exist for right hero",
                        })];
                }
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, hero.create({
                        data: valbody,
                    })];
            case 7:
                result = _b.sent();
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: "Hero created successfully", data: result })];
            case 8:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, res.status(400).json({ error: "Invalid position" })];
        }
    });
}); };
exports.create = create;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valbody, valIds, theProduct, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valbody = (0, validation_1.validate)(HeroValidation_1.HeroValidation, req.body, res);
                valIds = (0, validation_1.validate)(validation_1.IdValidation, req.params.id, res);
                if (valbody === null) {
                    return [2 /*return*/];
                }
                if (valIds === null)
                    return [2 /*return*/];
                return [4 /*yield*/, hero.findFirst({
                        where: { id: parseInt(req.params.id) },
                    })];
            case 1:
                theProduct = _a.sent();
                if (theProduct === null) {
                    return [2 /*return*/, res.status(400).json({ error: "Data ".concat(req.params.id, " Not exist!") })];
                }
                return [4 /*yield*/, hero.update({
                        where: { id: parseInt(valIds) },
                        data: valbody,
                    })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json({ msg: "success", data: result })];
        }
    });
}); };
exports.update = update;
var remove = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valIds, check;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valIds = (0, validation_1.validate)(validation_1.IdValidation, req.params.id, res);
                if (valIds === null)
                    return [2 /*return*/];
                return [4 /*yield*/, hero.findFirst({ where: { id: valIds } })];
            case 1:
                check = _a.sent();
                if (check === null) {
                    return [2 /*return*/, res.status(400).json({ error: "ID ".concat(valIds, " Not exist!") })];
                }
                return [4 /*yield*/, hero.delete({ where: { id: valIds } })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ msg: "data deleted", data: check })];
        }
    });
}); };
exports.remove = remove;

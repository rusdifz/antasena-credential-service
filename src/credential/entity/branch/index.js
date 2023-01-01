"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const branch_1 = __importDefault(require("./branch"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
const makeBranch = (0, branch_1.default)(moment_timezone_1.default);
exports.default = makeBranch;

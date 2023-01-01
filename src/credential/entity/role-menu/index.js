"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_menu_1 = __importDefault(require("./role-menu"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
const makeRoleMenu = (0, role_menu_1.default)(moment_timezone_1.default);
exports.default = makeRoleMenu;

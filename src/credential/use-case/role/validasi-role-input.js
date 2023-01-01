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
Object.defineProperty(exports, "__esModule", { value: true });
function makeValidasiRoleInput({ roleDb, makeRole }) {
    return function validasiRoleInput(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const role = yield makeRole(body);
                let info;
                if (body.method == 'PUT') {
                    info = 'create';
                }
                else {
                    info = 'update';
                }
                const validasiBusiness = yield roleDb.validasiRole(Object.assign(Object.assign({}, role), { info: info }));
                if (validasiBusiness.status == true) {
                    result = {
                        status: true,
                        responseCode: 200,
                        data: "OK"
                    };
                }
                else {
                    result = {
                        status: false,
                        responseCode: validasiBusiness.responseCode,
                        data: validasiBusiness.data
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    };
}
exports.default = makeValidasiRoleInput;

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
function makeValidasiBranchInput({ branchDb, makeBranch }) {
    return function validasiBranchInput(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                let info;
                if (body.method == 'PUT') {
                    info = 'create';
                }
                else {
                    info = 'update';
                }
                const branch = yield makeBranch(body);
                const validasiBusiness = yield branchDb.validasiBranch(Object.assign(Object.assign({}, branch), { info: info }));
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
                        responseCode: 406,
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
exports.default = makeValidasiBranchInput;

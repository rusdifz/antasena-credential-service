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
function makeGetBranchDetail({ branchDb, moment }) {
    return function getBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBranch = yield branchDb.getDataBranchDetail(body);
                let result;
                if (getBranch.status == true) {
                    let branch;
                    if (getBranch.responseCode == 200) {
                        const createdTime = moment(getBranch.data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        let updatedTime;
                        if (getBranch.data.updatedTime == null) {
                            updatedTime = null;
                        }
                        else {
                            updatedTime = moment(getBranch.data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        }
                        branch = getBranch.data;
                        delete branch.createdTime;
                        delete branch.updatedTime;
                        branch.createdTime = createdTime;
                        branch.updatedTime = updatedTime;
                    }
                    else {
                        branch = getBranch.data;
                    }
                    result = {
                        status: getBranch.status,
                        responseCode: 200,
                        data: branch
                    };
                }
                else {
                    result = getBranch;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getBranchDetail' + error);
            }
        });
    };
}
exports.default = makeGetBranchDetail;

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
function makeInternalCreateBranchDetail({ branchDb, userDb, makeBranch, makeNotification }) {
    return function internalCreateBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branch = yield makeBranch(body);
                const create = yield branchDb.createDataBranchDetail(branch);
                const entityNotif = yield makeNotification({
                    moduleId: branch.getModuleId(),
                    username: branch.getUsernameToken(),
                    title: 'Permintaan Persetujuan Cabang Telah Disetujui Oleh Approver',
                    titleGlob: 'Branch Approval Request Has Been Approved By Approver',
                    message: '1 Cabang',
                    messageGlob: '1 Branch',
                    status: 0
                });
                const sendNotification = yield userDb.inputDataNotification(entityNotif);
                console.log('sendNotif', sendNotification);
                const result = {
                    status: create.status,
                    responseCode: create.code,
                    data: create.message
                };
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeInternalCreateBranchDetail' + error);
            }
        });
    };
}
exports.default = makeInternalCreateBranchDetail;

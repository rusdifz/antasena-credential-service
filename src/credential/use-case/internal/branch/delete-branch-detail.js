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
function makeInternalDeleteBranchDetail({ branchDb, userDb, makeNotification }) {
    return function internalDeleteBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield branchDb.deleteDataBranchDetail(body);
                const entityNotif = yield makeNotification({
                    moduleId: body.moduleId,
                    username: body.username,
                    title: 'Permintaan Persetujuan Cabang Telah Disetujui Oleh Approver ',
                    titleGlob: 'Branch Approval Request Has Been Approved By Approver',
                    message: body.rowId.length + ' Cabang',
                    messageGlob: body.rowId.length + ' Branch',
                    status: 0
                });
                const sendNotification = yield userDb.inputDataNotification(entityNotif);
                console.log('sendNotif', sendNotification);
                const result = {
                    status: data.status,
                    responseCode: data.code,
                    data: data.message
                };
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeInternalDeleteBranchDetail' + error);
            }
        });
    };
}
exports.default = makeInternalDeleteBranchDetail;

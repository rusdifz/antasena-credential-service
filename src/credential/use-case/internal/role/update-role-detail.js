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
function makeInternalUpdateRoleDetail({ roleDb, makeRole, userDb, makeNotification }) {
    return function internalUpdateRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = {
                    moduleId: body.moduleId,
                    usernameToken: body.username,
                    id: body.id,
                    roleId: body.roleId,
                    roleName: body.roleName,
                    updatedUser: body.updatedUser
                };
                const validasiRole = yield makeRole(body);
                const data = yield roleDb.updateDataRoleDetail(validasiRole);
                const entityNotif = yield makeNotification({
                    moduleId: validasiRole.getModuleId(),
                    username: validasiRole.getUsernameToken(),
                    title: 'Permintaan Persetujuan Role Telah Disetujui Oleh Approver',
                    titleGlob: 'Role Approval Request Has Been Approved By Approver',
                    message: '1 Role',
                    messageGlob: '1 Role',
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
                throw new Error('usecase-makeInternalUpdateRoleDetail' + error);
            }
        });
    };
}
exports.default = makeInternalUpdateRoleDetail;

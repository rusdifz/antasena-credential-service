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
function makeInternalUpdateUserDetailRole({ userDb, makeUser, makeRole, makeNotification }) {
    return function internalUpdateUserDetailRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield makeUser({
                    username: body.user.username,
                    usernameToken: body.username,
                    moduleId: body.moduleId,
                    aView: body.access.view,
                    aCreate: body.access.create,
                    aUpdate: body.access.update,
                    aDelete: body.access.delete
                });
                const checkUserAccess = yield userDb.checkDataUserAccess(user);
                let inputUserAccess;
                if (checkUserAccess == true) {
                    inputUserAccess = yield userDb.updateDataUserAccess(user);
                }
                else {
                    inputUserAccess = yield userDb.createDataUserAccess(user);
                }
                const roles = body.roles.selected;
                let updateRole;
                let roleId = [];
                if (roles.length > 0) {
                    const sql = yield Promise.all(roles.map((data, index) => __awaiter(this, void 0, void 0, function* () {
                        const role = yield makeRole({
                            username: body.user.username,
                            moduleId: body.moduleId,
                            usernameToken: body.usernameToken,
                            roleId: data.roleId,
                            roleName: data.roleName
                        });
                        roleId.push(data.roleId);
                        const checkRole = yield userDb.checkDataRole(role);
                        let info;
                        if (checkRole == true) {
                            info = `UPDATE m_user_role SET
                            role_id = '${role.getRoleId()}', 
                            updated_user = '${role.getUsernameToken()}',
                            updated_time = '${role.getUpdatedTime()}' 
                            WHERE module_id = '${role.getModuleId()}' AND username = '${role.getUsername()}'
                            AND role_id = '${role.getRoleId()}'`;
                        }
                        else {
                            info = `INSERT INTO m_user_role ( module_id, username, role_id, created_user, created_time) 
                          VALUES ('${role.getModuleId()}', '${role.getUsername()}', 
                                  '${role.getRoleId()}', '${role.getUsernameToken()}','${role.getCreatedTime()}')`;
                        }
                        return info;
                    })));
                    updateRole = yield userDb.inputDataRoleSelected({ sql: sql, id: roleId, moduleId: body.moduleId, username: body.user.username });
                }
                else {
                    const temp = {
                        status: 'completed',
                        code: 200
                    };
                    updateRole = temp;
                }
                let result;
                if (inputUserAccess.code == 200 && updateRole.code == 200) {
                    if (roles.length == 0) {
                        yield userDb.deleteDataRoleNotSelected({ moduleId: body.moduleId, username: body.user.username, selected: false });
                    }
                    const entityNotif = yield makeNotification({
                        moduleId: body.moduleId,
                        username: body.usernameToken,
                        title: 'Permintaan Persetujuan Kewenangan Pengguna Telah Disetujui Oleh Approver',
                        titleGlob: 'User Role Approval Request has been Approved By Approver',
                        message: roles.length + ' User',
                        messageGlob: roles.length + ' User',
                        status: 0
                    });
                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                    console.log('sendNotif', sendNotification);
                    result = {
                        status: 'completed',
                        responseCode: 200,
                        data: 'Data updated successfully'
                    };
                }
                else {
                    result = {
                        status: false,
                        responseCode: 400,
                        data: 'Incorrect input'
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeInternalUpdateUserRoleDetail' + error);
            }
        });
    };
}
exports.default = makeInternalUpdateUserDetailRole;

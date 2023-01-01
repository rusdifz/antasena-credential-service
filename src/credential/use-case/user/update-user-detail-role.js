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
function makeUpdateUserDetailRole({ userDb, makeUser, makeRole, makeNotification, internalServer }) {
    return function updateUserDetailRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const checkWorkflow = yield validasiWorkflow(body);
                if (checkWorkflow == true) {
                    const getUserAccessOld = yield userDb.getDataUserAccess({ moduleId: body.moduleId, username: body.user.username });
                    const roleSelectionOld = yield userDb.getDataUserRoleSelection({ moduleId: body.moduleId, username: body.user.username });
                    const roleSelectedOld = yield userDb.getDataUserRoleSelected({ moduleId: body.moduleId, username: body.user.username });
                    const menuDataOld = {
                        user: body.user,
                        access: getUserAccessOld.data,
                        roles: {
                            selection: roleSelectionOld.data,
                            selected: roleSelectedOld.data
                        }
                    };
                    const dataRequest = {
                        username: body.usernameToken,
                        moduleId: body.moduleId,
                        menuId: '003',
                        backendUrl: '/credential/user/detail/role',
                        method: 'POST',
                        menuData: menuDataOld,
                        menuDataNew: {
                            user: body.user,
                            access: body.access,
                            roles: body.roles
                        },
                        keyId: body.user.username,
                        keyName: body.user.fullname
                    };
                    console.log('sebelum workflow');
                    const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                    console.log('workflow req', workflowRequest);
                    if (workflowRequest.status == 'pending') {
                        const getListRole = yield userDb.getListRoleNotifWorkflow();
                        yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                            const entityNotif = yield makeNotification({
                                moduleId: body.moduleId,
                                username: data.username,
                                title: 'Permintaan Persetujuan Kewenangan Pengguna',
                                titleGlob: 'User Role Approval Request',
                                message: '1 Pengguna',
                                messageGlob: '1 User',
                                status: 0
                            });
                            const sendNotification = yield userDb.inputDataNotification(entityNotif);
                            console.log('sendNotif', sendNotification);
                        }));
                        const entityNotif = yield makeNotification({
                            moduleId: body.moduleId,
                            username: body.username,
                            title: 'Data Kewenangan Pengguna berhasil dikirim dan sedang menunggu persetujuan',
                            titleGlob: 'Data User Role sent successfully and waiting for approval ',
                            message: '1 Pengguna',
                            messageGlob: '1 User',
                            status: 0
                        });
                        const sendNotification = yield userDb.inputDataNotification(entityNotif);
                        console.log('sendNotif', sendNotification);
                        result = {
                            status: 'pending',
                            responseCode: 200,
                            data: {
                                locl: 'Data berhasil dikirim dan sedang menunggu persetujuan',
                                glob: 'Data sent successfully and waiting for approval'
                            }
                        };
                    }
                    else if (workflowRequest.status == 'completed') {
                        const user = yield makeUser({
                            username: body.user.username,
                            usernameToken: body.usernameToken,
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
                        // let updateUserAccess = await userDb.updateDataUserAccess(user)
                        const roles = body.roles.selected;
                        let updateRole;
                        let roleId = [];
                        if (roles.length > 0) {
                            console.log('roles ada');
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
                        if (inputUserAccess.code == 200 && updateRole.code == 200) {
                            if (roles.length == 0) {
                                const deleteDataNotSelected = yield userDb.deleteDataRoleNotSelected({ moduleId: body.moduleId, username: body.user.username, selected: false });
                            }
                            const entityNotif = yield makeNotification({
                                moduleId: body.moduleId,
                                username: body.usernameToken,
                                title: 'Kewenangan Pengguna Baru Diperbarui',
                                titleGlob: 'New Updated User Role',
                                message: roles.length + ' User',
                                messageGlob: roles.length + ' User',
                                status: 0
                            });
                            const sendNotification = yield userDb.inputDataNotification(entityNotif);
                            console.log('sendNotif', sendNotification);
                            result = {
                                status: 'completed',
                                responseCode: 200,
                                data: {
                                    locl: 'Pengguna Berhasil Diperbarui',
                                    glob: 'User Updated Successfully'
                                }
                            };
                        }
                        else {
                            result = {
                                status: false,
                                responseCode: 400,
                                data: {
                                    locl: 'Konfigurasi Salah',
                                    glob: 'Wrong Configuration'
                                }
                            };
                        }
                    }
                    else {
                        if (workflowRequest.responseCode == 406) {
                            const errCode = yield userDb.getErrorCode();
                            result = {
                                status: false,
                                responseCode: errCode.responseCode,
                                data: {
                                    locl: errCode.data.local,
                                    glob: errCode.data.global
                                }
                            };
                        }
                        else if (workflowRequest.responseCode == 500) {
                            result = {
                                status: workflowRequest.status,
                                responseCode: workflowRequest.responseCode,
                                data: {
                                    locl: workflowRequest.data,
                                    glob: workflowRequest.data
                                }
                            };
                        }
                        else {
                            result = {
                                status: workflowRequest.status,
                                responseCode: 400,
                                data: {
                                    locl: 'Data Gagal Dikirim',
                                    glob: 'Data Sent Failed'
                                }
                            };
                        }
                    }
                }
                else {
                    const errCode = yield userDb.getErrorCode();
                    result = {
                        status: false,
                        responseCode: errCode.responseCode,
                        data: {
                            locl: errCode.data.local,
                            glob: errCode.data.global
                        }
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    };
    function validasiWorkflow(flow) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '003', backendUrl: '/credential/user/detail/role', method: 'POST' });
                let result;
                if (checkWorkflowOn == true) {
                    console.log('masuk');
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '003', backendUrl: '/credential/user/detail/role' });
                    if (getDataWorkflow.data.length > 0) {
                        console.log('data ada');
                        function validasiId(workflow) {
                            // console.log('role mapping', workflow);
                            return workflow.user.id === flow.user.id;
                        }
                        const find = getDataWorkflow.data.find(validasiId);
                        if (find != undefined) {
                            console.log('data ditemukan', find);
                            result = false;
                        }
                        else {
                            console.log('data tidak di temukan ');
                            result = true;
                        }
                    }
                    else {
                        console.log('data kosong');
                        result = true;
                    }
                }
                else {
                    result = true;
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = makeUpdateUserDetailRole;

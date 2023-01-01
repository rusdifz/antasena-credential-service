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
function makeUpdateRoleMapping({ roleDb, userDb, makeRole, makeNotification, internalServer, moment }) {
    return function updateRoleMapping(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const checkWorkflow = yield validasiWorkflow(body);
                if (checkWorkflow.status == true) {
                    if (checkWorkflow.data == true) {
                        const getDetailRole = yield roleDb.getDataRoleDetail({ rowId: body.id });
                        // let selectedOld:any[] = []
                        let selectedOld = yield roleDb.getDataRoleMenuSelection({ id: body.id });
                        let selectedNew = [];
                        if (body.selected.length > 0) {
                            yield body.selected.map((data) => __awaiter(this, void 0, void 0, function* () {
                                const menuNew = yield roleDb.getDataMenuNew({ menuId: data.menuId });
                                const selected = {
                                    menuId: data.menuId,
                                    menuIcon: menuNew.data.menuIcon,
                                    menuDesc: menuNew.data.menuDesc,
                                    menuDescGlob: menuNew.data.menuDescGlob,
                                    accessView: data.accessView,
                                    accessCreate: data.accessCreate,
                                    accessUpdate: data.accessUpdate,
                                    accessDelete: data.accessDelete,
                                    createdUser: body.usernameToken,
                                    createdTime: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                    updatedUser: null,
                                    updatedTime: null,
                                    selected: data.selected
                                };
                                selectedNew.push(selected);
                            }));
                        }
                        const menuOptionParent = yield roleDb.getDataRoleMenuOptionParent({ moduleId: body.moduleId });
                        let roleMenuOption = yield Promise.all(menuOptionParent.map((dataParent) => __awaiter(this, void 0, void 0, function* () {
                            const getChild = yield roleDb.getDataRoleMenuOptionChild({ moduleId: body.moduleId, menuId: dataParent.menuId });
                            let menuChild = yield Promise.all(getChild.map((dataChild) => __awaiter(this, void 0, void 0, function* () {
                                let child;
                                if (dataChild.menuType == 'parent') {
                                    const childNested = yield roleDb.getDataRoleMenuOptionChild({ moduleId: body.moduleId, menuId: dataChild.menuId });
                                    child = Object.assign(Object.assign({}, dataChild), { menuChildren: childNested });
                                    return child;
                                }
                                else {
                                    return dataChild;
                                }
                            })));
                            const menuOption = Object.assign(Object.assign({}, dataParent), { menuChildren: menuChild });
                            return menuOption;
                        })));
                        let updatedTime;
                        if (getDetailRole.data.updatedTime == null) {
                            updatedTime = null;
                        }
                        else {
                            updatedTime = moment(getDetailRole.data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        }
                        const dataRequest = {
                            username: body.usernameToken,
                            moduleId: body.moduleId,
                            menuId: '005',
                            backendUrl: '/credential/role/mapping',
                            method: 'POST',
                            menuData: {
                                role: {
                                    id: body.id,
                                    roleId: getDetailRole.data.roleId,
                                    roleName: getDetailRole.data.roleName,
                                    createdUser: getDetailRole.data.createdUser,
                                    createdTime: moment(getDetailRole.data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                    updatedUser: getDetailRole.data.updatedUser,
                                    updatedTime: updatedTime
                                },
                                menu: {
                                    option: roleMenuOption,
                                    selected: selectedOld
                                }
                            },
                            menuDataNew: {
                                role: {
                                    id: body.id,
                                    roleId: getDetailRole.data.roleId,
                                    roleName: getDetailRole.data.roleName,
                                    createdUser: getDetailRole.data.createdUser,
                                    createdTime: moment(getDetailRole.data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                    updatedUser: getDetailRole.data.updatedUser,
                                    updatedTime: updatedTime
                                },
                                menu: {
                                    selected: selectedNew
                                }
                            },
                            keyId: getDetailRole.data.roleId,
                            keyName: getDetailRole.data.roleName
                        };
                        // console.log('datareeq', dataRequest);
                        const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                        // console.log('workf', workflowRequest);
                        let menuId = [];
                        if (workflowRequest.status == 'completed') {
                            let insertData;
                            const getRoleId = yield roleDb.getDataRoleDetail({ rowId: body.id });
                            if (body.selected.length > 0) {
                                let sql = [];
                                yield Promise.all(body.selected.map((role, index) => __awaiter(this, void 0, void 0, function* () {
                                    const data = Object.assign({ id: body.id, usernameToken: body.usernameToken, moduleId: body.moduleId }, role);
                                    // console.log('data', data);
                                    const validasiRole = yield makeRole(data);
                                    const checkDataMenu = yield roleDb.checkDataMenu(validasiRole);
                                    // console.log('checkDataMenu', checkDataMenu);
                                    let info;
                                    if (checkDataMenu == true) {
                                        const checkDataNotSame = yield roleDb.checkDataUpdateSame(validasiRole);
                                        console.log('checkdatasame', checkDataNotSame);
                                        if (checkDataNotSame == true) {
                                            console.log('data tidak sama');
                                            info = `UPDATE m_role_menu SET 
                            selected = '${validasiRole.getSelected()}', 
                            access_view = ${validasiRole.getAccessView()}, 
                            access_create= ${validasiRole.getAccessCreate()},
                            access_update= ${validasiRole.getAccessUpdate()}, 
                            access_delete= ${validasiRole.getAccessDelete()},
                            updated_user = '${validasiRole.getUsernameToken()}',
                            updated_time = '${validasiRole.getUpdatedTime()}' 
                            WHERE EXISTS (SELECT 1 FROM (SELECT module_id, role_id
                            FROM m_role mr WHERE id = ${validasiRole.getId()}) mr WHERE mr.module_id = m_role_menu.module_id AND
                            mr.role_id = m_role_menu.role_id) AND m_role_menu.menu_id = '${validasiRole.getMenuId()}'`;
                                            sql.push(info);
                                        }
                                        console.log('data sama');
                                    }
                                    else {
                                        info = `INSERT INTO m_role_menu (module_id, role_id, menu_id, selected, access_view, 
                      access_create, access_update, access_delete, created_user, created_time) 
                      VALUES ( (SELECT module_id FROM m_role WHERE id = ${validasiRole.getId()}),
                              (SELECT role_id FROM m_role WHERE id = ${validasiRole.getId()}), 
                              '${validasiRole.getMenuId()}', 
                              ${validasiRole.getSelected()},
                              ${validasiRole.getAccessView()},
                              ${validasiRole.getAccessCreate()},
                              ${validasiRole.getAccessUpdate()},
                              ${validasiRole.getAccessDelete()}, 
                              '${validasiRole.getUsernameToken()}', 
                              '${validasiRole.getCreatedTime()}') `;
                                        sql.push(info);
                                    }
                                    menuId.push(role.menuId);
                                })));
                                if (sql.length > 0) {
                                    insertData = yield roleDb.inputDataRoleMapping({ sql: sql, id: menuId, moduleId: body.moduleId, roleId: getRoleId.data.roleId });
                                }
                                else {
                                    insertData = {
                                        status: 'completed',
                                        code: 200,
                                    };
                                }
                            }
                            else {
                                const temp = {
                                    status: 'completed',
                                    code: 200,
                                };
                                insertData = temp;
                            }
                            if (insertData.code == 200) {
                                if (body.selected.length == 0) {
                                    const deleteDataNotSelected = yield roleDb.deleteDataRoleNotMapping({ moduleId: body.moduleId, roleId: getRoleId.data.roleId, selected: false });
                                }
                                const entityNotif = yield makeNotification({
                                    moduleId: body.moduleId,
                                    username: body.usernameToken,
                                    title: 'Role Mapping Baru Diperbarui',
                                    titleGlob: 'New Updated Role Mapping',
                                    message: body.selected.length + ' Role',
                                    messageGlob: body.selected.length + ' Role',
                                    status: 0
                                });
                                const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                console.log('sendNotif', sendNotification);
                                result = {
                                    status: insertData.status,
                                    responseCode: insertData.code,
                                    data: {
                                        locl: 'Role Mapping Berhasil Diperbarui',
                                        glob: 'Role Mapping Updated Successfully'
                                    }
                                };
                            }
                            else {
                                result = {
                                    status: insertData.status,
                                    responseCode: insertData.code,
                                    data: {
                                        locl: insertData.data,
                                        glob: insertData.data
                                    }
                                };
                            }
                        }
                        else if (workflowRequest.status == 'pending') {
                            const getListRole = yield userDb.getListRoleNotifWorkflow();
                            yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                                const entityNotif = yield makeNotification({
                                    moduleId: body.moduleId,
                                    username: data.username,
                                    title: 'Permintaan Persetujuan Role',
                                    titleGlob: 'Role Approval Request',
                                    message: '1 Role',
                                    messageGlob: '1 Role',
                                    status: 0
                                });
                                const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                console.log('sendNotif', sendNotification);
                            }));
                            const entityNotif = yield makeNotification({
                                moduleId: body.moduleId,
                                username: body.username,
                                title: 'Data Role berhasil dikirim dan sedang menunggu persetujuan',
                                titleGlob: 'Data Role sent successfully and waiting for approval ',
                                message: '1 Role',
                                messageGlob: '1 Role',
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
                        else {
                            if (workflowRequest.responseCode == 406) {
                                const errCode = yield roleDb.getErrorCode({ info: 'waiting' });
                                result = {
                                    status: false,
                                    responseCode: 406,
                                    data: {
                                        locl: errCode.local,
                                        glob: errCode.global
                                    }
                                };
                            }
                            else if (workflowRequest.responseCode == 500) {
                                result = {
                                    status: false,
                                    responseCode: 500,
                                    data: {
                                        locl: workflowRequest.data,
                                        glob: workflowRequest.data
                                    }
                                };
                            }
                            else {
                                result = {
                                    status: workflowRequest.status,
                                    responseCode: workflowRequest.responseCode,
                                    data: {
                                        locl: 'Data Gagal Dikirim',
                                        glob: 'Data Sent Failed'
                                    }
                                };
                            }
                        }
                    }
                    else {
                        const errCode = yield roleDb.getErrorCode({ info: 'waiting' });
                        result = {
                            status: false,
                            responseCode: 406,
                            data: {
                                locl: errCode.local,
                                glob: errCode.global
                            }
                        };
                    }
                }
                else {
                    result = {
                        status: false,
                        responseCode: 500,
                        data: {
                            locl: checkWorkflow.data,
                            glob: checkWorkflow.data
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
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '005', backendUrl: '/credential/role/mapping', method: 'POST' });
                let result;
                if (checkWorkflowOn == true) {
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '005', backendUrl: '/credential/role/mapping' });
                    if (getDataWorkflow.status == true) {
                        if (getDataWorkflow.data.length > 0) {
                            function validasiRoleId(workflow) {
                                console.log('role mapping', workflow);
                                return workflow.id === flow.id;
                            }
                            const find = getDataWorkflow.data.find(validasiRoleId);
                            if (find != undefined) {
                                result = { status: true, data: false };
                            }
                            else {
                                result = { status: true, data: true };
                            }
                        }
                        else {
                            result = { status: true, data: true };
                        }
                    }
                    else {
                        result = { status: false, data: getDataWorkflow.data };
                    }
                }
                else {
                    result = { status: true, data: true };
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = makeUpdateRoleMapping;

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
function makeInternalUpdateRoleMapping({ roleDb, makeRole, userDb, makeNotification }) {
    return function internalUpdateRoleMapping(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRoleId = yield roleDb.getDataRoleDetail({ rowId: body.id });
                let menuId = [];
                let insertData;
                let mappingRole = body.selected;
                if (mappingRole.length > 0) {
                    let sql = [];
                    yield Promise.all(mappingRole.map((role) => __awaiter(this, void 0, void 0, function* () {
                        delete role.createdUser;
                        delete role.createdTime;
                        delete role.updatedUser;
                        delete role.updatedTime;
                        const data = Object.assign({ id: body.id, usernameToken: body.username, moduleId: body.moduleId }, role);
                        const validasiRole = yield makeRole(data);
                        const checkDataMenu = yield roleDb.checkDataMenu(validasiRole);
                        console.log('validasi role', validasiRole.getUpdatedTime());
                        let info;
                        if (checkDataMenu == true) {
                            const checkDataNotSame = yield roleDb.checkDataUpdateSame(validasiRole);
                            console.log('checkdatasame', checkDataNotSame);
                            if (checkDataNotSame == true) {
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
                        }
                        else {
                            info = `INSERT INTO m_role_menu (module_id, role_id, menu_id, selected, access_view, 
                      access_create, access_update, access_delete, created_user, created_time) 
                      VALUES ( (SELECT module_id FROM m_role WHERE id = ${validasiRole.getId()}),
                                (SELECT role_id FROM m_role WHERE id = ${validasiRole.getId()}), 
                                '${validasiRole.getMenuId()}',  ${validasiRole.getSelected()},
                                ${validasiRole.getAccessView()}, ${validasiRole.getAccessCreate()},
                                ${validasiRole.getAccessUpdate()}, ${validasiRole.getAccessDelete()}, 
                                '${validasiRole.getUsernameToken()}', '${validasiRole.getCreatedTime()}') `;
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
                            data: 'Role mapping updated successfully.'
                        };
                    }
                }
                else {
                    const temp = {
                        status: 'completed',
                        code: 200,
                        data: 'Role mapping updated successfully.'
                    };
                    insertData = temp;
                }
                let result;
                if (insertData.code == 200) {
                    if (mappingRole.length == 0) {
                        yield roleDb.deleteDataRoleNotMapping({ id: menuId, moduleId: body.moduleId, roleId: getRoleId.data.roleId, selected: true });
                    }
                    const entityNotif = yield makeNotification({
                        moduleId: body.moduleId,
                        username: body.username,
                        title: 'Permintaan Persetujuan Role Telah Disetujui Oleh Approver',
                        titleGlob: 'Role Approval Request Has Been Approved By Approver',
                        message: '1 Role',
                        messageGlob: '1 Role',
                        status: 0
                    });
                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                    console.log('sendNotif', sendNotification);
                    result = {
                        status: true,
                        responseCode: 200,
                        data: 'Role mapping updated successfully.'
                    };
                }
                else {
                    result = {
                        status: false,
                        responseCode: insertData.code,
                        data: insertData.data
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeInternalUpdateRoleMapping' + error);
            }
        });
    };
}
exports.default = makeInternalUpdateRoleMapping;

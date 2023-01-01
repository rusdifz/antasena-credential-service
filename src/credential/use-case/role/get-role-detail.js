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
function makeGetRoleDetail({ roleDb, moment }) {
    return function getRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield roleDb.getDataRoleDetail(body);
                let result;
                if (role.status == true) {
                    let roleData;
                    let menu;
                    if (role.responseCode == 200) {
                        let updatedTime;
                        if (role.data.updatedTime == null) {
                            updatedTime = null;
                        }
                        else {
                            updatedTime = moment(role.data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        }
                        roleData = {
                            id: role.data.id,
                            roleId: role.data.roleId,
                            roleName: role.data.roleName,
                            createdUser: role.data.createdUser,
                            createdTime: moment(role.data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                            updatedUser: role.data.updatedUser,
                            updatedTime: updatedTime
                        };
                        const roleMenuSelection = yield roleDb.getDataRoleMenuSelection({ id: body.rowId });
                        const menuOptionParent = yield roleDb.getDataRoleMenuOptionParent(body);
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
                            let menuOption;
                            if (dataParent.menuId == '019' || dataParent.menuId == '020') {
                                menuOption = Object.assign({}, dataParent);
                            }
                            else {
                                menuOption = Object.assign(Object.assign({}, dataParent), { menuChildren: menuChild });
                            }
                            return menuOption;
                        })));
                        menu = {
                            option: roleMenuOption,
                            selected: roleMenuSelection
                        };
                    }
                    else {
                        roleData = {};
                        menu = {};
                    }
                    const detail = {
                        role: roleData,
                        menu: menu,
                    };
                    result = {
                        status: role.status,
                        responseCode: 200,
                        data: detail
                    };
                }
                else {
                    result = role;
                }
                return result;
            }
            catch (error) {
                console.log('catch');
                throw new Error(error);
            }
        });
    };
}
exports.default = makeGetRoleDetail;

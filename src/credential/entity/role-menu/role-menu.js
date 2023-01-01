"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeRoleMenu(moment) {
    return function makeRoleMenu({ roleId = '', menuId = '', accessCreate = 'true', accessUpdate = 'true', accessView = 'true', accessDelete = 'true', createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), updatedTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss') } = {}) {
        if (!roleId) {
            throw new Error('role id must be exist');
        }
        if (!menuId) {
            throw new Error('menu id must be exist');
        }
        return Object.freeze({
            getRoleId: () => roleId,
            getMenuId: () => menuId,
            getAccessCreate: () => accessCreate,
            getAccessUpdate: () => accessUpdate,
            getAccessView: () => accessView,
            getAccessDelete: () => accessDelete,
            getCreatedTime: () => createdTime,
            getUpdatedTime: () => updatedTime
        });
    };
}
exports.default = buildMakeRoleMenu;

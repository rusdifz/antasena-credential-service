"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeRole(moment) {
    return function makeRole({ id = '', roleId = '', roleName = '', moduleId = '', menuId = '', username = '', usernameToken = '', select = '', accessCreate = '', accessUpdate = '', accessView = '', accessDelete = '', createdUser = '', updatedUser = '', createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), updatedTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss') } = {}) {
        // let statusValid
        // let dataNotValid = new Object()
        let selected;
        if (select == 'inc') {
            selected = -1;
        }
        else if (select == 'no') {
            selected = 0;
        }
        else {
            selected = 1;
        }
        // if(!roleId || roleId == ''){
        //   dataNotValid['role_id'] = 'role id must be filled'
        // }
        // if(!roleName || roleName == ''){
        //   dataNotValid['role_name'] = 'role name must be filled'
        // }
        // if(JSON.stringify(dataNotValid) === '{}' || dataNotValid === '{}' || JSON.stringify(dataNotValid) === JSON.stringify({})){
        //   statusValid = 'true'
        // }else{
        //   statusValid = 'false'
        // }
        // if(statusValid == 'true'){
        return Object.freeze({
            // statusValid,
            getId: () => id,
            getRoleId: () => roleId,
            getModuleId: () => moduleId,
            getMenuId: () => menuId,
            getRoleName: () => roleName,
            getUsername: () => username,
            getUsernameToken: () => usernameToken,
            getSelected: () => selected,
            getAccessCreate: () => accessCreate,
            getAccessUpdate: () => accessUpdate,
            getAccessView: () => accessView,
            getAccessDelete: () => accessDelete,
            getCreatedUser: () => createdUser,
            getUpdatedUser: () => updatedUser,
            getCreatedTime: () => createdTime,
            getUpdatedTime: () => updatedTime
        });
        // }else{
        //   return Object.freeze({
        //     statusValid, 
        //     data: dataNotValid
        //   })
        // }
    };
}
exports.default = buildMakeRole;

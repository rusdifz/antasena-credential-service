"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeUser(moment) {
    return function MakeUser({ rowId = 0, roleId = [], deptId = '', groupId = '', branchId = [], nik = '', name = '', password = '', lastUpdatedPassword = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), periodeUsage = '', expiredDate = '', status = 'active', statusDate = '', blockReason = '', userReport = '', moduleId = '', id = 0, username = '', email = '', fullname = '', createdBy = '', aView = '', aCreate = '', aUpdate = '', aDelete = '', sequence = 1, createdUser = '', updatedUser = '', createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), updatedTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss') } = {}) {
        // let statusValid
        // let dataNotValid = new Object()
        // if(!username || username == ''){
        //   dataNotValid['username'] = 'username must be filled'
        // }
        // if(!password || password == ''){
        //   dataNotValid['password'] = 'password must be filled'
        // }
        // if(!nik || nik == ''){
        //   dataNotValid['nik'] = 'nik must be filled'
        // }
        // if(!roleId || roleId == []){
        //   dataNotValid['role_id'] = 'role id must be filled'
        // }
        // if(!branchId || branchId == []){
        //   dataNotValid['branch_id'] = 'branch id must be filled'
        // }
        // if(JSON.stringify(dataNotValid) === '{}' || dataNotValid === '{}' || JSON.stringify(dataNotValid) === JSON.stringify({})){
        //   statusValid = 'true'
        // }else{
        //   statusValid = 'false'
        // }
        // if(statusValid == 'true'){
        return Object.freeze({
            // statusValid: statusValid,
            getRowId: () => rowId,
            getRoleId: () => roleId,
            getDeptId: () => deptId,
            getGroupId: () => groupId,
            getBranchId: () => branchId,
            getNik: () => nik,
            getName: () => name,
            getPassword: () => password,
            getLastUpdatedPassword: () => lastUpdatedPassword,
            getPeriodeUsage: () => periodeUsage,
            getExpiredDate: () => expiredDate,
            getStatus: () => status,
            getStatusDate: () => statusDate,
            getBlockReason: () => blockReason,
            getUserReport: () => userReport,
            getId: () => id,
            getModuleId: () => moduleId,
            getUsername: () => username,
            getEmail: () => email,
            getFullname: () => fullname,
            getCreatedBy: () => createdBy,
            getAccessView: () => aView,
            getAccessCreate: () => aCreate,
            getAccessUpdate: () => aUpdate,
            getAccessDelete: () => aDelete,
            getSequence: () => sequence,
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
exports.default = buildMakeUser;

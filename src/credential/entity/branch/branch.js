"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeBranch(moment) {
    return function makeBranch({ id = '', moduleId = '', branchId = '', branchName = '', username = '', usernameToken = '', createdUser = '', updatedUser = '', createdTime = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'), updatedTime = moment().format('YYYY-MM-DD HH:mm:ss') } = {}) {
        let statusValid;
        let dataNotValid = new Object();
        // if(!branchId || branchId == ''){
        //   dataNotValid['branch_id'] = 'branch id must be filled'
        // }
        // if(!branchName || branchName == ''){
        //   dataNotValid['branch_name'] = 'branch name must be filled'
        // }
        // if(JSON.stringify(dataNotValid) === '{}' || dataNotValid === '{}' || JSON.stringify(dataNotValid) === JSON.stringify({})){
        //   statusValid = 'true'
        // }else{
        //   statusValid = 'false'
        // }
        // if(statusValid == 'true'){
        return Object.freeze({
            // statusValid: statusValid,
            getId: () => id,
            getModuleId: () => moduleId,
            getBranchId: () => branchId,
            getBranchName: () => branchName,
            getUsername: () => username,
            getUsernameToken: () => usernameToken,
            getCreatedUser: () => createdUser,
            getUpdatedUser: () => updatedUser,
            getCreatedTime: () => createdTime,
            getUpdatedTime: () => updatedTime
        });
        // }else{
        //   return Object.freeze({
        //     statusValid: statusValid, 
        //     data: dataNotValid
        //   })
        // }
    };
}
exports.default = buildMakeBranch;

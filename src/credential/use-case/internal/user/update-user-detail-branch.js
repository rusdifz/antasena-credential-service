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
function makeInternalUpdateUserDetailBranch({ userDb, makeBranch, makeNotification }) {
    return function internalUpdateUserDetailBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const branches = body.branches.selected;
                let updateBranch;
                let branchId = [];
                if (branches.length > 0) {
                    const sql = yield Promise.all(branches.map((data) => __awaiter(this, void 0, void 0, function* () {
                        const branch = yield makeBranch({
                            username: body.user.username,
                            moduleId: body.moduleId,
                            usernameToken: body.usernameToken,
                            branchId: data.branchId
                        });
                        const checkBranch = yield userDb.checkDataBranch(branch);
                        let info;
                        if (checkBranch == true) {
                            info = `UPDATE m_user_branch_rpt SET 
                        branch_id = '${branch.getBranchId()}', 
                        updated_user = '${branch.getUsernameToken()}',
                        updated_time = '${branch.getUpdatedTime()}' 
                        WHERE module_id = '${branch.getModuleId()}' AND username = '${branch.getUsername()}' 
                        AND branch_id = '${branch.getBranchId()}'`;
                        }
                        else {
                            info = `INSERT INTO m_user_branch_rpt (username, module_id, branch_id, created_user, created_time) 
                        VALUES ('${branch.getUsername()}', 
                                '${branch.getModuleId()}', 
                                '${branch.getBranchId()}', 
                                '${branch.getUsernameToken()}', 
                                '${branch.getCreatedTime()}')`;
                        }
                        branchId.push(data.branchId);
                        return info;
                    })));
                    updateBranch = yield userDb.inputDataBranchSelected({ sql: sql, id: branchId, moduleId: body.moduleId, username: body.user.username });
                }
                else {
                    const temp = {
                        status: 'completed',
                        code: 200
                    };
                    updateBranch = temp;
                }
                if (updateBranch.code == 200) {
                    if (branches.length == 0) {
                        yield userDb.deleteDataBranchNotSelected({ moduleId: body.moduleId, username: body.user.username, selected: false });
                    }
                    const entityNotif = yield makeNotification({
                        moduleId: body.moduleId,
                        username: body.usernameToken,
                        title: 'Permintaan Kantor Cabang  Pengguna Telah Disetujui Oleh Approver',
                        titleGlob: 'User Branch Approval Request Has Been Approved By Approver',
                        message: branches.length + ' User',
                        messageGlob: branches.length + ' User',
                        status: 0
                    });
                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                    console.log('sendNotif', sendNotification);
                    result = {
                        status: updateBranch.status,
                        responseCode: updateBranch.code,
                        data: 'Data updated successfully'
                    };
                }
                else {
                    result = {
                        status: updateBranch.status,
                        responseCode: updateBranch.code,
                        data: updateBranch.data
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeInternalUpdateUserDetailBranch' + error);
            }
        });
    };
}
exports.default = makeInternalUpdateUserDetailBranch;

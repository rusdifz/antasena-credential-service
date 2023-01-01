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
function makeUpdateUserDetailBranch({ userDb, makeBranch, makeNotification, internalServer }) {
    return function updateUserDetailBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const checkWorkflow = yield validasiWorkflow(body);
                if (checkWorkflow == true) {
                    const branchSelectionOld = yield userDb.getDataUserBranchSelection({ moduleId: body.moduleId, username: body.user.username });
                    const branchSelectedOld = yield userDb.getDataUserBranchSelected({ moduleId: body.moduleId, username: body.user.username });
                    const menuDataOld = {
                        user: body.user,
                        branches: {
                            selection: branchSelectionOld.data,
                            selected: branchSelectedOld.data
                        }
                    };
                    const dataRequest = {
                        username: body.usernameToken,
                        moduleId: body.moduleId,
                        menuId: '004',
                        backendUrl: '/credential/user/detail/branch',
                        method: 'POST',
                        menuData: menuDataOld,
                        menuDataNew: { user: body.user, branches: body.branches },
                        keyId: body.user.username,
                        keyName: body.user.fullname
                    };
                    const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                    if (workflowRequest.status == 'pending') {
                        const getListRole = yield userDb.getListRoleNotifWorkflow();
                        yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                            const entityNotif = yield makeNotification({
                                moduleId: body.moduleId,
                                username: data.username,
                                title: 'Permintaan Persetujuan Kantor Cabang Pengguna',
                                titleGlob: 'User Branch Approval Request Has Been revised',
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
                            title: 'Data Kantor Cabang Pengguna berhasil dikirim dan sedang menunggu persetujuan',
                            titleGlob: 'Data User Branch sent successfully and waiting for approval ',
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
                        const branches = body.branches.selected;
                        let branchId = [];
                        let updateBranch;
                        if (branches.length > 0) {
                            const sql = yield Promise.all(branches.map((data, index) => __awaiter(this, void 0, void 0, function* () {
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
                                title: 'Kantor Cabang Pengguna Baru Diperbarui',
                                titleGlob: 'New Updated User Branch',
                                message: branches.length + ' User',
                                messageGlob: branches.length + ' User',
                                status: 0
                            });
                            const sendNotification = yield userDb.inputDataNotification(entityNotif);
                            console.log('sendNotif', sendNotification);
                            result = {
                                status: updateBranch.status,
                                responseCode: updateBranch.code,
                                data: {
                                    locl: 'Pengguna Berhasil Diperbarui',
                                    glob: 'User Updated Successfully'
                                }
                            };
                        }
                        else {
                            result = {
                                status: updateBranch.status,
                                responseCode: updateBranch.code,
                                data: {
                                    locl: 'Konfigurasi Gagal',
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
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '004', backendUrl: '/credential/user/detail/branch', method: 'POST' });
                let result;
                if (checkWorkflowOn == true) {
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '004', backendUrl: '/credential/user/detail/branch' });
                    if (getDataWorkflow.data.length > 0) {
                        function validasiId(workflow) {
                            return workflow.user.id === flow.user.id;
                        }
                        const find = getDataWorkflow.data.find(validasiId);
                        if (find != undefined) {
                            result = false;
                        }
                        else {
                            result = true;
                        }
                    }
                    else {
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
exports.default = makeUpdateUserDetailBranch;

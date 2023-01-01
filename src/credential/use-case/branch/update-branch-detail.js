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
function makeUpdateBranchDetail({ branchDb, userDb, makeBranch, makeNotification, internalServer, moment }) {
    return function updateBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = {
                    id: body.id || body.rowId,
                    moduleId: body.moduleId,
                    branchId: body.branchId,
                    branchName: body.branchName,
                    usernameToken: body.usernameToken,
                };
                const branch = yield makeBranch(entity);
                const validasiBusiness = yield branchDb.validasiBranch(Object.assign(Object.assign({}, branch), { info: 'update' }));
                let result;
                if (validasiBusiness.status == true) {
                    const checkWorkflow = yield validasiWorkflow(branch);
                    if (checkWorkflow.status == true) {
                        if (checkWorkflow.data == 'true') {
                            const getDataOld = yield branchDb.getDataBranchDetail({ rowId: branch.getId() });
                            const dataRequest = {
                                username: branch.getUsernameToken(),
                                moduleId: branch.getModuleId(),
                                menuId: '006',
                                backendUrl: '/credential/branch/detail',
                                method: 'POST',
                                menuData: getDataOld.data,
                                menuDataNew: {
                                    id: branch.getId(),
                                    branchId: branch.getBranchId(),
                                    branchName: branch.getBranchName(),
                                    createdUser: getDataOld.data.createdUser,
                                    createdTime: moment(getDataOld.data.createdTime).format('YYYY-MM-DD HH:mm:ss'),
                                    updatedUser: branch.getUsernameToken(),
                                    updatedTime: branch.getUpdatedTime()
                                },
                                keyId: branch.getBranchId(),
                                keyName: branch.getBranchName()
                            };
                            const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                            if (workflowRequest.status == 'pending') {
                                const getListRole = yield userDb.getListRoleNotifWorkflow();
                                yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                                    const entityNotif = yield makeNotification({
                                        moduleId: branch.getModuleId(),
                                        username: data.username,
                                        title: 'Permintaan Persetujuan Cabang',
                                        titleGlob: 'Branch Approval Request',
                                        message: '1 Cabang',
                                        messageGlob: '1 Branch',
                                        status: 0
                                    });
                                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                    console.log('sendNotif', sendNotification);
                                }));
                                const entityNotif = yield makeNotification({
                                    moduleId: branch.getModuleId(),
                                    username: branch.getUsernameToken(),
                                    title: 'Data Cabang berhasil dikirim dan sedang menunggu persetujuan',
                                    titleGlob: 'Data Branch sent successfully and waiting for approval ',
                                    message: '1 Cabang',
                                    messageGlob: '1 Branch',
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
                                const update = yield branchDb.updateDataBranchDetail(branch);
                                if (update.code == 200) {
                                    const entityNotif = yield makeNotification({
                                        moduleId: branch.getModuleId(),
                                        username: branch.getUsernameToken(),
                                        title: 'Cabang Baru Diperbarui',
                                        titleGlob: 'New Updated Branch',
                                        message: '1 Cabang',
                                        messageGlob: '1 Branch',
                                        status: 0
                                    });
                                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                    console.log('sendNotif', sendNotification);
                                }
                                result = {
                                    status: update.status,
                                    responseCode: update.code,
                                    data: {
                                        locl: update.message,
                                        glob: update.messageGlob
                                    }
                                };
                            }
                            else {
                                if (workflowRequest.responseCode == 406) {
                                    const errCode = yield branchDb.getErrorCode({ info: 'waiting' });
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
                            const errCode = yield branchDb.getErrorCode({ info: checkWorkflow });
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
                            data: checkWorkflow.data
                        };
                    }
                }
                else {
                    result = {
                        status: false,
                        responseCode: 406,
                        data: validasiBusiness.data
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
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '006', backendUrl: '/credential/branch/detail', method: 'POST' });
                let result;
                if (checkWorkflowOn == true) {
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '006', backendUrl: '/credential/branch/detail' });
                    if (getDataWorkflow.status == true) {
                        if (getDataWorkflow.data.length > 0) {
                            function validasiBranchId(workflow) {
                                return workflow.branchId === flow.getBranchId();
                            }
                            function validasiBranchName(workflow) {
                                return workflow.branchName === flow.getBranchName();
                            }
                            const find = getDataWorkflow.data.find(validasiBranchId);
                            if (find != undefined) {
                                result = { status: true, data: 'waiting' };
                            }
                            else {
                                const findName = getDataWorkflow.data.find(validasiBranchName);
                                if (findName != undefined) {
                                    if (findName.branchId == flow.getBranchId()) {
                                        result = { status: true, data: 'true' };
                                    }
                                    else {
                                        result = { status: true, data: 'false name' };
                                    }
                                }
                                else {
                                    result = { status: true, data: 'true' };
                                }
                            }
                        }
                        else {
                            result = { status: true, data: 'true' };
                        }
                    }
                    else {
                        result = { status: false, data: getDataWorkflow.data };
                    }
                }
                else {
                    result = { status: true, data: 'true' };
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = makeUpdateBranchDetail;
